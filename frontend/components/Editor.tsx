import React, { useRef } from 'react';
import { Bold, Italic, Underline, Heading2, List, Quote, Link, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '../types/Post';

interface EditorProps {
  post: Post;
  onChange: (updates: Partial<Post>) => void;
}

export function Editor({ post, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleFormatCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (bodyRef.current) {
      onChange({ content: bodyRef.current.innerHTML });
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      handleFormatCommand('createLink', url);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange({ coverImage: result });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
            e.preventDefault();
            return;
          }
        }
      }
    }
  };

  const handleHeadlineChange = () => {
    if (headlineRef.current) {
      onChange({ title: headlineRef.current.textContent || '' });
    }
  };

  const handleBodyChange = () => {
    if (bodyRef.current) {
      onChange({ content: bodyRef.current.innerHTML });
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('bold')}
            className="h-8"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('italic')}
            className="h-8"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('underline')}
            className="h-8"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('formatBlock', 'h2')}
            className="h-8"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('insertUnorderedList')}
            className="h-8"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFormatCommand('formatBlock', 'blockquote')}
            className="h-8"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLink}
            className="h-8"
          >
            <Link className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload Image
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Image Preview */}
        {post.coverImage && (
          <div className="mb-6 relative">
            <img
              src={post.coverImage}
              alt="Cover"
              className="w-full max-w-lg rounded-lg shadow-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ coverImage: null })}
              className="absolute top-2 right-2 bg-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Drop Zone */}
        {!post.coverImage && (
          <div
            className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-inter">
              Drag and drop an image here, or click Upload Image above
            </p>
          </div>
        )}

        {/* Headline */}
        <div
          ref={headlineRef}
          contentEditable
          suppressContentEditableWarning
          className="text-3xl font-bold text-[#101214] mb-6 outline-none font-baskerville leading-tight"
          style={{ minHeight: '1.2em' }}
          onInput={handleHeadlineChange}
          onPaste={handlePaste}
          data-placeholder="Write a headline..."
        >
          {post.title}
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          className="text-lg text-[#101214] leading-relaxed outline-none font-baskerville"
          style={{ minHeight: '200px' }}
          onInput={handleBodyChange}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
