import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import StyledInput from './StyledInput';

const SubTopicCard = ({ subTopic, onClick, onDelete, onTitleUpdate }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subTopic.name);

  // Strip HTML tags for preview
  const getPreviewText = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent || '';
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.slice(0, 100) + (textContent.length > 100 ? '...' : '');
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== subTopic.name) {
      onTitleUpdate(subTopic.id, editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(subTopic.name);
    setIsEditingTitle(false);
  };

  return (
    <div className=" relative p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-customTeal bg-customMint min-h-[200px] flex flex-col">
      <div className="flex justify-between items-start mb-3 font-technor-medium">
        {isEditingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <StyledInput
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
             
              autoFocus
            />
            <button
              onClick={handleTitleSave}
              className="p-1 text-customTeal hover:text-customMint"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={handleTitleCancel}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="flex-1 text-2xl font-technor-bold text-gray-800 hover:text-customTeal cursor-pointer transition-colors text-center"
          >
            {subTopic.name}
          </h3>
        )}
      </div>

      <div 
        onClick={onClick}
        className="flex-1 cursor-pointer"
      >
        <p className="text-sm text-gray-500 mb-3 text-center font-mono">
          {subTopic.createdAt ? new Date(subTopic.createdAt).toLocaleDateString() : 'Date not available'}
        </p>
        <hr className="border-t border-customTeal mb-3" />
        
        <div className="text-gray-600 text-md line-clamp-4 hover:text-customTeal transition-colors font-technor-semibold">
          {getPreviewText(subTopic.content) || 'Click to add content...'}
        </div>
      </div>
      <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-customOrange transition-colors ml-2 absolute bottom-2 right-2"
        >
          <Trash2 className="size-6" />
        </button>
    </div>
  );
};

export default SubTopicCard;