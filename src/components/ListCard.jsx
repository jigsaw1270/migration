import React from 'react';
import { Trash2, Copy } from 'lucide-react';

const ListCard = ({ item, onDelete }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    alert('Text copied to clipboard!');
  };

  return (
    <div className="bg-customMint p-4 rounded-lg shadow-md hover:scale-[1.05] text-black transition-all duration-300 border-2 hover:text-customMint hover:bg-customTeal border-customTeal font-technor-medium">
      <div className="flex justify-between items-start">
        <p className="text-lg">{item.content}</p>
        <div className="space-y-2">
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 hover:text-customOrange"
          >
            <Trash2 className="h-6 w-6" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:text-customOrange"
          >
            <Copy className="h-6 w-6" />
          </button>
        </div>
      </div>
      <p className="text-sm mt-2">
        {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ListCard;
