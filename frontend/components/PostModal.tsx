import React, { useMemo } from 'react';
import { X, Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '../types/Post';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const displayContent = stripHtml(post.content) || 'This is a sample post to show how your content will look when expanded.';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
          <div className="flex items-center space-x-2">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            <div 
              className="text-gray-900 font-inter leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || displayContent }}
            />
          </div>
          
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt="Post content"
              className="w-full rounded-lg mb-4"
            />
          )}

          {/* Engagement Stats */}
          <div className="py-3 border-t border-gray-100">
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
    </div>
  );
}
