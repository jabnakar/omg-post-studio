import React from 'react';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export function Sidebar({ onSave, onLoad, onClear }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 font-inter">Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={onSave}
              className="w-full justify-start bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Post
            </Button>
            <Button
              variant="outline"
              onClick={onLoad}
              className="w-full justify-start"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Post
            </Button>
            <Button
              variant="outline"
              onClick={onClear}
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 font-inter">Tips</h3>
          <div className="text-sm text-gray-600 space-y-2 font-inter">
            <p>• Use the toolbar to format your content</p>
            <p>• Drag images directly into the editor</p>
            <p>• Your work is automatically saved</p>
            <p>• Click on preview cards to see full content</p>
          </div>
        </div>
      </div>
    </div>
  );
}
