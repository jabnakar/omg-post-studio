import { api, APIError, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";

// Shared database - define it only once
const db = new SQLDatabase("app", {
  migrations: "./migrations",
});

// JWT secret
const jwtSecret = secret("JWTSecret");

// Auth data interface
export interface AuthData {
  userID: string;
  email: string;
}

// Auth params interface
interface AuthParams {
  authorization?: Header<"Authorization">;
}

// Auth handler
const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      const decoded = verify(token, jwtSecret()) as any;
      return {
        userID: decoded.userID,
        email: decoded.email,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token");
    }
  }
);

export default auth;

// Register endpoint
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// Registers a new user
export const register = api<RegisterRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async ({ email, password }) => {
    // Validate input
    if (!email || !password) {
      throw APIError.invalidArgument("email and password are required");
    }

    if (password.length < 6) {
      throw APIError.invalidArgument("password must be at least 6 characters");
    }

    // Check if user exists
    const existingUser = await db.queryRow`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("user with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.queryRow<{ id: string }>`
      INSERT INTO users (email, password_hash, created_at)
      VALUES (${email}, ${hashedPassword}, NOW())
      RETURNING id
    `;

    if (!user) {
      throw APIError.internal("failed to create user");
    }

    // Generate JWT token
    const token = sign(
      { userID: user.id, email },
      jwtSecret(),
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email,
      },
    };
  }
);

// Login endpoint
export interface LoginRequest {
  email: string;
  password: string;
}

// Logs in a user
export const login = api<LoginRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async ({ email, password }) => {
    // Validate input
    if (!email || !password) {
      throw APIError.invalidArgument("email and password are required");
    }

    // Find user
    const user = await db.queryRow<{
      id: string;
      email: string;
      password_hash: string;
    }>`
      SELECT id, email, password_hash FROM users WHERE email = ${email}
    `;

    if (!user) {
      throw APIError.unauthenticated("invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw APIError.unauthenticated("invalid email or password");
    }

    // Generate JWT token
    const token = sign(
      { userID: user.id, email: user.email },
      jwtSecret(),
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
);

// Get current user info
export interface UserInfo {
  id: string;
  email: string;
}

// Gets the current user information
export const me = api<void, UserInfo>(
  { auth: true, expose: true, method: "GET", path: "/auth/me" },
  async () => {
    const authData = auth.data();
    if (!authData) {
      throw APIError.unauthenticated("not authenticated");
    }

    return {
      id: authData.userID,
      email: authData.email,
    };
  }
);
