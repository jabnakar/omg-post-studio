import React from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Post } from '../types/Post';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  isLive?: boolean;
}

export function PostCard({ post, onClick, isLive = false }: PostCardProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const displayTitle = post.title || (isLive ? 'Write a headline...' : 'Sample Post');
  const bodyText = stripHtml(post.content);
  const displayBody = bodyText || (isLive ? 'Start writing your post content...' : 'This is a sample post to show how your content will look in the feed.');

  return (
    <div 
      className="bg-white border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3"></div>
        <div>
          <div className="font-semibold text-sm text-gray-900 font-inter">Content Creator</div>
          <div className="text-xs text-gray-500 font-inter">2m ago</div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 mb-2 font-inter text-sm leading-tight">
          {truncateText(displayTitle, 60)}
        </h3>
        
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="Post cover"
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        )}

        <p className="text-gray-700 text-sm font-inter leading-relaxed line-clamp-3">
          {truncateText(displayBody, 120)}
          {displayBody.length > 120 && (
            <span className="text-blue-600 ml-1">See more...</span>
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-inter">24</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-inter">5</span>
          </div>
        </div>
        <Share className="w-4 h-4" />
      </div>
    </div>
  );
}
