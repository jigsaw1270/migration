import React, { useState } from 'react';
import { Users, PlusCircle, Menu, X, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const NoteApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [newNote, setNewNote] = useState('');
  
  const { user } = useAuth();
  const { topics, loading, addTopic, addNote, toggleNoteStatus, deleteTopic } = useFirestore(user?.uid);
  const navigate = useNavigate();

  const handleAddTopic = async () => {
    if (newTopicName.trim()) {
      await addTopic(newTopicName);
      setNewTopicName('');
    }
  };

  const handleAddNote = async () => {
    if (selectedTopic && newNote.trim()) {
      await addNote(selectedTopic, newNote);
      setNewNote('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="ml-2 font-semibold">Note App</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="New topic"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTopic}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between group"
                >
                  <button
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`flex-1 p-2 text-left rounded-lg transition-colors ${
                      selectedTopic === topic.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {topic.name}
                  </button>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <h1 className="ml-4 text-xl font-semibold">
              {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : 'Select a Topic'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {selectedTopic && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-2">
                {topics.find(t => t.id === selectedTopic)?.notes.map(note => (
                  <div
                    key={note.id}
                    className="flex items-center p-4 bg-white rounded-lg shadow"
                  >
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() => toggleNoteStatus(selectedTopic, note.id)}
                      className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`ml-3 ${note.completed ? 'line-through text-gray-400' : ''}`}>
                      {note.content}
                    </span>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NoteApp;