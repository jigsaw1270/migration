import React, { useState } from "react";
import { Trash2, Copy, Edit2, Check, X, MessageCircle } from "lucide-react";

const ListCard = ({ item, onDelete, onUpdateItem }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTrashZone, setShowTrashZone] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditingSubtext, setIsEditingSubtext] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [editedSubtext, setEditedSubtext] = useState(item.subtext || "");

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    alert("Text copied to clipboard!");
  };

  const handleSaveContent = () => {
    onUpdateItem(item.id, { content: editedContent });
    setIsEditingContent(false);
  };

  const handleSaveSubtext = () => {
    onUpdateItem(item.id, { subtext: editedSubtext });
    setIsEditingSubtext(false);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setShowTrashZone(true);
    e.dataTransfer.setData("text/plain", item.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setShowTrashZone(false);
    setIsOverTrash(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.currentTarget.id === "trash-zone") {
      setIsOverTrash(true);
    }
  };

  const handleDragLeave = () => {
    setIsOverTrash(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (e.currentTarget.id === "trash-zone") {
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
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          {isEditingContent ? (
            <div className="flex items-center w-full">
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="flex-1 mr-2 px-2 py-1 border rounded"
              />
              <button
                onClick={handleSaveContent}
                className="text-green-500 mr-2"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setEditedContent(item.content);
                  setIsEditingContent(false);
                }}
                className="text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <p
                onClick={() => setIsEditingContent(true)}
                className="text-lg flex items-center"
              >
                {item.content}
              </p>
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={handleCopy}
              className="p-1 hover:text-customOrange"
            >
              <Copy className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Subtext Section */}
        <div className="mt-2">
          {isEditingSubtext ? (
            <div className="flex items-center hover:text-customMint">
              <input
                type="text"
                value={editedSubtext}
                onChange={(e) => setEditedSubtext(e.target.value)}
                placeholder=""
                className="flex-1 mr-2 px-2 py-1 border rounded text-sm"
              />
              <button
                onClick={handleSaveSubtext}
                className="text-green-500 mr-2"
              >
                <Check className="size-3" />
              </button>
              <button
                onClick={() => {
                  setEditedSubtext(item.subtext || "");
                  setIsEditingSubtext(false);
                }}
                className="text-red-500"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              {item.subtext ? (
                <p className="text-sm text-customOrange flex-1">
                  {item.subtext}
                  <button
                    onClick={() => setIsEditingSubtext(true)}
                    className="ml-2 text-black hover:text-customOrange"
                  >
                    <Edit2 className="size-3" />
                  </button>
                </p>
              ) : (
                <button
                  onClick={() => setIsEditingSubtext(true)}
                  className="text-sm text-gray-400 hover:text-customOrange"
                >
                  <MessageCircle className="size-5" />
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-sm mt-2 text-right">
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
              ? "bg-orange-200 border-customOrange"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <Trash2
            className={`h-8 w-8 transition-all duration-300 ${
              isOverTrash ? "text-customOrange scale-125" : "text-gray-400"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ListCard;
