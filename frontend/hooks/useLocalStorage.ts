import { Post } from '../types/Post';

export function useLocalStorage() {
  const STORAGE_KEY = 'omg_posts';
  const AUTOSAVE_KEY = 'post_autosave';

  const savePost = (post: Post): Post => {
    const savedPost = {
      ...post,
      id: post.id === AUTOSAVE_KEY ? `post_${Date.now()}` : post.id,
      timestamp: Date.now()
    };

    const existingPosts = getAllPosts();
    const updatedPosts = [savedPost, ...existingPosts.filter(p => p.id !== savedPost.id)];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    return savedPost;
  };

  const loadPost = (id: string): Post | null => {
    if (id === AUTOSAVE_KEY) {
      return loadAutosave();
    }

    const posts = getAllPosts();
    return posts.find(p => p.id === id) || null;
  };

  const deletePost = (id: string): void => {
    if (id === AUTOSAVE_KEY) {
      localStorage.removeItem(AUTOSAVE_KEY);
      return;
    }

    const posts = getAllPosts();
    const updatedPosts = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  };

  const getAllPosts = (): Post[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const autosave = (post: Post): void => {
    const autosavedPost = {
      ...post,
      id: AUTOSAVE_KEY,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autosavedPost));
  };

  const loadAutosave = (): Post | null => {
    try {
      const stored = localStorage.getItem(AUTOSAVE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  return {
    savePost,
    loadPost,
    deletePost,
    getAllPosts,
    autosave,
    loadAutosave
  };
}
