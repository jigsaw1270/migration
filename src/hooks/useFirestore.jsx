import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const useFirestore = (userId) => {
  const [topics, setTopics] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'topics'), 
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort on client-side by order field
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setTopics(topicsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Listen to folders
  useEffect(() => {
    if (!userId) return;

    const foldersQuery = query(
      collection(db, 'folders'),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(foldersQuery, (snapshot) => {
      const foldersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setFolders(foldersData);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTopic = async (name, type, icon = 'NotebookPen') => {
    // Get the current highest order value
    const maxOrder = topics.length > 0 
      ? Math.max(...topics.map(t => t.order || 0)) 
      : -1;
    
    await addDoc(collection(db, 'topics'), {
      name,
      type, // 'modal-note', 'checklist', or 'list-card'
      icon, // Store the icon name
      userId,
      subTopics: [], // for modal-note type
      items: [], // for checklist and list-card types
      order: maxOrder + 1,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(topicRef, {
      subTopics: [...(topic.subTopics || []), newSubTopic]
    });
  };

  const updateSubTopicContent = async (topicId, subTopicId, content) => {
    const htmlContent = content || '';
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedSubTopics = topic.subTopics.map(subTopic => 
      subTopic.id === subTopicId 
        ? { 
            ...subTopic, 
            content: htmlContent,
            updatedAt: new Date().toISOString()
          } 
        : subTopic
    );
    
    await updateDoc(topicRef, {
      subTopics: updatedSubTopics
    });
  };

  // New function to update sub-topic title
  const updateSubTopicTitle = async (topicId, subTopicId, newTitle) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    
    if (!topic) return;

    const updatedSubTopics = topic.subTopics.map(subTopic => 
      subTopic.id === subTopicId 
        ? { 
            ...subTopic, 
            name: newTitle,
            updatedAt: new Date().toISOString()
          } 
        : subTopic
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
      subtext:'',
      completed: false, // only used for checklist type
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(topicRef, {
      items: [...(topic.items || []), newItem]
    });
  };

  const toggleItemStatus = async (topicId, itemId) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedItems = topic.items.map(item =>
      item.id === itemId 
        ? { 
            ...item, 
            completed: !item.completed,
            updatedAt: new Date().toISOString()
          } 
        : item
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

  const updateItem = async (topicId, itemId, updates) => {
    const topicRef = doc(db, 'topics', topicId);
    const topic = topics.find(t => t.id === topicId);
    const updatedItems = topic.items.map(item =>
      item.id === itemId 
        ? { 
            ...item, 
            ...updates,
            updatedAt: new Date().toISOString()
          } 
        : item
    );
    
    await updateDoc(topicRef, {
      items: updatedItems
    });
  };

  const reorderItems = async (topicId, updatedItems) => {
    const topicRef = doc(db, 'topics', topicId);
    
    await updateDoc(topicRef, {
      items: updatedItems
    });
  };

  const reorderTopics = async (reorderedTopics) => {
    // Update each topic with its new order index
    const updatePromises = reorderedTopics.map(async (topic, index) => {
      const topicRef = doc(db, 'topics', topic.id);
      await updateDoc(topicRef, {
        order: index,
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(updatePromises);
  };

  // Folder management functions
  const addFolder = async (name) => {
    const maxOrder = folders.length > 0 
      ? Math.max(...folders.map(f => f.order || 0)) 
      : -1;
    
    await addDoc(collection(db, 'folders'), {
      name,
      userId,
      order: maxOrder + 1,
      isOpen: true, // folders are open by default
      createdAt: new Date().toISOString()
    });
  };

  const renameFolder = async (folderId, newName) => {
    const folderRef = doc(db, 'folders', folderId);
    await updateDoc(folderRef, {
      name: newName,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteFolder = async (folderId) => {
    // Move all topics out of this folder before deleting
    const topicsInFolder = topics.filter(t => t.folderId === folderId);
    const updatePromises = topicsInFolder.map(async (topic) => {
      const topicRef = doc(db, 'topics', topic.id);
      await updateDoc(topicRef, {
        folderId: null,
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(updatePromises);
    await deleteDoc(doc(db, 'folders', folderId));
  };

  const toggleFolderOpen = async (folderId) => {
    const folderRef = doc(db, 'folders', folderId);
    const folder = folders.find(f => f.id === folderId);
    await updateDoc(folderRef, {
      isOpen: !folder.isOpen,
      updatedAt: new Date().toISOString()
    });
  };

  const moveTopicToFolder = async (topicId, folderId) => {
    const topicRef = doc(db, 'topics', topicId);
    await updateDoc(topicRef, {
      folderId: folderId,
      updatedAt: new Date().toISOString()
    });
  };

  const moveTopicOutOfFolder = async (topicId) => {
    const topicRef = doc(db, 'topics', topicId);
    await updateDoc(topicRef, {
      folderId: null,
      updatedAt: new Date().toISOString()
    });
  };

  const reorderFolders = async (reorderedFolders) => {
    const updatePromises = reorderedFolders.map(async (folder, index) => {
      const folderRef = doc(db, 'folders', folder.id);
      await updateDoc(folderRef, {
        order: index,
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(updatePromises);
  };

  return {
    topics,
    folders,
    loading,
    addTopic,
    addSubTopic,
    updateSubTopicContent,
    updateSubTopicTitle,
    addItem,
    toggleItemStatus,
    deleteItem,
    deleteSubTopic,
    deleteTopic,
    updateItem,
    reorderItems,
    reorderTopics,
    // Folder functions
    addFolder,
    renameFolder,
    deleteFolder,
    toggleFolderOpen,
    moveTopicToFolder,
    moveTopicOutOfFolder,
    reorderFolders
  };
};