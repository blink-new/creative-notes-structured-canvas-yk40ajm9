import { Note, NoteCollection, UserPreferences } from "@/types";

// Local Storage Keys
const NOTES_KEY = 'creative-notes-app:notes';
const COLLECTIONS_KEY = 'creative-notes-app:collections';
const PREFERENCES_KEY = 'creative-notes-app:preferences';

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultView: 'document',
  sidebarCollapsed: false,
  fontScale: 1,
};

// Note Storage
export const notesStorage = {
  getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Failed to get notes from storage:', error);
      return [];
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to storage:', error);
    }
  },

  getNote(id: string): Note | undefined {
    const notes = this.getNotes();
    return notes.find(note => note.id === id);
  },

  saveNote(note: Note): void {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    
    if (index !== -1) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    
    this.saveNotes(notes);
  },

  deleteNote(id: string): void {
    const notes = this.getNotes();
    this.saveNotes(notes.filter(note => note.id !== id));
  }
};

// Collection Storage
export const collectionsStorage = {
  getCollections(): NoteCollection[] {
    try {
      const collections = localStorage.getItem(COLLECTIONS_KEY);
      return collections ? JSON.parse(collections) : [];
    } catch (error) {
      console.error('Failed to get collections from storage:', error);
      return [];
    }
  },

  saveCollections(collections: NoteCollection[]): void {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (error) {
      console.error('Failed to save collections to storage:', error);
    }
  },

  getCollection(id: string): NoteCollection | undefined {
    const collections = this.getCollections();
    return collections.find(collection => collection.id === id);
  },

  saveCollection(collection: NoteCollection): void {
    const collections = this.getCollections();
    const index = collections.findIndex(c => c.id === collection.id);
    
    if (index !== -1) {
      collections[index] = collection;
    } else {
      collections.push(collection);
    }
    
    this.saveCollections(collections);
  },

  deleteCollection(id: string): void {
    const collections = this.getCollections();
    this.saveCollections(collections.filter(collection => collection.id !== id));
  }
};

// User Preferences Storage
export const preferencesStorage = {
  getPreferences(): UserPreferences {
    try {
      const preferences = localStorage.getItem(PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Failed to get preferences from storage:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
    }
  },

  updatePreference<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ): void {
    const preferences = this.getPreferences();
    this.savePreferences({
      ...preferences,
      [key]: value,
    });
  }
};