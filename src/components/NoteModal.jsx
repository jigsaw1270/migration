import React from 'react';
import { X } from 'lucide-react';

const NoteModal = ({ isOpen, onClose, title, content, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <textarea
          className="flex-1 p-4 resize-none focus:outline-none"
          value={content}
          onChange={(e) => onSave(e.target.value)}
          placeholder="Start typing your note..."
        />
      </div>
    </div>
  );
};

export default NoteModal;