import React from 'react';
import { Trash2 } from 'lucide-react';

const ListCard = ({ item, onDelete }) => {
  return (
    <div className="bg-customMint p-4 rounded-lg shadow-md hover:scale-[1.05] text-black transition-all duration-300 border-2 hover:text-customMint hover:bg-customTeal border-customTeal font-technor-medium">
      <div className="flex justify-between items-start">
        <p className="text-lg">{item.content}</p>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 hover:text-customOrange"
        >
          <Trash2 className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm mt-2">
        {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ListCard;    