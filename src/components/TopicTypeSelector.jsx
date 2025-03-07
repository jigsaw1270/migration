import React from 'react';
import { FileText, CheckSquare, List } from 'lucide-react';

const TopicTypeSelector = ({ onSelect, onCancel }) => {
  return (
    <div className="space-y-2 font-technor-regular">
      <button
        onClick={() => onSelect('modal-note')}
        className="w-full flex items-center p-3 bg-customOrange text-white rounded-lg hover:bg-blue-600  duration-400 transition"
      >
        <FileText className="h-5 w-5 mr-2" />
        Modal Notes
      </button>
      <button
        onClick={() => onSelect('checklist')}
        className="w-full flex items-center p-3 bg-customOrange text-white rounded-lg hover:bg-green-600 transition duration-300"
      >
        <CheckSquare className="h-5 w-5 mr-2" />
        Checklist
      </button>
      <button
        onClick={() => onSelect('list-card')}
        className="w-full flex items-center p-3 bg-customOrange text-white rounded-lg hover:bg-purple-600 transition duration-300"
      >
        <List className="h-5 w-5 mr-2" />
        List Cards
      </button>
      <button
        onClick={onCancel}
        className="w-full p-2 text-gray-500 hover:bg-customMint rounded-lg transition duration-300"
      >
        Cancel
      </button>
    </div>
  );
};

export default TopicTypeSelector;