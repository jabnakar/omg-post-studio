import React, { useState, useEffect } from 'react';
import { Post } from '../types/Post';
import { PostCard } from './PostCard';
import { generateGhostPosts } from '../utils/ghostPosts';

interface MobilePreviewProps {
  currentPost: Post;
  onCardClick: (post: Post) => void;
}

export function MobilePreview({ currentPost, onCardClick }: MobilePreviewProps) {
  const [ghostPosts, setGhostPosts] = useState<Post[]>([]);
  const [loadedPostsCount, setLoadedPostsCount] = useState(10);

  useEffect(() => {
    setGhostPosts(generateGhostPosts(loadedPostsCount));
  }, [loadedPostsCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setLoadedPostsCount(prev => prev + 5);
    }
  };

  // Create feed with user's post appearing every 4 posts
  const createFeed = () => {
    const feed: (Post & { isUserPost?: boolean })[] = [];
    let ghostIndex = 0;

    for (let i = 0; i < loadedPostsCount + Math.floor(loadedPostsCount / 4); i++) {
      // Every 4th position (starting from position 3), insert user's post
      if ((i + 1) % 4 === 0) {
        feed.push({
          ...currentPost,
          id: `user-post-${Math.floor(i / 4)}`,
          isUserPost: true
        });
      } else {
        // Insert ghost post
        if (ghostIndex < ghostPosts.length) {
          feed.push(ghostPosts[ghostIndex]);
          ghostIndex++;
        }
      }
    }

    return feed;
  };

  const feedPosts = createFeed();

  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="mx-auto max-w-xs">
        {/* Phone Frame */}
        <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] h-[600px] overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gray-50 h-6 flex items-center justify-between px-4 text-xs text-gray-600">
              <span>9:41</span>
              <span>●●●●●</span>
            </div>

            {/* App Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <h2 className="font-semibold text-gray-900 font-inter">Feed</h2>
            </div>

            {/* Feed Content */}
            <div className="h-[534px] overflow-y-auto" onScroll={handleScroll}>
              {/* Live Card - Always at top with special highlighting */}
              <div className="border-b-4 border-blue-500 bg-blue-50">
                <div className="px-3 py-1 bg-blue-100 border-b border-blue-200">
                  <p className="text-xs text-blue-700 font-inter font-medium">✨ Live Preview</p>
                </div>
                <PostCard
                  post={currentPost}
                  onClick={() => onCardClick(currentPost)}
                  isLive={true}
                />
              </div>

              {/* Feed Posts with periodic user post */}
              {feedPosts.map((post, index) => (
                <div key={`${post.id}-${index}`} className="relative">
                  {post.isUserPost && (
                    <div className="px-3 py-1 bg-green-100 border-b border-green-200">
                      <p className="text-xs text-green-700 font-inter font-medium">📝 Your Post in Feed</p>
                    </div>
                  )}
                  <PostCard
                    post={post}
                    onClick={() => onCardClick(post)}
                    isLive={post.isUserPost}
                  />
                </div>
              ))}

              {/* Loading Indicator */}
              <div className="p-4 text-center text-gray-500 text-sm font-inter">
                Loading more posts...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
