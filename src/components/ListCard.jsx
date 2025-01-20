import React, { useState } from 'react';
import { Trash2, Copy } from 'lucide-react';

const ListCard = ({ item, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTrashZone, setShowTrashZone] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    alert('Text copied to clipboard!');
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setShowTrashZone(true);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setShowTrashZone(false);
    setIsOverTrash(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.currentTarget.id === 'trash-zone') {
      setIsOverTrash(true);
    }
  };

  const handleDragLeave = () => {
    setIsOverTrash(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (e.currentTarget.id === 'trash-zone') {
      onDelete(itemId);
    }
    setShowTrashZone(false);
    setIsOverTrash(false);
  };

  return (
    <div className="relative">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`bg-customMint p-4 rounded-lg shadow-md hover:scale-[1.05] text-black transition-all duration-300 border-2 hover:text-customMint hover:bg-customTeal border-customTeal font-technor-medium cursor-move ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <p className="text-lg">{item.content}</p>
          <button
            onClick={handleCopy}
            className="p-1 hover:text-customOrange"
          >
            <Copy className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm mt-2">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      {showTrashZone && (
        <div
          id="trash-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`absolute -bottom-[5rem] left-1/2 transform -translate-x-1/2 w-1/2 h-16 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center z-50 ${
            isOverTrash
              ? 'bg-orange-200 border-customOrange'
              : 'bg-gray-100 border-gray-300'
          }`}
        >
          <Trash2 
            className={`h-8 w-8 transition-all duration-300 ${
              isOverTrash ? 'text-customOrange scale-125' : 'text-gray-400'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ListCard;