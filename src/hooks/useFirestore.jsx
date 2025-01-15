import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const useFirestore = (userId) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'topics'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopics(topicsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTopic = async (name) => {
    await addDoc(collection(db, 'topics'), {
      name,
      userId,
      notes: [],
      createdAt: new Date().toISOString()
    });
  };

  const addNote = async (topicId, noteContent) => {
    const topicRef = doc(db, 'topics', topicId);
    const newNote = {
      id: Date.now().toString(),
      content: noteContent,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const topic = topics.find(t => t.id === topicId);
    await updateDoc(topicRef, {
      notes: [...(topic.notes || []), newNote]
    });
  };

  const toggleNoteStatus = async (topicId, noteId) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedNotes = topic.notes.map(note =>
      note.id === noteId ? { ...note, completed: !note.completed } : note
    );
    
    await updateDoc(topicRef, { notes: updatedNotes });
  };

  const deleteTopic = async (topicId) => {
    await deleteDoc(doc(db, 'topics', topicId));
  };

  return {
    topics,
    loading,
    addTopic,
    addNote,
    toggleNoteStatus,
    deleteTopic
  };
};