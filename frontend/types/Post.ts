export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  timestamp: number;
}

export function createEmptyPost(): Post {
  return {
    id: `post_${Date.now()}`,
    title: '',
    content: '',
    coverImage: null,
    timestamp: Date.now()
  };
}
