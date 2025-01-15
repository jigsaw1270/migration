import { Trash2 } from 'lucide-react';

const SubTopicCard = ({ subTopic, onClick, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <button
          onClick={onClick}
          className="flex-1 text-left font-medium text-gray-800 hover:text-blue-600"
        >
          {subTopic.name}
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
      {subTopic.createdAt ? new Date(subTopic.createdAt).toLocaleDateString() : 'Date not available'}
      </p>
    </div>
  );
};

export default SubTopicCard;
