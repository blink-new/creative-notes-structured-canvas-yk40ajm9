import React, { useState } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { cn } from '@/lib/utils';
import { NoteCollection, Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Search, 
  Star, 
  FolderPlus, 
  ScrollText,
  Settings
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { 
    notes, 
    collections, 
    setCurrentNote, 
    createNewNote, 
    createNewCollection 
  } = useNotes();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter notes by search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get pinned notes
  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  
  // Get recent notes (not pinned, sorted by updatedAt)
  const recentNotes = filteredNotes
    .filter(note => !note.pinned)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  const handleCreateNote = () => {
    const newNote = createNewNote();
    setCurrentNote(newNote);
  };
  
  const handleCreateCollection = () => {
    createNewCollection('New Collection');
  };
  
  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
  };
  
  return (
    <div 
      className={cn(
        "h-screen bg-paper border-r border-sage/20 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[50px]" : "w-[260px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-b border-sage/20">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-ink">Creative Notes</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-navy hover:text-navy/80 hover:bg-sage/10"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* Sidebar Actions */}
      <div className="flex items-center p-2 gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size={collapsed ? "icon" : "sm"} 
                className="bg-sage/10 hover:bg-sage/20 text-navy border-sage/30"
                onClick={handleCreateNote}
              >
                <Plus size={16} className="mr-1" />
                {!collapsed && "New Note"}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">New Note</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        
        {!collapsed && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-sage/10"
              onClick={handleCreateCollection}
            >
              <FolderPlus size={16} className="mr-1" />
              Collection
            </Button>
          </>
        )}
      </div>
      
      {/* Search */}
      {!collapsed && (
        <div className="px-2 py-2">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-2.5 text-navy/60" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-8 py-2 text-sm bg-sage/5 border border-sage/20 rounded-md focus:border-sage/50 focus:outline-none focus:ring-1 focus:ring-sage/30 text-ink"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* Sidebar Content */}
      <ScrollArea className="flex-1 px-1 py-2">
        {!collapsed && (
          <>
            {/* Navigation */}
            <div className="px-2 py-1">
              <div className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy">
                <Home size={18} className="mr-2" />
                <span>Home</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy">
                <Star size={18} className="mr-2" />
                <span>Favorites</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy">
                <ScrollText size={18} className="mr-2" />
                <span>All Notes</span>
              </div>
            </div>
            
            <Separator className="my-2 bg-sage/20" />
            
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <>
                <div className="px-3 py-1 text-xs font-medium text-navy/70 uppercase">
                  Pinned
                </div>
                <div className="space-y-1 px-2">
                  {pinnedNotes.map(note => (
                    <div 
                      key={note.id}
                      className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy group"
                      onClick={() => handleSelectNote(note)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center mr-2 text-lg">
                        {note.emoji || '📝'}
                      </div>
                      <span className="truncate flex-1">{note.title}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2 bg-sage/20" />
              </>
            )}
            
            {/* Recent Notes */}
            <div className="px-3 py-1 text-xs font-medium text-navy/70 uppercase">
              Recent
            </div>
            <div className="space-y-1 px-2">
              {recentNotes.map(note => (
                <div 
                  key={note.id}
                  className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy group"
                  onClick={() => handleSelectNote(note)}
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-2 text-lg">
                    {note.emoji || '📝'}
                  </div>
                  <span className="truncate flex-1">{note.title}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-2 bg-sage/20" />
            
            {/* Collections */}
            <div className="px-3 py-1 text-xs font-medium text-navy/70 uppercase">
              Collections
            </div>
            <div className="space-y-1 px-2">
              {collections.map(collection => (
                <div 
                  key={collection.id}
                  className="flex items-center p-2 rounded-md hover:bg-sage/10 cursor-pointer text-navy"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-2 text-lg">
                    {collection.emoji || '📁'}
                  </div>
                  <span className="truncate">{collection.title}</span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {collapsed && (
          <div className="flex flex-col items-center pt-2 space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-sage/10">
                    <Home size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Home</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-sage/10">
                    <Star size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Favorites</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-sage/10">
                    <ScrollText size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">All Notes</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-sage/10">
                    <Search size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Search</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </ScrollArea>
      
      {/* Sidebar Footer */}
      <div className="p-2 border-t border-sage/20 flex items-center justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-navy hover:bg-sage/10">
                <Settings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}