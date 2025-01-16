import React, { useState, useEffect } from 'react';
import { X, Edit, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoteModal = ({ isOpen, onClose, title, content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setEditContent(content || '');
      setIsEditing(false);
      // Delay setting visibility for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editContent);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before closing
    setTimeout(() => {
      if (editContent !== content) {
        onSave(editContent);
      }
      setIsEditing(false);
      onClose();
    }, 300);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'code'],
      ['clean']
    ],
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`bg-white w-[95%] max-w-8xl h-[90vh] flex flex-col relative rounded-lg shadow-xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-customPeach rounded-t-lg">
          <h2 className="text-xl font-technor-bold">{title}</h2>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-lg hover:bg-customMint transition-colors font-technor-medium"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-lg hover:bg-customMint transition-colors font-technor-medium"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isEditing ? (
            <div className="h-full p-4">
              <ReactQuill
                theme="snow"
                value={editContent}
                onChange={setEditContent}
                modules={modules}
                className="h-[calc(100%-60px)]"
              />
            </div>
          ) : (
            <div 
              className="p-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: editContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;