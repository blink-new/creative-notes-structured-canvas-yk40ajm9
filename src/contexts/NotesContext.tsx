import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, NoteCollection, Block, BlockType } from '@/types';
import { notesStorage, collectionsStorage } from '@/lib/storage';
import { 
  createNote, 
  addBlockAfter, 
  updateBlockContent, 
  changeBlockType, 
  deleteBlock,
  createBlock,
  moveBlock
} from '@/lib/block-utils';
import { initializeWithSampleData } from '@/lib/mock-data';

// Context Interface
interface NotesContextType {
  notes: Note[];
  collections: NoteCollection[];
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  createNewNote: (title?: string) => Note;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  createNewCollection: (title: string, description?: string) => NoteCollection;
  updateCollection: (collection: NoteCollection) => void;
  deleteCollection: (id: string) => void;
  addNoteToCollection: (noteId: string, collectionId: string) => void;
  removeNoteFromCollection: (noteId: string, collectionId: string) => void;
  addNewBlock: (blockType: BlockType, afterBlockId?: string) => void;
  updateBlock: (blockId: string, content: string) => void;
  changeBlock: (blockId: string, newType: BlockType) => void;
  removeBlock: (blockId: string) => void;
  moveBlockDirection: (blockId: string, direction: 'up' | 'down') => void;
  initialized: boolean;
}

// Create Context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Context Provider
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [collections, setCollections] = useState<NoteCollection[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize with data from storage
  useEffect(() => {
    // Initialize with sample data if storage is empty
    initializeWithSampleData();
    
    // Load data from storage
    setNotes(notesStorage.getNotes());
    setCollections(collectionsStorage.getCollections());
    setInitialized(true);
  }, []);

  // Save notes when they change
  useEffect(() => {
    if (initialized) {
      notesStorage.saveNotes(notes);
    }
  }, [notes, initialized]);

  // Save collections when they change
  useEffect(() => {
    if (initialized) {
      collectionsStorage.saveCollections(collections);
    }
  }, [collections, initialized]);

  // Create a new note
  const createNewNote = (title?: string): Note => {
    const newNote = createNote(title);
    setNotes(prevNotes => [...prevNotes, newNote]);
    return newNote;
  };

  // Update an existing note
  const updateNote = (updatedNote: Note) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
    
    // Update current note if it's the one being edited
    if (currentNote?.id === updatedNote.id) {
      setCurrentNote(updatedNote);
    }
  };

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    // Update collections that contain this note
    setCollections(prevCollections => 
      prevCollections.map(collection => ({
        ...collection,
        notes: collection.notes.filter(noteId => noteId !== id)
      }))
    );
    
    // Clear current note if it's the one being deleted
    if (currentNote?.id === id) {
      setCurrentNote(null);
    }
  };

  // Create a new collection
  const createNewCollection = (title: string, description?: string): NoteCollection => {
    const now = new Date().toISOString();
    const newCollection: NoteCollection = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      notes: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setCollections(prevCollections => [...prevCollections, newCollection]);
    return newCollection;
  };

  // Update an existing collection
  const updateCollection = (updatedCollection: NoteCollection) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    );
  };

  // Delete a collection
  const deleteCollection = (id: string) => {
    setCollections(prevCollections => 
      prevCollections.filter(collection => collection.id !== id)
    );
  };

  // Add a note to a collection
  const addNoteToCollection = (noteId: string, collectionId: string) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => {
        if (collection.id === collectionId && !collection.notes.includes(noteId)) {
          return {
            ...collection,
            notes: [...collection.notes, noteId],
            updatedAt: new Date().toISOString(),
          };
        }
        return collection;
      })
    );
  };

  // Remove a note from a collection
  const removeNoteFromCollection = (noteId: string, collectionId: string) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            notes: collection.notes.filter(id => id !== noteId),
            updatedAt: new Date().toISOString(),
          };
        }
        return collection;
      })
    );
  };

  // Block Operations (only if a note is being edited)
  const addNewBlock = (blockType: BlockType, afterBlockId?: string) => {
    if (!currentNote) return;
    
    const newBlock = createBlock(blockType);
    
    if (afterBlockId) {
      const updatedNote = addBlockAfter(currentNote, afterBlockId, newBlock);
      updateNote(updatedNote);
    } else if (currentNote.blocks.length > 0) {
      // Add after the last block if no block ID is specified
      const lastBlockId = currentNote.blocks[currentNote.blocks.length - 1].id;
      const updatedNote = addBlockAfter(currentNote, lastBlockId, newBlock);
      updateNote(updatedNote);
    } else {
      // If there are no blocks, just add the new block
      const updatedNote = {
        ...currentNote,
        blocks: [newBlock],
        updatedAt: new Date().toISOString(),
      };
      updateNote(updatedNote);
    }
  };

  const updateBlock = (blockId: string, content: string) => {
    if (!currentNote) return;
    const updatedNote = updateBlockContent(currentNote, blockId, content);
    updateNote(updatedNote);
  };

  const changeBlock = (blockId: string, newType: BlockType) => {
    if (!currentNote) return;
    const updatedNote = changeBlockType(currentNote, blockId, newType);
    updateNote(updatedNote);
  };

  const removeBlock = (blockId: string) => {
    if (!currentNote) return;
    const updatedNote = deleteBlock(currentNote, blockId);
    updateNote(updatedNote);
  };

  const moveBlockDirection = (blockId: string, direction: 'up' | 'down') => {
    if (!currentNote) return;
    const updatedNote = moveBlock(currentNote, blockId, direction);
    updateNote(updatedNote);
  };

  // Context value
  const value: NotesContextType = {
    notes,
    collections,
    currentNote,
    setCurrentNote,
    createNewNote,
    updateNote,
    deleteNote,
    createNewCollection,
    updateCollection,
    deleteCollection,
    addNoteToCollection,
    removeNoteFromCollection,
    addNewBlock,
    updateBlock,
    changeBlock,
    removeBlock,
    moveBlockDirection,
    initialized,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook for using the context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};