import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import StyledInput from './StyledInput';

const Checklist = ({ 
  topic, 
  selectedTopic, 
  newItem, 
  setNewItem, 
  addItem, 
  toggleItemStatus, 
  deleteItem,
  onReorderItems 
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();
    setDragOverItem(targetItem);
  };

  const handleDragEnd = () => {
    if (draggedItem && dragOverItem && draggedItem !== dragOverItem) {
      const updatedItems = [...topic.items];
      const draggedItemIndex = updatedItems.findIndex(item => item.id === draggedItem.id);
      const dragOverItemIndex = updatedItems.findIndex(item => item.id === dragOverItem.id);

      // Remove dragged item
      const [reorderedItem] = updatedItems.splice(draggedItemIndex, 1);
      
      // Insert at new position
      updatedItems.splice(dragOverItemIndex, 0, reorderedItem);

      // Call the reorder function passed from parent
      onReorderItems(updatedItems);
    }

    // Reset drag states
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <StyledInput
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-customPeach"
        />
        <button
          onClick={() => {
            if (newItem.trim()) {
              addItem(selectedTopic, newItem);
              setNewItem("");
            }
          }}
          className="px-4 py-2 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500"
        >
          Add Item
        </button>
      </div>
      <div className="space-y-2">
        {topic.items?.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, item)}
            className={`
              flex items-center p-4 rounded-lg shadow font-technor-medium 
              transition-all duration-300 border-2 
              ${draggedItem?.id === item.id ? 'opacity-50' : 'opacity-100'}
              ${dragOverItem?.id === item.id ? 'border-customOrange' : 'border-customTeal'}
              bg-customMint hover:scale-[1.01] hover:bg-customTeal 
              dark:text-black dark:hover:text-customPeach hover:text-customPeach
            `}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItemStatus(selectedTopic, item.id)}
              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <span
              className={`ml-3 flex-1 cursor-move ${
                item.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {item.content}
            </span>
            <button
              onClick={() => deleteItem(selectedTopic, item.id)}
              className="ml-auto p-1 text-gray-400 hover:text-customOrange"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;