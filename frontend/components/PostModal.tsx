import React from 'react';
import { X, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';
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

  const displayTitle = post.title || 'Sample Post';
  const displayContent = stripHtml(post.content) || 'This is a sample post to show how your content will look when expanded.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3"></div>
            <div>
              <div className="font-semibold text-sm text-gray-900 font-inter">Content Creator</div>
              <div className="text-xs text-gray-500 font-inter">2 minutes ago</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-3 font-inter leading-tight">
            {displayTitle}
          </h2>
          
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt="Post cover"
              className="w-full rounded-lg mb-4"
            />
          )}

          <div 
            className="text-gray-700 leading-relaxed font-inter"
            dangerouslySetInnerHTML={{ __html: post.content || displayContent }}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-inter">24</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-inter">5</span>
              </div>
              <div className="text-gray-500 hover:text-green-500 cursor-pointer transition-colors">
                <Share className="w-5 h-5" />
              </div>
            </div>
            <div className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
