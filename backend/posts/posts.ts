import { api, APIError, Header } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = secret("SupabaseURL");
const supabaseServiceKey = secret("SupabaseServiceKey");

const getSupabase = () => {
  return createClient(supabaseUrl(), supabaseServiceKey());
};

// Helper function to get user ID from token
const getUserFromToken = async (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw APIError.unauthenticated("missing or invalid authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw APIError.unauthenticated("invalid token");
  }

  return data.user.id;
};

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
  authorization: Header<"Authorization">;
}

// Update post request
export interface UpdatePostRequest {
  id: string;
  content?: string;
  coverImage?: string | null;
  authorization: Header<"Authorization">;
}

// List posts response
export interface ListPostsResponse {
  posts: Post[];
}

interface ListPostsRequest {
  authorization: Header<"Authorization">;
}

// Creates a new post
export const create = api<CreatePostRequest, Post>(
  { expose: true, method: "POST", path: "/posts" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    if (!req.content?.trim()) {
      throw APIError.invalidArgument("content is required");
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content: req.content,
        cover_image: req.coverImage || null,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("failed to create post: " + error.message);
    }

    return {
      id: data.id,
      content: data.content,
      coverImage: data.cover_image,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
);

// Lists all posts for the current user
export const list = api<ListPostsRequest, ListPostsResponse>(
  { expose: true, method: "GET", path: "/posts" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw APIError.internal("failed to fetch posts: " + error.message);
    }

    return {
      posts: data.map((post) => ({
        id: post.id,
        content: post.content,
        coverImage: post.cover_image,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
      })),
    };
  }
);

// Updates an existing post
export const update = api<UpdatePostRequest, Post>(
  { expose: true, method: "PUT", path: "/posts/:id" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    const supabase = getSupabase();

    // Check if post exists and belongs to user
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", req.id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingPost) {
      throw APIError.notFound("post not found");
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (req.content !== undefined) {
      updates.content = req.content;
    }

    if (req.coverImage !== undefined) {
      updates.cover_image = req.coverImage;
    }

    if (Object.keys(updates).length === 1) {
      throw APIError.invalidArgument("no fields to update");
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", req.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw APIError.internal("failed to update post: " + error.message);
    }

    return {
      id: data.id,
      content: data.content,
      coverImage: data.cover_image,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
);

interface RemovePostRequest {
  id: string;
  authorization: Header<"Authorization">;
}

// Deletes a post
export const remove = api<RemovePostRequest, void>(
  { expose: true, method: "DELETE", path: "/posts/:id" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    const supabase = getSupabase();

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", req.id)
      .eq("user_id", userId);

    if (error) {
      throw APIError.internal("failed to delete post: " + error.message);
    }
  }
);

interface AutosaveRequest {
  content: string;
  coverImage?: string | null;
  authorization: Header<"Authorization">;
}

// Saves autosave data
export const autosave = api<AutosaveRequest, { success: boolean }>(
  { expose: true, method: "POST", path: "/posts/autosave" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    if (!req.content?.trim()) {
      return { success: true }; // Skip empty content
    }

    const supabase = getSupabase();

    // Upsert autosave data
    const { error } = await supabase
      .from("autosaves")
      .upsert({
        user_id: userId,
        content: req.content,
        cover_image: req.coverImage || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw APIError.internal("failed to save autosave: " + error.message);
    }

    return { success: true };
  }
);

// Response for getAutosave
interface GetAutosaveResponse {
  post?: Post;
}

interface GetAutosaveRequest {
  authorization: Header<"Authorization">;
}

// Gets autosave data
export const getAutosave = api<GetAutosaveRequest, GetAutosaveResponse>(
  { expose: true, method: "GET", path: "/posts/autosave" },
  async (req) => {
    const userId = await getUserFromToken(req.authorization);

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("autosaves")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw APIError.internal("failed to fetch autosave: " + error.message);
    }

    if (!data) {
      return {};
    }

    const post: Post = {
      id: "autosave",
      content: data.content,
      coverImage: data.cover_image,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at),
    };

    return { post };
  }
);
