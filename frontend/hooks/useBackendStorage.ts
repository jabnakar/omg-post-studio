import { Post } from '../types/Post';
import backend from '~backend/client';

export function useBackendStorage(authToken: string | null) {
  const getBackend = () => {
    if (!authToken) {
      throw new Error('Not authenticated');
    }
    return backend.with({ auth: { authorization: authToken } });
  };

  const savePost = async (post: Post): Promise<Post> => {
    const api = getBackend();
    
    if (post.id === 'autosave' || post.id.startsWith('post_')) {
      // Create new post
      const response = await api.posts.create({
        content: post.content,
        coverImage: post.coverImage,
      });
      return {
        ...post,
        id: response.id,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
    } else {
      // Update existing post
      const response = await api.posts.update({
        id: post.id,
        content: post.content,
        coverImage: post.coverImage,
      });
      return {
        ...post,
        updatedAt: response.updatedAt,
      };
    }
  };

  const loadPost = async (id: string): Promise<Post | null> => {
    if (id === 'autosave') {
      return loadAutosave();
    }
    
    // For simplicity, we'll load all posts and find the one we want
    // In a real app, you might want a dedicated endpoint for this
    const posts = await getAllPosts();
    return posts.find(p => p.id === id) || null;
  };

  const deletePost = async (id: string): Promise<void> => {
    const api = getBackend();
    await api.posts.remove({ id });
  };

  const getAllPosts = async (): Promise<Post[]> => {
    const api = getBackend();
    const response = await api.posts.list();
    return response.posts.map(post => ({
      id: post.id,
      title: '', // Keep for compatibility
      content: post.content,
      coverImage: post.coverImage,
      timestamp: new Date(post.updatedAt).getTime(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  };

  const autosave = async (post: Post): Promise<void> => {
    const api = getBackend();
    await api.posts.autosave({
      content: post.content,
      coverImage: post.coverImage,
    });
  };

  const loadAutosave = async (): Promise<Post | null> => {
    const api = getBackend();
    const response = await api.posts.getAutosave();
    
    if (!response.post) {
      return null;
    }
    
    const post = response.post;

    return {
      id: 'autosave',
      title: '', // Keep for compatibility
      content: post.content,
      coverImage: post.coverImage,
      timestamp: new Date(post.createdAt).getTime(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  return {
    savePost,
    loadPost,
    deletePost,
    getAllPosts,
    autosave,
    loadAutosave,
  };
}
