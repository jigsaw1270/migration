import { useState } from "react";
import {
  Users,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Trash2,
  FileText,
  Bird,
  Slack,
  NotebookPen,
  PackagePlus,
  Quote,
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

  const { user } = useAuth();
  const {
    topics,
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
  } = useFirestore(user?.uid);
  const navigate = useNavigate();

  const handleAddTopic = async (type) => {
    if (newTopicName.trim()) {
      await addTopic(newTopicName, type);
      setNewTopicName("");
      setIsSelectingType(false);
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

  const selectedTopicData = topics?.find((t) => t.id === selectedTopic);
  const selectedSubTopicData = selectedTopicData?.subTopics?.find(
    (st) => st.id === selectedSubTopic
  );
  const isModalNoteType = selectedTopicData?.type === "modal-note";

  const renderContent = () => {
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
                  className="flex items-center p-4 bg-customMint rounded-lg shadow font-technor-medium hover:scale-[1.01] transition-all hover:bg-customTeal dark:text-black dark:hover:text-customPeach hover:text-customPeach duration-300 border-2 border-customTeal"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItemStatus(selectedTopic, item.id)}
                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span
                    className={`ml-3 ${
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.items?.map((item) => (
                <ListCard
                  key={item.id}
                  item={item}
                  onDelete={(itemId) => deleteItem(selectedTopic, itemId)}
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
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-customPeach shadow-lg transition-all duration-300 overflow-x-hidden dark:bg-dark1 dark:text-customPeach fixed md:relative h-full z-50 md:z-auto`}
      >
        <div className="p-4">
          <div className="mb-8">
            <div className="flex items-center">
              <img src={logo} alt="logo" className="size-6" />
              <span className="ml-2 text-2xl font-technor-black">
                Migration
              </span>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full block md:hidden ml-auto"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 dark:text-customPeach" />
                ) : (
                  <Menu className="h-5 w-5 dark:text-customPeach" />
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
              <div className="space-y-2">
                <StyledInput
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Topic name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <TopicTypeSelector
                  onSelect={(type) => handleAddTopic(type)}
                  onCancel={() => setIsSelectingType(false)}
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
            <div className="space-y-1">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center  group font-technor-black text-3xl border-b-2 border-gray-200"
                >
                  <button
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setShowQuote(false);
                    }}
                    className={`flex-1 flex items-center p-1 text-left rounded-lg transition-colors uppercase ${
                      selectedTopic === topic.id
                        ? "bg-customMint text-customOrange dark:bg-darkTeal dark:text-customMint "
                        : "hover:bg-customMint dark:hover:bg-darkhover"
                    }`}
                  >
                    <NotebookPen className="h-6 w-6 mr-2" />
                    {topic.name}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setTopicToDelete(topic.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
            <div className="bg-customMint  dark:bg-dark1 p-6 rounded-lg shadow-lg text-center dark:text-customPeach">
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
                  className="px-4 py-2 bg-customPeach rounded hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-customPeach shadow-sm font-technor-bold dark:bg-dark1 dark-animation">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center justify-start md:justify-between w-full px-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 dark:text-customPeach" />
                ) : (
                  <Menu className="h-5 w-5 dark:text-customPeach" />
                )}
              </button>
              <h1 className="ml-4 text-3xl font-semibold dark:text-customPeach">
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

        <main className="flex-1 overflow-auto p-6 bg-mainbg dark:bg-darkhover dark:text-customPeach dark-animation">
          {selectedTopic && renderContent()}
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
