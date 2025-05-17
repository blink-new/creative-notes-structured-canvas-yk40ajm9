import React from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Block as BlockType } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  ListOrdered, 
  List, 
  CheckSquare, 
  Quote as QuoteIcon,
  Image,
  Code,
  Minus,
  GripVertical,
  Eye
} from 'lucide-react';

interface StructurePanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function StructurePanel({ collapsed, onToggle }: StructurePanelProps) {
  const { currentNote } = useNotes();
  
  const getBlockIcon = (block: BlockType) => {
    switch (block.type) {
      case 'heading-1':
        return <Heading1 size={14} />;
      case 'heading-2':
        return <Heading2 size={14} />;
      case 'heading-3':
        return <Heading3 size={14} />;
      case 'paragraph':
        return <AlignLeft size={14} />;
      case 'bullet-list':
        return <List size={14} />;
      case 'numbered-list':
        return <ListOrdered size={14} />;
      case 'to-do':
        return <CheckSquare size={14} />;
      case 'quote':
        return <QuoteIcon size={14} />;
      case 'image':
        return <Image size={14} />;
      case 'code':
        return <Code size={14} />;
      case 'divider':
        return <Minus size={14} />;
      default:
        return <AlignLeft size={14} />;
    }
  };
  
  if (!currentNote) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "h-screen bg-paper border-l border-sage/20 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[50px]" : "w-[260px]"
      )}
    >
      {/* Structure Panel Header */}
      <div className="flex items-center justify-between p-3 border-b border-sage/20">
        {!collapsed && (
          <h2 className="text-sm font-medium text-ink">Structure</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-navy hover:text-navy/80 hover:bg-sage/10"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>
      
      {/* Structure Content */}
      <ScrollArea className="flex-1">
        {!collapsed ? (
          <div className="p-2">
            {/* Structure Tree */}
            <div className="space-y-1">
              {currentNote.blocks.map((block) => (
                <div 
                  key={block.id} 
                  className="flex items-center p-2 hover:bg-sage/10 rounded-md cursor-pointer group"
                >
                  <div className="opacity-40 mr-1 group-hover:opacity-100">
                    <GripVertical size={12} />
                  </div>
                  <div className="mr-2 text-navy">
                    {getBlockIcon(block)}
                  </div>
                  <div className="truncate text-sm flex-1">
                    {block.content || getBlockTypeName(block.type)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  >
                    <Eye size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-3 space-y-3">
            {/* Mini structure view when collapsed */}
            {currentNote.blocks.slice(0, 10).map((block) => (
              <div 
                key={block.id} 
                className="text-navy/70 hover:text-navy cursor-pointer" 
                title={block.content || getBlockTypeName(block.type)}
              >
                {getBlockIcon(block)}
              </div>
            ))}
            
            {currentNote.blocks.length > 10 && (
              <div className="text-navy/50 text-xs">+{currentNote.blocks.length - 10}</div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Helper function to get a readable name for a block type
function getBlockTypeName(type: string): string {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}