import { useState, useEffect } from "react";
import {
  PlusCircle,
  Menu,
  X,
  Trash2,
  NotebookPen,
  PackagePlus,
  Quote,
  Columns,
  List,
  ListCollapse,
  ChevronDown,
  PanelBottomClose,
  Upload,
  Image,
  GripVertical,
  Folder,
  FolderOpen,
  Edit2,
  Check,
  BookOpen,
  Briefcase,
  Calendar,
  Code,
  Coffee,
  FileText,
  Flag,
  Heart,
  Home as HomeIcon,
  Lightbulb,
  Mail,
  MessageSquare,
  Music,
  ShoppingCart,
  Star,
  Target,
  Palette,
  Camera,
  Zap,
  Trophy,
  Globe,
  Clock,
  Bookmark,
  Book,
  Rocket,
  Users,
  Settings,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NoteModal from "./NoteModal";
import SubTopicCard from "./SubTopicCard";
import TopicTypeSelector from "./TopicTypeSelector";
import ListCard from "./ListCard";
import Loader from "./loader/Loader";
import StyledInput from "./StyledInput";
import logo from "../assets/logo.png";
import DailyQuote from "./DailyQuote";
import Logout from "./buttons/Logout";
import DayNightButton from "./buttons/DayNightButton";
import Home from "./Home";
import Checklist from "./CheckList";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper function to get icon component by name
const getIconComponent = (iconName) => {
  const iconMap = {
    NotebookPen, BookOpen, Book, Briefcase, Code, Coffee, Calendar,
    FileText, Flag, Heart, HomeIcon, Lightbulb, Mail, MessageSquare,
    Music, ShoppingCart, Star, Target, Palette, Camera, Zap, Trophy,
    Globe, Clock, Bookmark, Rocket, Users, Settings, Award
  };
  return iconMap[iconName] || NotebookPen;
};

// Sortable Topic Item Component
const SortableTopicItem = ({ topic, isSelected, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(topic.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = getIconComponent(topic.icon);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center group font-technor-black text-3xl border-b-2 border-gray-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-customMint dark:hover:bg-darkhover rounded-l-lg"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <button
        onClick={() => onSelect(topic.id)}
        className={`flex-1 flex items-center p-1 text-left rounded-lg transition-colors uppercase ${
          isSelected
            ? "bg-customMint text-customOrange dark:bg-darkTeal dark:text-customMint"
            : "hover:bg-customMint dark:hover:bg-darkhover"
        }`}
      >
        <IconComponent className="h-6 w-6 mr-2" />
        {topic.name}
      </button>
      <button
        onClick={() => onDelete(topic.id)}
        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

// Sortable Folder Component
const SortableFolder = ({ folder, topics, isSelected, onSelect, onDelete, onRename, onToggle, selectedTopic }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(folder.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const folderTopics = topics.filter(t => t.folderId === folder.id);

  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      onRename(folder.id, editName);
    }
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center group font-technor-black text-3xl border-b-2 border-gray-200">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-customMint dark:hover:bg-darkhover rounded-l-lg"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => onToggle(folder.id)}
          className="p-1 hover:bg-customMint dark:hover:bg-darkhover rounded-lg"
        >
          {folder.isOpen ? (
            <FolderOpen className="h-6 w-6 text-customTeal" />
          ) : (
            <Folder className="h-6 w-6 text-customTeal" />
          )}
        </button>
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2 px-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setEditName(folder.name);
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-dark1 dark:text-darkText uppercase"
            />
            <Check className="h-4 w-4 cursor-pointer text-green-500" onClick={handleRename} />
          </div>
        ) : (
          <span className="flex-1 px-2 py-1 uppercase">{folder.name}</span>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(folder.id)}
          className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {folder.isOpen && folderTopics.length > 0 && (
        <div className="ml-8">
          {folderTopics.map((topic) => (
            <SortableTopicItem
              key={topic.id}
              topic={topic}
              isSelected={selectedTopic === topic.id}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Icon Selector Component
const AVAILABLE_ICONS = [
  { name: 'NotebookPen', icon: NotebookPen },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Book', icon: Book },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Code', icon: Code },
  { name: 'Coffee', icon: Coffee },
  { name: 'Calendar', icon: Calendar },
  { name: 'FileText', icon: FileText },
  { name: 'Flag', icon: Flag },
  { name: 'Heart', icon: Heart },
  { name: 'HomeIcon', icon: HomeIcon },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Mail', icon: Mail },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Music', icon: Music },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Star', icon: Star },
  { name: 'Target', icon: Target },
  { name: 'Palette', icon: Palette },
  { name: 'Camera', icon: Camera },
  { name: 'Zap', icon: Zap },
  { name: 'Trophy', icon: Trophy },
  { name: 'Globe', icon: Globe },
  { name: 'Clock', icon: Clock },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Rocket', icon: Rocket },
  { name: 'Users', icon: Users },
  { name: 'Settings', icon: Settings },
  { name: 'Award', icon: Award },
];

const IconSelector = ({ selectedIcon, onSelectIcon, onClose }) => {
  return (
    <div className="absolute z-50 mt-2 bg-white dark:bg-dark1 border-2 border-customTeal rounded-lg shadow-xl p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-technor-bold text-lg dark:text-darkText">Select Icon</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-darkTeal rounded">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto sidebar-scroll">
        {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => {
              onSelectIcon(name);
              onClose();
            }}
            className={`p-3 rounded-lg border-2 transition-all duration-200 hover:bg-customMint dark:hover:bg-darkTeal ${
              selectedIcon === name
                ? 'border-customTeal bg-customMint dark:bg-darkTeal'
                : 'border-gray-300 dark:border-darkBorder'
            }`}
            title={name}
          >
            <Icon className="h-5 w-5 dark:text-darkText" />
          </button>
        ))}
      </div>
    </div>
  );
};

const NoteApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [newSubTopicName, setNewSubTopicName] = useState("");
  const [newItem, setNewItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectingType, setIsSelectingType] = useState(false);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [isListView, setIsListView] = useState(false);
const [collapse, setIsCollapse] = useState(false);
const [backgroundImage, setBackgroundImage] = useState(
  localStorage.getItem('userBackgroundImage') || null
);
const [sidebarWidth, setSidebarWidth] = useState(localStorage.getItem('sidebarWidth') || 256); // 256px = 16rem (w-64)
const [isResizing, setIsResizing] = useState(false);

useEffect(() => {
  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth > 150 && newWidth < 600) {  // Min 150px, Max 600px
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  if (isResizing) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);

const handleBackgroundUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setBackgroundImage(base64Image);
      localStorage.setItem('userBackgroundImage', base64Image);
    };
    reader.readAsDataURL(file);
  }
};

const clearBackground = () => {
  setBackgroundImage(null);
  localStorage.removeItem('userBackgroundImage');
};

  const { user } = useAuth();
  const {
    topics,
    folders,
    loading,
    addTopic,
    addSubTopic,
    updateSubTopicContent,
    updateSubTopicTitle,
    deleteSubTopic,
    deleteTopic,
    addItem,
    deleteItem,
    toggleItemStatus,
    updateItem,
    reorderItems,
    reorderTopics,
    addFolder,
    renameFolder,
    deleteFolder,
    toggleFolderOpen,
    moveTopicToFolder,
    moveTopicOutOfFolder,
    reorderFolders
  } = useFirestore(user?.uid);
  const navigate = useNavigate();
  
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedTopicIcon, setSelectedTopicIcon] = useState("NotebookPen");
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Check if we're dragging a folder
    const isActiveFolder = folders.some(f => String(f.id) === String(active.id));
    const isOverFolder = folders.some(f => String(f.id) === String(over.id));

    if (isActiveFolder && isOverFolder) {
      // Reordering folders
      const oldIndex = folders.findIndex((folder) => String(folder.id) === String(active.id));
      const newIndex = folders.findIndex((folder) => String(folder.id) === String(over.id));
      const reorderedFolders = arrayMove(folders, oldIndex, newIndex);
      reorderFolders(reorderedFolders);
    } else if (!isActiveFolder && !isOverFolder) {
      // Reordering topics (only those not in folders)
      const topicsWithoutFolder = topics.filter(t => !t.folderId);
      const oldIndex = topicsWithoutFolder.findIndex((topic) => String(topic.id) === String(active.id));
      const newIndex = topicsWithoutFolder.findIndex((topic) => String(topic.id) === String(over.id));
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTopics = arrayMove(topicsWithoutFolder, oldIndex, newIndex);
        reorderTopics(reorderedTopics);
      }
    } else if (!isActiveFolder && isOverFolder) {
      // Dragging a topic over a folder - move topic into folder
      const topicId = String(active.id);
      const folderId = String(over.id);
      moveTopicToFolder(topicId, folderId);
    }
  };

  const handleAddTopic = async (type) => {
    if (newTopicName.trim()) {
      await addTopic(newTopicName, type, selectedTopicIcon);
      setNewTopicName("");
      setIsSelectingType(false);
      setSelectedTopicIcon("NotebookPen"); // Reset to default
    }
  };

  const handleAddSubTopic = async () => {
    if (selectedTopic && newSubTopicName.trim()) {
      await addSubTopic(selectedTopic, newSubTopicName);
      setNewSubTopicName("");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      await addFolder(newFolderName);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const selectedTopicData = topics?.find((t) => t.id === selectedTopic);
  const selectedSubTopicData = selectedTopicData?.subTopics?.find(
    (st) => st.id === selectedSubTopic
  );
  const isModalNoteType = selectedTopicData?.type === "modal-note";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      );
    }
    if (showQuote) {
      return <DailyQuote />;
    }
    if (!selectedTopic) return null;

    const topic = topics?.find((t) => t.id === selectedTopic);
    if (!topic) return null;

    switch (topic.type) {
      case "modal-note":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topic.subTopics.map((subTopic) => (
              <SubTopicCard
                key={subTopic.id}
                subTopic={subTopic}
                onClick={() => {
                  setSelectedSubTopic(subTopic.id);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteSubTopic(selectedTopic, subTopic.id)}
                onTitleUpdate={(subTopicId, newTitle) =>
                  updateSubTopicTitle(selectedTopic, subTopicId, newTitle)
                }
              />
            ))}
          </div>
        );

      case "checklist":
        return (
          <Checklist
          topic={topic}
          selectedTopic={selectedTopic}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
          toggleItemStatus={toggleItemStatus}
          deleteItem={deleteItem}
          onReorderItems={(updatedItems) => {
            // Call the new reorder method
            reorderItems(selectedTopic, updatedItems);
          }}
        />
        );

      case "list-card":
        return (
          <>
            <div className="mb-4 flex space-x-2">
              <StyledInput
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new card"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Add Card
              </button>
              <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsListView(!isListView)}
          className="flex items-center px-4 py-2 bg-customTeal text-white rounded-lg hover:bg-customMint transition-all duration-300"
        >
          {isListView ? (
            <>
              <Columns className="mr-2 h-5 w-5" /> 
            </>
          ) : (
            <>
              <List className="mr-2 h-5 w-5" /> 
            </>
          )}
        </button>
      </div>
            </div>
            <div className={`
        grid gap-4 
        ${isListView 
          ? 'grid-cols-1' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`
      }>
              {topic.items?.map((item) => (
                <ListCard
                  key={item.id}
                  item={item}
                  onDelete={(itemId) => deleteItem(selectedTopic, itemId)}
                  onUpdateItem={(itemId, updates) => updateItem(selectedTopic, itemId, updates)}
                />
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0' }}
        className={`bg-customPeach shadow-lg transition-all duration-300 overflow-x-hidden dark:bg-dark1 dark:text-darkText fixed md:relative h-full z-50 md:z-20 no-scrollbar`}
      >
        <div className="p-4">
          <div className="mb-8">
            <div className="flex items-center">
              <img src={logo} alt="logo" className="size-6 cursor-pointer" onClick={() => {
                  setSelectedTopic(null);
                  setShowQuote(false);
                }} />
              <span className="ml-2 text-2xl font-technor-black cursor-pointer" onClick={() => {
                  setSelectedTopic(null);
                  setShowQuote(false);
                }}>
                Migration
              </span>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full block md:hidden ml-auto"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 dark:text-darkText" />
                ) : (
                  <Menu className="h-5 w-5 dark:text-darkText" />
                )}
              </button>
            </div>
            <div className="mt-2 text-lg font-technor-medium">
              {user?.displayName}
              <p className="font-technor-light text-sm pb-2">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b-2 border-gray-200">
              <button
                onClick={() => setShowQuote(true)}
                className={`flex-1 flex items-center p-1 w-full text-left rounded-lg transition-colors uppercase font-technor-black text-3xl ${
                  showQuote
                    ? "bg-customMint text-customOrange dark:bg-darkTeal dark:text-customMint"
                    : "hover:bg-customMint dark:hover:bg-darkhover"
                }`}
              >
                <Quote className="h-6 w-6 mr-2" />
                Daily Quote
              </button>
            </div>
            {isSelectingType ? (
              <div className="space-y-2 relative">
                <div className="flex gap-2">
                  <StyledInput
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Topic name"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setShowIconSelector(!showIconSelector)}
                    className="p-2 border-2 border-customTeal rounded-lg hover:bg-customMint transition-colors"
                    title="Select Icon"
                  >
                    {(() => {
                      const SelectedIcon = getIconComponent(selectedTopicIcon);
                      return <SelectedIcon className="h-6 w-6 dark:text-darkText" />;
                    })()}
                  </button>
                </div>
                {showIconSelector && (
                  <IconSelector
                    selectedIcon={selectedTopicIcon}
                    onSelectIcon={setSelectedTopicIcon}
                    onClose={() => setShowIconSelector(false)}
                  />
                )}
                <TopicTypeSelector
                  onSelect={(type) => handleAddTopic(type)}
                  onCancel={() => {
                    setIsSelectingType(false);
                    setShowIconSelector(false);
                    setSelectedTopicIcon("NotebookPen");
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSelectingType(true)}
                className="w-full flex items-center justify-center p-2 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500"
              >
                <PackagePlus className="h-6 w-6 mr-2" />
                New Topic
              </button>
            )}
            {isCreatingFolder ? (
              <div className="space-y-2">
                <StyledInput
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFolder();
                    if (e.key === 'Escape') setIsCreatingFolder(false);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFolder}
                    className="flex-1 px-4 py-2 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingFolder(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-darkTeal rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="w-full flex items-center justify-center p-2 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500"
              >
                <Folder className="h-6 w-6 mr-2" />
                New Folder
              </button>
            )}
            <button onClick={() => setIsCollapse(!collapse)}  className="w-full flex items-center justify-center p-2 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500">
              <PanelBottomClose className="size-5 mx-2"/>
                Topics & Folders
            </button>
            <div
  className={`sidebar-scroll overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
    collapse ? 'max-h-0 opacity-0' : 'max-h-[calc(100vh-20rem)] opacity-100'
  }`}
>
              {((folders && folders.length > 0) || (topics && topics.length > 0)) && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={[...folders.map((f) => String(f.id)), ...topics.filter(t => !t.folderId).map((t) => String(t.id))]}
                  strategy={verticalListSortingStrategy}
                >
                  {folders.map((folder) => (
                    <SortableFolder
                      key={folder.id}
                      folder={folder}
                      topics={topics}
                      selectedTopic={selectedTopic}
                      onSelect={(topicId) => {
                        setSelectedTopic(topicId);
                        setShowQuote(false);
                      }}
                      onDelete={deleteFolder}
                      onRename={renameFolder}
                      onToggle={toggleFolderOpen}
                    />
                  ))}
                  {topics.filter(t => !t.folderId).map((topic) => (
                    <SortableTopicItem
                      key={topic.id}
                      topic={topic}
                      isSelected={selectedTopic === topic.id}
                      onSelect={(topicId) => {
                        setSelectedTopic(topicId);
                        setShowQuote(false);
                      }}
                      onDelete={(topicId) => {
                        setShowDeleteModal(true);
                        setTopicToDelete(topicId);
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isSidebarOpen ? "flex" : "hidden"
          } items-center justify-between p-4 fixed bottom-2`}
        >
          <Logout onClick={handleLogout} title={"Logout"}></Logout>
          <DayNightButton className="block md:hidden ml-4" />
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300 font-technor-bold">
            <div className="bg-customMint  dark:bg-dark1 p-6 rounded-lg shadow-lg text-center dark:text-darkText">
              <p className="text-lg mb-4">
                Are you sure you want to delete this topic?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    deleteTopic(topicToDelete); // Use the stored topic ID for deletion
                    setShowDeleteModal(false); // Close modal after confirming
                  }}
                  className="px-4 py-2 bg-customTeal text-customPeach rounded hover:bg-customOrange"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-customPeach rounded hover:bg-slate-300 dark:bg-darkTeal dark:hover:bg-darkBorder"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isSidebarOpen && (
        <div
          className="w-1 cursor-col-resize hover:bg-customTeal active:bg-customTeal transition-colors duration-200 relative"
          onMouseDown={() => setIsResizing(true)}
          style={{
            position: 'absolute',
            left: `${sidebarWidth}px`,
            top: 0,
            bottom: 0,
            zIndex: 51,
          }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-customPeach shadow-sm font-technor-bold dark:bg-dark1 dark-animation">
          <div className="flex items-center justify-between p-4 z-10">
            <div className="flex items-center justify-start md:justify-between w-full px-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 dark:text-darkText" />
                ) : (
                  <Menu className="h-5 w-5 dark:text-darkText" />
                )}
              </button>
              <h1 className="ml-4 text-3xl font-semibold dark:text-darkText uppercase">
                {showQuote
                  ? "Daily Quote"
                  : selectedTopic
                  ? selectedTopicData?.name
                  : "WELCOME TO  MIGRATION"}
              </h1>
              <DayNightButton className="hidden md:block" />
            </div>
            {/* Only show the sub-topic input for modal-note type */}
            {selectedTopic && isModalNoteType && (
              <div className="flex space-x-2">
                <StyledInput
                  type="text"
                  value={newSubTopicName}
                  onChange={(e) => setNewSubTopicName(e.target.value)}
                  placeholder="New sub notes"
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSubTopic}
                  className="py-2 px-6 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500"
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-mainbg dark:bg-darkhover dark:text-darkText dark-animation"
          style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          // filter: backgroundImage ? 'blur(5px)' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.6s fade-in'
        }}>
  <div className="relative z-10">
    {!showQuote && !selectedTopic ? (
      <> 
     
        <div className="flex items-center gap-2 pb-8">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleBackgroundUpload} 
          className="hidden" 
          id="background-upload"
        />
        <label 
          htmlFor="background-upload" 
          className="cursor-pointer flex items-center p-2 bg-customTeal text-white rounded-lg hover:bg-customMint"
        >
       <Image className="size-4"/>
        </label>
        {backgroundImage && (
          <button 
            onClick={clearBackground}
            className="cursor-pointer flex items-center p-2 bg-customOrange text-white rounded-lg "
          >
            <X className="size-4"/>
          </button>
        )}
      </div>
      <Home/>
  
   
      </>
      
    ) : (
      selectedTopic && renderContent()
    )}
  </div>

        
        </main>
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubTopic(null);
        }}
        title={selectedSubTopicData?.name}
        content={selectedSubTopicData?.content || ""}
        onSave={(content) =>
          updateSubTopicContent(selectedTopic, selectedSubTopic, content)
        }
      />
    </div>
  );
};

export default NoteApp;
