import { Post } from '../types/Post';

const sampleContents = [
  "Just discovered this amazing productivity hack that's been a total game-changer for my daily routine! 🚀 Who else struggles with staying focused during the afternoon slump?",
  "The digital landscape is constantly evolving and I'm here for it! 💻 Staying ahead of trends and adapting to new platforms is crucial for success in today's competitive market. What's your strategy for keeping up?",
  "Here's the thing about great content - it's not just about what you say, it's about how you make people FEEL 💭 Finding that perfect balance between entertainment and information is an art form.",
  "Your personal brand is your most valuable asset in the digital age 🎯 It's what sets you apart from the competition and builds trust with your audience. Are you investing enough time in yours?",
  "Visual content performs 40x better than text-only posts (yes, really!) 📸 Time to start leveraging images, videos, and graphics to tell your story more effectively.",
  "Plot twist: You don't need to be everywhere at once 🤯 Understanding emerging trends is important, but mastering one platform first will always beat being mediocre on five.",
  "Content creation doesn't have to be overwhelming! ✨ With the right tools and strategies, you can streamline your process and create amazing content consistently. What's your biggest content challenge?",
  "Can we talk about captions for a second? 📝 A great caption can literally make or break your post. It's the bridge between your visual and your audience's heart.",
  "Building a genuine following takes time, and that's OKAY 🌱 Focus on creating value and building real relationships rather than chasing vanity metrics. Quality over quantity, always.",
  "Everyone wants to know the secret to viral content... 🔥 While there's no guaranteed formula, authenticity + timing + value = your best shot. What's been your most successful post?"
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
    const contentIndex = i % sampleContents.length;
    const imageIndex = i % sampleImages.length;
    
    posts.push({
      id: `ghost_${i}`,
      title: '', // No longer used but kept for compatibility
      content: sampleContents[contentIndex],
      coverImage: sampleImages[imageIndex],
      timestamp: Date.now() - (i * 60000) // Each post is 1 minute older
    });
  }
  
  return posts;
}
