import React from 'react';
import { Trash2 } from 'lucide-react';

const ListCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <p className="text-gray-800">{item.content}</p>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ListCard;    