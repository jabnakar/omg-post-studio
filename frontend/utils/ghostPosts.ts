import { Post } from '../types/Post';

const sampleTitles = [
  "10 Tips for Better Social Media Engagement",
  "The Future of Digital Marketing",
  "How to Create Compelling Content",
  "Building Your Personal Brand Online",
  "The Power of Visual Storytelling",
  "Social Media Trends to Watch",
  "Content Creation Made Simple",
  "Mastering the Art of Caption Writing",
  "Growing Your Audience Organically",
  "The Science of Viral Content"
];

const sampleContents = [
  "Creating engaging content requires understanding your audience and delivering value consistently. Here are some proven strategies that can help boost your social media presence...",
  "The digital landscape is constantly evolving. Staying ahead of trends and adapting to new platforms is crucial for success in today's competitive market...",
  "Great content tells a story that resonates with your audience. It's about finding the perfect balance between entertainment and information...",
  "Your personal brand is your most valuable asset in the digital age. It's what sets you apart from the competition and builds trust with your audience...",
  "Visual content performs better than text-only posts. Learn how to leverage images, videos, and graphics to tell compelling stories...",
  "Stay ahead of the curve by understanding emerging trends in social media. From new features to changing algorithms, here's what you need to know...",
  "Content creation doesn't have to be overwhelming. With the right tools and strategies, you can streamline your process and create amazing content consistently...",
  "A great caption can make or break your post. Learn the art of writing captions that engage, inform, and inspire your audience to take action...",
  "Building a genuine following takes time and effort. Focus on creating value and building relationships rather than chasing vanity metrics...",
  "Understanding what makes content go viral can help you create more engaging posts. While there's no guaranteed formula, certain elements increase your chances..."
];

const sampleImages = [
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwMCIgeT0iNzUiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZTVlN2ViIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyNSIgcj0iMjAiIGZpbGw9IiNkMWQ1ZGIiLz4KPHBhdGggZD0iTTE4MCAyMDBMMjIwIDE2MEwyNjAgMjAwSDE4MFoiIGZpbGw9IiNkMWQ1ZGIiLz4KPC9zdmc+",
  null,
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWY5Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlNGU0ZTciLz4KPGNpcmNsZSBjeD0iMzI1IiBjeT0iNzUiIHI9IjE1IiBmaWxsPSIjZmVmMzAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=",
  null,
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmNmY2ZkIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiNmNDY4ZmYiLz4KPGNpcmNsZSBjeD0iMTMwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0iIzM0ZDM5OSIvPgo8Y2lyY2xlIGN4PSIyNzAiIGN5PSIyMDAiIHI9IjI1IiBmaWxsPSIjZmJiZjI0Ii8+Cjwvc3ZnPg=="
];

export function generateGhostPosts(count: number): Post[] {
  const posts: Post[] = [];
  
  for (let i = 0; i < count; i++) {
    const titleIndex = i % sampleTitles.length;
    const contentIndex = i % sampleContents.length;
    const imageIndex = i % sampleImages.length;
    
    posts.push({
      id: `ghost_${i}`,
      title: sampleTitles[titleIndex],
      content: sampleContents[contentIndex],
      coverImage: sampleImages[imageIndex],
      timestamp: Date.now() - (i * 60000) // Each post is 1 minute older
    });
  }
  
  return posts;
}
