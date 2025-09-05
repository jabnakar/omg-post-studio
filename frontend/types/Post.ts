export interface Post {
  id: string;
  title: string; // Keep for backward compatibility but won't be used
  content: string;
  coverImage: string | null;
  timestamp: number;
  createdAt?: Date;
  updatedAt?: Date;
  isAutosave?: boolean;
}

export function createEmptyPost(): Post {
  return {
    id: `post_${Date.now()}`,
    title: '', // Keep for backward compatibility
    content: '',
    coverImage: null,
    timestamp: Date.now()
  };
}
