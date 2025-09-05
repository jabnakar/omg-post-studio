import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { MobilePreview } from './MobilePreview';
import { Sidebar } from './Sidebar';
import { PostModal } from './PostModal';
import { LoadModal } from './LoadModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Post, createEmptyPost } from '../types/Post';
import { Button } from '@/components/ui/button';
import { Menu, X, Eye, Edit } from 'lucide-react';

export default function PostStudio() {
  const [currentPost, setCurrentPost] = useState<Post>(createEmptyPost());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [autosaveMessage, setAutosaveMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
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
      const isEmpty = !currentPost.content.replace(/<[^>]*>/g, '').trim() && 
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
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden mr-2"
            >
              {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <h1 className="text-xl font-semibold text-[#101214] font-inter">OMG Post Studio</h1>
          </div>
          
          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden">
            <Button
              variant={activeTab === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('edit')}
              className="mr-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>

          {autosaveMessage && (
            <span className="text-sm text-[#6b7280] font-inter hidden sm:block">{autosaveMessage}</span>
          )}
        </div>
        
        {/* Mobile autosave message */}
        {autosaveMessage && (
          <div className="mt-2 sm:hidden">
            <span className="text-xs text-[#6b7280] font-inter">{autosaveMessage}</span>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="relative flex h-[calc(100vh-65px)] md:h-[calc(100vh-65px)]">
        {/* Sidebar - Desktop: Always visible, Mobile: Overlay */}
        <div className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:w-64
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          md:transition-none
        `}>
          <div className="h-full overflow-y-auto">
            <Sidebar
              onSave={handleSave}
              onLoad={() => setShowLoadModal(true)}
              onClear={handleClear}
            />
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-w-0">
          {/* Editor - Desktop: Always visible, Mobile: Tab controlled */}
          <div className={`
            ${activeTab === 'edit' ? 'block' : 'hidden'} md:block
            flex-1 min-w-0
          `}>
            <Editor
              post={currentPost}
              onChange={handlePostChange}
            />
          </div>

          {/* Mobile Preview - Desktop: Always visible, Mobile: Tab controlled */}
          <div className={`
            ${activeTab === 'preview' ? 'block' : 'hidden'} md:block
            w-full md:w-80 md:min-w-80
          `}>
            <MobilePreview
              currentPost={currentPost}
              onCardClick={handleCardClick}
            />
          </div>
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
