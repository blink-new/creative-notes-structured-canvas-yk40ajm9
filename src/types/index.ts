// Block Types
export type BlockType = 
  | 'paragraph'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'bullet-list'
  | 'numbered-list'
  | 'to-do'
  | 'quote'
  | 'divider'
  | 'image'
  | 'code'
  | 'concept-map'
  | 'mood-board'
  | 'sketch';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties?: Record<string, any>;
  children?: Block[];
}

// Note Types
export interface Note {
  id: string;
  title: string;
  emoji?: string;
  coverImage?: string;
  blocks: Block[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  parentId?: string | null;
}

export interface NoteCollection {
  id: string;
  title: string;
  emoji?: string;
  coverImage?: string;
  description?: string;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'document' | 'kanban' | 'mindmap';
  sidebarCollapsed: boolean;
  fontScale: number;
}

// View Types
export type ViewType = 'document' | 'kanban' | 'mindmap';

// Template Types
export interface Template {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  coverImage?: string;
  blocks: Block[];
  category: 'creative' | 'project' | 'personal' | 'business';
}