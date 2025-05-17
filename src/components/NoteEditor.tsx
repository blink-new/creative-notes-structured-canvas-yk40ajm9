import React, { useState, useEffect } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { BlockType } from '@/types';
import { Block } from '@/components/blocks/Block';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Save, 
  Book, 
  LayoutGrid, 
  Network, 
  Share2, 
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NoteEditor() {
  const { currentNote, updateNote, addNewBlock, createNewNote, setCurrentNote } = useNotes();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  
  // Update local state when current note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      
      // Select the first block if none is selected
      if (currentNote.blocks.length > 0 && !selectedBlockId) {
        setSelectedBlockId(currentNote.blocks[0].id);
      }
    } else {
      setSelectedBlockId(null);
      setTitle('');
    }
  }, [currentNote]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    
    if (currentNote) {
      updateNote({
        ...currentNote,
        title: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };
  
  // Add a new block of the specified type
  const handleAddBlock = (type: BlockType) => {
    addNewBlock(type, selectedBlockId || undefined);
  };

  // Handle creating a new note
  const handleCreateNewNote = () => {
    const newNote = createNewNote();
    setCurrentNote(newNote);
  };
  
  // Empty state when no note is selected
  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col p-8 text-center text-navy/70">
        <Sparkles size={48} className="mb-4 text-sage" />
        <h2 className="text-2xl font-semibold mb-2">No Note Selected</h2>
        <p className="max-w-md mb-6">
          Select a note from the sidebar or create a new one to start capturing your ideas.
        </p>
        <Button 
          onClick={handleCreateNewNote}
          className="bg-sage hover:bg-sage/80 text-white"
        >
          <Plus size={16} className="mr-1" />
          Create New Note
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto">
      {/* Editor Header */}
      <div className="border-b border-sage/20 p-4 flex justify-between items-center">
        <div className="flex-1">
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="text-xl font-semibold border-none focus:ring-0 px-0 h-auto text-ink placeholder:text-ink/30"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Switcher */}
          <div className="flex border border-sage/30 rounded-md overflow-hidden">
            <Button variant="ghost" size="sm" className="rounded-none px-3 bg-sage/10 hover:bg-sage/20">
              <Book size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none px-3 hover:bg-sage/10">
              <LayoutGrid size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none px-3 hover:bg-sage/10">
              <Network size={16} />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="text-navy">
            <Share2 size={18} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-navy">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-10 py-8">
          {/* Cover Image (placeholder for now) */}
          {currentNote.coverImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={currentNote.coverImage} 
                alt="Cover" 
                className="w-full h-40 object-cover" 
              />
            </div>
          )}
          
          {/* Emoji and Title */}
          <div className="mb-6 flex items-center">
            {currentNote.emoji && (
              <div className="text-4xl mr-3">{currentNote.emoji}</div>
            )}
          </div>
          
          {/* Blocks */}
          <div className="relative">
            {currentNote.blocks.map(block => (
              <Block
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
              />
            ))}
            
            {/* Add Block Button */}
            <div className="py-2 pl-3 pr-1 -ml-10 opacity-0 hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 border-sage/30">
                    <Plus size={14} className="mr-1" />
                    Add Block
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddBlock('paragraph')}>
                    Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('heading-1')}>
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('heading-2')}>
                    Heading 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('heading-3')}>
                    Heading 3
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('bullet-list')}>
                    Bullet List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('numbered-list')}>
                    Numbered List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('to-do')}>
                    To-Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('quote')}>
                    Quote
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('code')}>
                    Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('divider')}>
                    Divider
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock('image')}>
                    Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Footer */}
      <div className="border-t border-sage/20 p-3 flex justify-between items-center text-xs text-navy/60">
        <div>
          Last updated: {new Date(currentNote.updatedAt).toLocaleString()}
        </div>
        <div>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Save size={12} className="mr-1" />
            Saved
          </Button>
        </div>
      </div>
    </div>
  );
}