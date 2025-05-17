import { Block, BlockType, Note } from "@/types";

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Create a new block with default content
export function createBlock(type: BlockType, content: string = ""): Block {
  return {
    id: generateId(),
    type,
    content,
    properties: {},
  };
}

// Create a new note with default blocks
export function createNote(title: string = "Untitled"): Note {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    blocks: [
      createBlock("paragraph", ""),
    ],
    createdAt: now,
    updatedAt: now,
  };
}

// Get default content for a block type
export function getDefaultContent(type: BlockType): string {
  switch (type) {
    case "paragraph":
      return "";
    case "heading-1":
    case "heading-2":
    case "heading-3":
      return "Heading";
    case "bullet-list":
    case "numbered-list":
      return "List item";
    case "to-do":
      return "To-do item";
    case "quote":
      return "Quote";
    case "code":
      return "// Code";
    default:
      return "";
  }
}

// Add a block after a specific block ID
export function addBlockAfter(note: Note, blockId: string, newBlock: Block): Note {
  const newBlocks = [...note.blocks];
  const blockIndex = newBlocks.findIndex(b => b.id === blockId);
  
  if (blockIndex !== -1) {
    newBlocks.splice(blockIndex + 1, 0, newBlock);
  } else {
    newBlocks.push(newBlock);
  }
  
  return {
    ...note,
    blocks: newBlocks,
    updatedAt: new Date().toISOString(),
  };
}

// Update a block's content
export function updateBlockContent(note: Note, blockId: string, content: string): Note {
  return {
    ...note,
    blocks: note.blocks.map(block => 
      block.id === blockId 
        ? { ...block, content }
        : block
    ),
    updatedAt: new Date().toISOString(),
  };
}

// Change a block's type
export function changeBlockType(note: Note, blockId: string, newType: BlockType): Note {
  return {
    ...note,
    blocks: note.blocks.map(block => 
      block.id === blockId 
        ? { ...block, type: newType }
        : block
    ),
    updatedAt: new Date().toISOString(),
  };
}

// Delete a block
export function deleteBlock(note: Note, blockId: string): Note {
  return {
    ...note,
    blocks: note.blocks.filter(block => block.id !== blockId),
    updatedAt: new Date().toISOString(),
  };
}

// Move a block up or down
export function moveBlock(note: Note, blockId: string, direction: 'up' | 'down'): Note {
  const newBlocks = [...note.blocks];
  const blockIndex = newBlocks.findIndex(b => b.id === blockId);
  
  if (blockIndex === -1) return note;
  
  if (direction === 'up' && blockIndex > 0) {
    const temp = newBlocks[blockIndex];
    newBlocks[blockIndex] = newBlocks[blockIndex - 1];
    newBlocks[blockIndex - 1] = temp;
  } else if (direction === 'down' && blockIndex < newBlocks.length - 1) {
    const temp = newBlocks[blockIndex];
    newBlocks[blockIndex] = newBlocks[blockIndex + 1];
    newBlocks[blockIndex + 1] = temp;
  }
  
  return {
    ...note,
    blocks: newBlocks,
    updatedAt: new Date().toISOString(),
  };
}