import { api, APIError, Header } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { createClient, AuthApiError } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = secret("SupabaseURL");
const supabaseServiceKey = secret("SupabaseServiceKey");

const getSupabase = () => {
  return createClient(supabaseUrl(), supabaseServiceKey());
};

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

    const supabase = getSupabase();

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        throw APIError.alreadyExists("A user with this email already exists.");
      }
      throw APIError.internal(error.message);
    }

    if (!data.user || !data.session) {
      // This happens if email confirmation is enabled in Supabase.
      // The app flow expects immediate login, so we treat this as an error.
      throw APIError.internal("Registration failed: user data or session not returned. Please disable email confirmation in your Supabase project settings.");
    }

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email!,
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

    const supabase = getSupabase();

    // Sign in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        throw APIError.unauthenticated("Invalid email or password.");
      }
      throw APIError.internal(error.message);
    }

    if (!data.user || !data.session) {
      throw APIError.unauthenticated("Invalid email or password.");
    }

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
    };
  }
);

// Get current user info
export interface UserInfo {
  id: string;
  email: string;
}

interface MeRequest {
  authorization: Header<"Authorization">;
}

// Gets the current user information
export const me = api<MeRequest, UserInfo>(
  { expose: true, method: "GET", path: "/auth/me" },
  async (req) => {
    const authHeader = req.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw APIError.unauthenticated("missing or invalid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = getSupabase();

    // Get user from Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw APIError.unauthenticated("invalid token");
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    };
  }
);
