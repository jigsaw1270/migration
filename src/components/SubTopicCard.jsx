import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';

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
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-customTeal hover:border-customOrange min-h-[200px] flex flex-col">
      <div className="flex justify-between items-start mb-3">
        {isEditingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 px-2 py-1 border-2 border-customTeal rounded-md focus:outline-none focus:ring-2 focus:ring-customMint"
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
            className="flex-1 text-lg font-technor-bold text-gray-800 hover:text-customTeal cursor-pointer transition-colors"
          >
            {subTopic.name}
          </h3>
        )}
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div 
        onClick={onClick}
        className="flex-1 cursor-pointer"
      >
        <p className="text-sm text-gray-500 mb-3">
          {subTopic.createdAt ? new Date(subTopic.createdAt).toLocaleDateString() : 'Date not available'}
        </p>
        
        <div className="text-gray-600 text-sm line-clamp-4 hover:text-customTeal transition-colors">
          {getPreviewText(subTopic.content) || 'Click to add content...'}
        </div>
      </div>
    </div>
  );
};

export default SubTopicCard;