import { useState } from 'react';
import { Trash2, Check, X, Copy } from 'lucide-react';
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

  const handleCopy = () => {
    navigator.clipboard.writeText(subTopic.content.replace(/<[^>]*>?/gm, ' ')); // Remove HTML tags
    alert('Text copied to clipboard!');
  };

  return (
    <div className=" relative p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 text-customTeal border-customTeal bg-customMint min-h-[200px] flex flex-col hover:bg-customTeal hover:text-customMint">
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
              className="p-1"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={handleTitleCancel}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="flex-1 text-2xl font-technor-bold cursor-pointer transition-colors text-center"
          >
            {subTopic.name}
          </h3>
        )}
      </div>

      <div 
        onClick={onClick}
        className="flex-1 cursor-pointer"
      >
        <p className="text-sm mb-3 text-center font-mono">
          {subTopic.createdAt ? new Date(subTopic.createdAt).toLocaleDateString() : 'Date not available'}
        </p>
        <hr className="border-t border-customTeal mb-3" />
        
        <div className="text-md line-clamp-4  transition-colors font-technor-semibold">
          {getPreviewText(subTopic.content) || 'Click to add content...'}
        </div>
      </div>
      <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-customOrange transition-colors ml-2 absolute bottom-2 right-2"
        >
          <Trash2 className="size-6" />
        </button>
      <button
          onClick={handleCopy}
          className="p-1 text-gray-400 hover:text-customOrange transition-colors ml-2 absolute top-2 right-2"
        >
          <Copy className="size-6" />
        </button>
    </div>
  );
};

export default SubTopicCard;