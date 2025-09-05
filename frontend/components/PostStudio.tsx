import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { MobilePreview } from './MobilePreview';
import { Sidebar } from './Sidebar';
import { PostModal } from './PostModal';
import { LoadModal } from './LoadModal';
import { AuthModal } from './AuthModal';
import { useBackendStorage } from '../hooks/useBackendStorage';
import { Post, createEmptyPost } from '../types/Post';
import { Button } from '@/components/ui/button';
import { Menu, X, Eye, Edit, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PostStudio() {
  const [currentPost, setCurrentPost] = useState<Post>(createEmptyPost());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [autosaveMessage, setAutosaveMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { savePost, loadPost, deletePost, getAllPosts, autosave, loadAutosave } = useBackendStorage(authToken);
  
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastContentRef = useRef<string>('');

  // Check for existing auth on startup
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAuthToken(token);
        setUser(parsedUser);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Load autosaved draft when authenticated
  useEffect(() => {
    if (authToken) {
      loadAutosave().then((autosavedDraft) => {
        if (autosavedDraft) {
          setCurrentPost(autosavedDraft);
          lastContentRef.current = JSON.stringify(autosavedDraft);
        }
      });
    }
  }, [authToken]);

  // Autosave logic
  const triggerAutosave = () => {
    if (!authToken) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const currentContent = JSON.stringify(currentPost);
      const isEmpty = !currentPost.content.replace(/<[^>]*>/g, '').trim() && 
                     !currentPost.coverImage;

      if (!isEmpty && currentContent !== lastContentRef.current) {
        autosave(currentPost).then(() => {
          lastContentRef.current = currentContent;
          setAutosaveMessage(`Autosaved at ${new Date().toLocaleTimeString()}`);
          setTimeout(() => setAutosaveMessage(''), 3000);
        }).catch((error) => {
          console.error('Autosave error:', error);
        });
      }
    }, 15000);
  };

  const handlePostChange = (updates: Partial<Post>) => {
    setCurrentPost(prev => ({ ...prev, ...updates }));
    triggerAutosave();
  };

  const handleSave = async () => {
    if (!authToken) {
      toast({
        title: "Error",
        description: "Please login to save posts",
        variant: "destructive",
      });
      return;
    }

    try {
      await savePost(currentPost);
      setAutosaveMessage(`Post saved at ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setAutosaveMessage(''), 3000);
      toast({
        title: "Success",
        description: "Post saved successfully!",
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    }
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
  };

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleAuthSuccess = (token: string, userData: { id: string; email: string }) => {
    setAuthToken(token);
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setCurrentPost(createEmptyPost());
    setShowAuthModal(true);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Don't render main content if not authenticated
  if (!authToken || !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">OMG Post Studio</h1>
          <p className="text-gray-600 mb-6">Please login to continue</p>
          <Button onClick={() => setShowAuthModal(true)}>
            Login / Sign Up
          </Button>
        </div>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

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

          <div className="flex items-center space-x-4">
            {autosaveMessage && (
              <span className="text-sm text-[#6b7280] font-inter hidden sm:block">{autosaveMessage}</span>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-inter hidden sm:block">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile autosave message */}
        {autosaveMessage && (
          <div className="mt-2 sm:hidden">
            <span className="text-xs text-[#6b7280] font-inter">{autosaveMessage}</span>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="relative flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
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
          {/* Editor */}
          <div className={`
            ${activeTab === 'edit' ? 'block' : 'hidden'} md:block
            flex-1 min-w-0
          `}>
            <Editor
              post={currentPost}
              onChange={handlePostChange}
            />
          </div>

          {/* Mobile Preview */}
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

      {showLoadModal && authToken && (
        <LoadModal
          posts={[]} // Will be loaded by the hook
          autosavedPost={null} // Will be loaded by the hook
          onLoad={handleLoad}
          onDelete={async (id) => {
            try {
              await deletePost(id);
              setShowLoadModal(false);
              setTimeout(() => setShowLoadModal(true), 100);
              toast({
                title: "Success",
                description: "Post deleted successfully",
              });
            } catch (error: any) {
              console.error('Delete error:', error);
              toast({
                title: "Error",
                description: error.message || "Failed to delete post",
                variant: "destructive",
              });
            }
          }}
          onClose={() => setShowLoadModal(false)}
          isLoading={false}
          getAllPosts={getAllPosts}
          loadAutosave={loadAutosave}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
