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

  // Insert user's post periodically in the feed
  const feedPosts = [...ghostPosts];
  const userPostIndex = Math.floor(feedPosts.length / 3);
  if (currentPost.title || currentPost.content || currentPost.coverImage) {
    feedPosts.splice(userPostIndex, 0, { ...currentPost, id: 'user-post-feed' });
  }

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
              {/* Live Card */}
              <div className="border-b-4 border-blue-500">
                <PostCard
                  post={currentPost}
                  onClick={() => onCardClick(currentPost)}
                  isLive={true}
                />
              </div>

              {/* Feed Posts */}
              {feedPosts.map((post, index) => (
                <PostCard
                  key={`${post.id}-${index}`}
                  post={post}
                  onClick={() => onCardClick(post)}
                />
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
