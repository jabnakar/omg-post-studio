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
    content: 'Start writing your amazing content here. Use the toolbar above to format your text, add links, and more. Your work will be automatically saved as you write.',
    coverImage: null,
    timestamp: Date.now()
  };
}
