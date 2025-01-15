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

  const addTopic = async (name, type) => {
    await addDoc(collection(db, 'topics'), {
      name,
      type, // 'modal-note', 'checklist', or 'list-card'
      userId,
      subTopics: [], // for modal-note type
      items: [], // for checklist and list-card types
      createdAt: new Date().toISOString()
    });
  };

  // For modal-note type
  const addSubTopic = async (topicId, name) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const newSubTopic = {
      id: Date.now().toString(),
      name,
      content: '',
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(topicRef, {
      subTopics: [...(topic.subTopics || []), newSubTopic]
    });
  };

  const updateSubTopicContent = async (topicId, subTopicId, content) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedSubTopics = topic.subTopics.map(subTopic => 
      subTopic.id === subTopicId ? { ...subTopic, content } : subTopic
    );
    
    await updateDoc(topicRef, {
      subTopics: updatedSubTopics
    });
  };

  // For checklist and list-card types
  const addItem = async (topicId, content) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const newItem = {
      id: Date.now().toString(),
      content,
      completed: false, // only used for checklist type
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(topicRef, {
      items: [...(topic.items || []), newItem]
    });
  };

  const toggleItemStatus = async (topicId, itemId) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedItems = topic.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    await updateDoc(topicRef, {
      items: updatedItems
    });
  };

  const deleteItem = async (topicId, itemId) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedItems = topic.items.filter(item => item.id !== itemId);
    
    await updateDoc(topicRef, {
      items: updatedItems
    });
  };

  const deleteSubTopic = async (topicId, subTopicId) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedSubTopics = topic.subTopics.filter(subTopic => subTopic.id !== subTopicId);
    
    await updateDoc(topicRef, {
      subTopics: updatedSubTopics
    });
  };

  const deleteTopic = async (topicId) => {
    await deleteDoc(doc(db, 'topics', topicId));
  };

  return {
    topics,
    loading,
    addTopic,
    addSubTopic,
    updateSubTopicContent,
    addItem,
    toggleItemStatus,
    deleteItem,
    deleteSubTopic,
    deleteTopic
  };
};