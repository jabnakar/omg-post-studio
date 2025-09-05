import React, { useMemo } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
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

  const bodyText = stripHtml(post.content);
  const displayBody = bodyText || (isLive ? "What's on your mind? Write your post here..." : 'This is a sample post to show how your content will look in the feed.');

  // Generate consistent engagement numbers based on post ID
  const engagement = useMemo(() => {
    const hash = post.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return {
      likes: Math.abs(hash % 500) + 10,
      comments: Math.abs(hash % 50) + 1,
      shares: Math.abs(hash % 20) + 1
    };
  }, [post.id]);

  return (
    <div 
      className="bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3"></div>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-[15px] text-gray-900 font-inter">Content Creator</span>
              <span className="text-gray-500 mx-1">·</span>
              <span className="text-gray-500 text-sm font-inter">2m</span>
            </div>
            <div className="text-xs text-gray-500 font-inter">Public</div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <div className="mb-3">
          <p className="text-gray-900 font-inter leading-relaxed">
            <span className="line-clamp-3">
              {truncateText(displayBody, 200)}
              {displayBody.length > 200 && (
                <span className="text-gray-500 ml-1">... See more</span>
              )}
            </span>
          </p>
        </div>
        
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="Post content"
            className="w-full rounded-lg"
          />
        )}
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                <Heart className="w-2.5 h-2.5 text-white fill-current" />
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white">
                <Heart className="w-2.5 h-2.5 text-white fill-current" />
              </div>
            </div>
            <span className="text-xs font-inter">{engagement.likes}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-inter">
            <span>{engagement.comments} comments</span>
            <span>{engagement.shares} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100">
        <div className="flex">
          <button className="flex-1 flex items-center justify-center py-2.5 hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 mr-1.5" />
            <span className="text-gray-700 font-inter font-medium text-sm">Like</span>
          </button>
          <button className="flex-1 flex items-center justify-center py-2.5 hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4 text-gray-600 mr-1.5" />
            <span className="text-gray-700 font-inter font-medium text-sm">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center py-2.5 hover:bg-gray-50 transition-colors">
            <Share className="w-4 h-4 text-gray-600 mr-1.5" />
            <span className="text-gray-700 font-inter font-medium text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
