import React, { useState, useEffect } from 'react';
import { X, Clock, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '../types/Post';

interface LoadModalProps {
  posts: Post[];
  autosavedPost: Post | null;
  onLoad: (post: Post) => void;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  getAllPosts: () => Promise<Post[]>;
  loadAutosave: () => Promise<Post | null>;
}

export function LoadModal({ 
  onLoad, 
  onDelete, 
  onClose, 
  getAllPosts,
  loadAutosave 
}: LoadModalProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [autosavedPost, setAutosavedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, autosaveData] = await Promise.all([
          getAllPosts(),
          loadAutosave()
        ]);
        setPosts(postsData);
        setAutosavedPost(autosaveData);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getAllPosts, loadAutosave]);

  const allPosts = [
    ...(autosavedPost ? [{ ...autosavedPost, isAutosave: true }] : []),
    ...posts
  ].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

  const formatDate = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-inter">Load Post</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-inter">Loading posts...</p>
            </div>
          ) : allPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-inter">No saved posts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 font-inter">
                          {truncateText(stripHtml(post.content) || 'Untitled Post', 50)}
                        </h3>
                        {post.isAutosave && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-inter">
                            <Clock className="w-3 h-3 mr-1" />
                            Autosaved
                          </span>
                        )}
                      </div>
                      
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt="Post cover"
                          className="w-20 h-20 object-cover rounded mb-2"
                        />
                      )}
                      
                      <p className="text-gray-600 text-sm mb-2 font-inter">
                        {truncateText(
                          stripHtml(post.content) || 'No content',
                          100
                        )}
                      </p>
                      
                      <p className="text-xs text-gray-500 font-inter">
                        {formatDate(post.updatedAt || post.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLoad(post)}
                      >
                        Load
                      </Button>
                      {!post.isAutosave && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(post.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
