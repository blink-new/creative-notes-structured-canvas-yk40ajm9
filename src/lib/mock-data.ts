import { Note, NoteCollection, Block } from "@/types";
import { generateId } from "./block-utils";

// Helper function to create a timestamp
const createTimestamp = (daysAgo: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Sample blocks for notes
export const createSampleBlocks = (): Block[] => [
  {
    id: generateId(),
    type: "heading-1",
    content: "Getting Started with Creative Notes",
  },
  {
    id: generateId(),
    type: "paragraph",
    content: "This is a Notion-inspired application for taking structured creative notes. It provides a canvas for your ideas to flow while keeping them organized.",
  },
  {
    id: generateId(),
    type: "heading-2",
    content: "Key Features",
  },
  {
    id: generateId(),
    type: "bullet-list",
    content: "Block-based editing for flexible content creation",
  },
  {
    id: generateId(),
    type: "bullet-list",
    content: "Multiple view options: document, kanban, and mind map",
  },
  {
    id: generateId(),
    type: "bullet-list",
    content: "Smart linking between notes to create a knowledge graph",
  },
  {
    id: generateId(),
    type: "heading-2",
    content: "Getting Started",
  },
  {
    id: generateId(),
    type: "paragraph",
    content: "To create a new note, click the + button in the sidebar or use the keyboard shortcut Ctrl+N (Cmd+N on Mac).",
  },
  {
    id: generateId(),
    type: "divider",
    content: "",
  },
  {
    id: generateId(),
    type: "quote",
    content: "Creativity is intelligence having fun. - Albert Einstein",
  },
];

// Sample notes
export const sampleNotes: Note[] = [
  {
    id: generateId(),
    title: "Welcome to Creative Notes",
    emoji: "👋",
    blocks: createSampleBlocks(),
    tags: ["welcome", "guide"],
    createdAt: createTimestamp(0),
    updatedAt: createTimestamp(0),
    pinned: true,
  },
  {
    id: generateId(),
    title: "Project Ideas",
    emoji: "💡",
    blocks: [
      {
        id: generateId(),
        type: "heading-1",
        content: "Project Ideas",
      },
      {
        id: generateId(),
        type: "paragraph",
        content: "A collection of potential project ideas to explore.",
      },
      {
        id: generateId(),
        type: "to-do",
        content: "Mobile app for plant care tracking",
        properties: { checked: false },
      },
      {
        id: generateId(),
        type: "to-do",
        content: "Interactive data visualization tool",
        properties: { checked: true },
      },
      {
        id: generateId(),
        type: "to-do",
        content: "Recipe collection with AI-powered suggestions",
        properties: { checked: false },
      },
    ],
    tags: ["projects", "ideas"],
    createdAt: createTimestamp(2),
    updatedAt: createTimestamp(1),
    pinned: false,
  },
  {
    id: generateId(),
    title: "Reading List",
    emoji: "📚",
    blocks: [
      {
        id: generateId(),
        type: "heading-1",
        content: "Books to Read",
      },
      {
        id: generateId(),
        type: "to-do",
        content: "Atomic Habits by James Clear",
        properties: { checked: true },
      },
      {
        id: generateId(),
        type: "to-do",
        content: "The Design of Everyday Things by Don Norman",
        properties: { checked: false },
      },
      {
        id: generateId(),
        type: "to-do",
        content: "Deep Work by Cal Newport",
        properties: { checked: false },
      },
    ],
    tags: ["reading", "books"],
    createdAt: createTimestamp(5),
    updatedAt: createTimestamp(3),
    pinned: false,
  },
];

// Sample collections
export const sampleCollections: NoteCollection[] = [
  {
    id: generateId(),
    title: "Personal Projects",
    emoji: "🚀",
    description: "Ideas and plans for personal projects",
    notes: [sampleNotes[1].id],
    createdAt: createTimestamp(5),
    updatedAt: createTimestamp(2),
    pinned: true,
  },
  {
    id: generateId(),
    title: "Learning Resources",
    emoji: "🧠",
    description: "Books, courses, and other learning materials",
    notes: [sampleNotes[2].id],
    createdAt: createTimestamp(10),
    updatedAt: createTimestamp(3),
    pinned: false,
  },
];

// Initialize storage with sample data
export const initializeWithSampleData = () => {
  try {
    // Only initialize if storage is empty
    const existingNotes = localStorage.getItem('creative-notes-app:notes');
    const existingCollections = localStorage.getItem('creative-notes-app:collections');
    
    if (!existingNotes) {
      localStorage.setItem('creative-notes-app:notes', JSON.stringify(sampleNotes));
    }
    
    if (!existingCollections) {
      localStorage.setItem('creative-notes-app:collections', JSON.stringify(sampleCollections));
    }
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
  }
};