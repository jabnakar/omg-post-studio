import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { MobilePreview } from './MobilePreview';
import { Sidebar } from './Sidebar';
import { PostModal } from './PostModal';
import { LoadModal } from './LoadModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Post, createEmptyPost } from '../types/Post';

export default function PostStudio() {
  const [currentPost, setCurrentPost] = useState<Post>(createEmptyPost());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [autosaveMessage, setAutosaveMessage] = useState('');
  const { savePost, loadPost, deletePost, getAllPosts, autosave, loadAutosave } = useLocalStorage();
  
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef<string>('');

  // Load autosaved draft on startup
  useEffect(() => {
    const autosavedDraft = loadAutosave();
    if (autosavedDraft) {
      setCurrentPost(autosavedDraft);
      lastContentRef.current = JSON.stringify(autosavedDraft);
    }
  }, []);

  // Autosave logic
  const triggerAutosave = () => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const currentContent = JSON.stringify(currentPost);
      const isEmpty = !currentPost.title.trim() && 
                     !currentPost.content.replace(/<[^>]*>/g, '').trim() && 
                     !currentPost.coverImage;

      if (!isEmpty && currentContent !== lastContentRef.current) {
        autosave(currentPost);
        lastContentRef.current = currentContent;
        setAutosaveMessage(`Autosaved at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setAutosaveMessage(''), 3000);
      }
    }, 15000);
  };

  const handlePostChange = (updates: Partial<Post>) => {
    setCurrentPost(prev => ({ ...prev, ...updates }));
    triggerAutosave();
  };

  const handleSave = () => {
    const savedPost = savePost(currentPost);
    setAutosaveMessage(`Post saved at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setAutosaveMessage(''), 3000);
    return savedPost;
  };

  const handleLoad = (post: Post) => {
    setCurrentPost(post);
    lastContentRef.current = JSON.stringify(post);
    setShowLoadModal(false);
  };

  const handleClear = () => {
    const emptyPost = createEmptyPost();
    setCurrentPost(emptyPost);
    lastContentRef.current = JSON.stringify(emptyPost);
    deletePost('post_autosave');
  };

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#101214] font-inter">OMG Post Studio</h1>
          {autosaveMessage && (
            <span className="text-sm text-[#6b7280] font-inter">{autosaveMessage}</span>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <Sidebar
          onSave={handleSave}
          onLoad={() => setShowLoadModal(true)}
          onClear={handleClear}
        />

        {/* Editor */}
        <div className="flex-1 min-w-0">
          <Editor
            post={currentPost}
            onChange={handlePostChange}
          />
        </div>

        {/* Mobile Preview */}
        <div className="w-80 min-w-80">
          <MobilePreview
            currentPost={currentPost}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {showLoadModal && (
        <LoadModal
          posts={getAllPosts()}
          autosavedPost={loadAutosave()}
          onLoad={handleLoad}
          onDelete={(id) => {
            deletePost(id);
            setShowLoadModal(false);
            setTimeout(() => setShowLoadModal(true), 100);
          }}
          onClose={() => setShowLoadModal(false)}
        />
      )}
    </div>
  );
}
