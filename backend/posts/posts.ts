import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getAuthData } from "~encore/auth";

// Reference the same database that auth service created
const db = SQLDatabase.named("app");

// Post interface
export interface Post {
  id: string;
  content: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Create post request
export interface CreatePostRequest {
  content: string;
  coverImage?: string | null;
}

// Update post request
export interface UpdatePostRequest {
  id: string;
  content?: string;
  coverImage?: string | null;
}

// List posts response
export interface ListPostsResponse {
  posts: Post[];
}

// Creates a new post
export const create = api<CreatePostRequest, Post>(
  { auth: true, expose: true, method: "POST", path: "/posts" },
  async (req) => {
    const auth = getAuthData()!;

    if (!req.content?.trim()) {
      throw APIError.invalidArgument("content is required");
    }

    const post = await db.queryRow<{
      id: string;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO posts (user_id, content, cover_image, created_at, updated_at)
      VALUES (${auth.userID}, ${req.content}, ${req.coverImage || null}, NOW(), NOW())
      RETURNING id, created_at, updated_at
    `;

    if (!post) {
      throw APIError.internal("failed to create post");
    }

    return {
      id: post.id,
      content: req.content,
      coverImage: req.coverImage || null,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  }
);

// Lists all posts for the current user
export const list = api<void, ListPostsResponse>(
  { auth: true, expose: true, method: "GET", path: "/posts" },
  async () => {
    const auth = getAuthData()!;

    const posts = await db.queryAll<{
      id: string;
      content: string;
      cover_image: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, content, cover_image, created_at, updated_at
      FROM posts
      WHERE user_id = ${auth.userID}
      ORDER BY updated_at DESC
    `;

    return {
      posts: posts.map((post) => ({
        id: post.id,
        content: post.content,
        coverImage: post.cover_image,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      })),
    };
  }
);

// Updates an existing post
export const update = api<UpdatePostRequest, Post>(
  { auth: true, expose: true, method: "PUT", path: "/posts/:id" },
  async (req) => {
    const auth = getAuthData()!;

    // Check if post exists and belongs to user
    const existingPost = await db.queryRow`
      SELECT id FROM posts WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;

    if (!existingPost) {
      throw APIError.notFound("post not found");
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (req.content !== undefined) {
      updates.push(`content = $${values.length + 1}`);
      values.push(req.content);
    }

    if (req.coverImage !== undefined) {
      updates.push(`cover_image = $${values.length + 1}`);
      values.push(req.coverImage);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);

    const post = await db.queryRow<{
      id: string;
      content: string;
      cover_image: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `UPDATE posts SET ${updates.join(", ")} WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING id, content, cover_image, created_at, updated_at`,
      ...values,
      req.id,
      auth.userID
    );

    if (!post) {
      throw APIError.internal("failed to update post");
    }

    return {
      id: post.id,
      content: post.content,
      coverImage: post.cover_image,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  }
);

// Deletes a post
export const remove = api<{ id: string }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/posts/:id" },
  async (req) => {
    const auth = getAuthData()!;

    const result = await db.exec`
      DELETE FROM posts WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;

    // Note: Encore doesn't provide affected rows count, so we can't check if the post was actually deleted
    // The operation will succeed even if the post didn't exist
  }
);

// Saves autosave data
export const autosave = api<CreatePostRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/posts/autosave" },
  async (req) => {
    const auth = getAuthData()!;

    if (!req.content?.trim()) {
      return { success: true }; // Skip empty content
    }

    // Delete existing autosave
    await db.exec`
      DELETE FROM autosaves WHERE user_id = ${auth.userID}
    `;

    // Create new autosave
    await db.exec`
      INSERT INTO autosaves (user_id, content, cover_image, created_at)
      VALUES (${auth.userID}, ${req.content}, ${req.coverImage || null}, NOW())
    `;

    return { success: true };
  }
);

// Response for getAutosave
interface GetAutosaveResponse {
  post?: Post;
}

// Gets autosave data
export const getAutosave = api<void, GetAutosaveResponse>(
  { auth: true, expose: true, method: "GET", path: "/posts/autosave" },
  async () => {
    const auth = getAuthData()!;

    const autosaveData = await db.queryRow<{
      content: string;
      cover_image: string | null;
      created_at: Date;
    }>`
      SELECT content, cover_image, created_at
      FROM autosaves
      WHERE user_id = ${auth.userID}
    `;

    if (!autosaveData) {
      return {};
    }

    const post: Post = {
      id: "autosave",
      content: autosaveData.content,
      coverImage: autosaveData.cover_image,
      createdAt: autosaveData.created_at,
      updatedAt: autosaveData.created_at,
    };

    return { post };
  }
);
