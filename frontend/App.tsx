import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import PostStudio from './components/PostStudio';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark">
      <PostStudio />
      <Toaster />
    </div>
  );
}
