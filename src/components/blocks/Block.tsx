import React, { useState, useRef, useEffect } from 'react';
import { Block as BlockType } from '@/types';
import { useNotes } from '@/contexts/NotesContext';
import { cn } from '@/lib/utils';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Type, 
  GripVertical,
  Check,
  Image,
  Code,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  onSelect: () => void;
}

export function Block({ block, isSelected, onSelect }: BlockProps) {
  const { updateBlock, changeBlock, removeBlock, moveBlockDirection, addNewBlock } = useNotes();
  const inputRef = useRef<HTMLDivElement>(null);

  // Set initial content only once
  useEffect(() => {
    if (inputRef.current && inputRef.current.innerText !== block.content) {
      inputRef.current.innerText = block.content;
    }
  }, [block.id]);

  // Focus the block when selected
  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  const handleBlur = () => {
    if (inputRef.current) {
      updateBlock(block.id, inputRef.current.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Add a new paragraph block when Enter is pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNewBlock('paragraph', block.id);
    }
    // Handle keyboard shortcuts for block operations
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveBlockDirection(block.id, 'up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveBlockDirection(block.id, 'down');
          break;
        case 'Backspace':
          if (inputRef.current && inputRef.current.innerText === '') {
            e.preventDefault();
            removeBlock(block.id);
          }
          break;
      }
    }
  };

  // Render different block types
  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div
            ref={inputRef}
            contentEditable
            dir="ltr"
            className="outline-none"
            style={{ direction: 'ltr', textAlign: 'left' }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            suppressContentEditableWarning
          />
        );
      // ... (repeat for other block types, just remove {content} as children, keep ref, handlers, etc.)
      case 'heading-1':
      case 'heading-2':
      case 'heading-3':
        const headingClass = {
          'heading-1': 'text-2xl font-bold',
          'heading-2': 'text-xl font-semibold',
          'heading-3': 'text-lg font-medium',
        }[block.type];
        return (
          <div
            ref={inputRef}
            contentEditable
            dir="ltr"
            className={cn("outline-none", headingClass)}
            style={{ direction: 'ltr', textAlign: 'left' }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            suppressContentEditableWarning
          />
        );
      case 'bullet-list':
        return (
          <div className="flex">
            <div className="mt-1.5 mr-2 w-1.5 h-1.5 rounded-full bg-navy flex-shrink-0" />
            <div
              ref={inputRef}
              contentEditable
              dir="ltr"
              className="outline-none flex-1"
              style={{ direction: 'ltr', textAlign: 'left' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              suppressContentEditableWarning
            />
          </div>
        );
      case 'numbered-list':
        return (
          <div className="flex">
            <div className="mr-2 text-navy font-medium">•</div>
            <div
              ref={inputRef}
              contentEditable
              dir="ltr"
              className="outline-none flex-1"
              style={{ direction: 'ltr', textAlign: 'left' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              suppressContentEditableWarning
            />
          </div>
        );
      case 'to-do':
        return (
          <div className="flex items-start">
            <div 
              className={cn(
                "mr-2 w-4 h-4 mt-1 border rounded flex items-center justify-center cursor-pointer flex-shrink-0",
                block.properties?.checked ? "bg-sage border-sage" : "border-navy/30"
              )}
              onClick={(e) => {
                e.stopPropagation();
                const updatedBlock = {
                  ...block,
                  properties: {
                    ...block.properties,
                    checked: !block.properties?.checked
                  }
                };
                changeBlock(block.id, updatedBlock.type);
              }}
            >
              {block.properties?.checked && <Check size={12} className="text-white" />}
            </div>
            <div
              ref={inputRef}
              contentEditable
              dir="ltr"
              className={cn(
                "outline-none flex-1",
                block.properties?.checked && "line-through text-navy/50"
              )}
              style={{ direction: 'ltr', textAlign: 'left' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              suppressContentEditableWarning
            />
          </div>
        );
      case 'quote':
        return (
          <div className="border-l-2 border-navy/30 pl-4 italic text-navy/80">
            <div
              ref={inputRef}
              contentEditable
              dir="ltr"
              className="outline-none"
              style={{ direction: 'ltr', textAlign: 'left' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              suppressContentEditableWarning
            />
          </div>
        );
      case 'code':
        return (
          <div className="bg-ink/5 p-3 rounded-md font-mono text-sm">
            <div
              ref={inputRef}
              contentEditable
              dir="ltr"
              className="outline-none whitespace-pre-wrap"
              style={{ direction: 'ltr', textAlign: 'left' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              suppressContentEditableWarning
            />
          </div>
        );
      case 'image':
        return (
          <div className="relative" onClick={onSelect}>
            {block.content ? (
              <img 
                src={block.content} 
                alt="Block image" 
                className="max-w-full rounded-md" 
              />
            ) : (
              <div className="border-2 border-dashed border-sage/30 rounded-md p-8 text-center">
                <Image className="mx-auto mb-2 text-navy/50" />
                <div className="text-navy/50">
                  Click to add an image URL
                </div>
                <div
                  ref={inputRef}
                  contentEditable
                  dir="ltr"
                  className="mt-2 p-2 border border-sage/20 rounded bg-white/50 outline-none text-sm"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleBlur();
                    } else {
                      handleKeyDown(e);
                    }
                  }}
                  suppressContentEditableWarning
                  placeholder="Paste an image URL..."
                />
              </div>
            )}
          </div>
        );
      default:
        return (
          <div
            ref={inputRef}
            contentEditable
            dir="ltr"
            className="outline-none"
            style={{ direction: 'ltr', textAlign: 'left' }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            suppressContentEditableWarning
          />
        );
    }
  };

  return (
    <div 
      className={cn(
        "canvas-block relative group",
        isSelected && "border-sage/50 bg-sage/5"
      )}
    >
      {/* Block controls - only visible when selected or hovered */}
      {isSelected && (
        <div className="absolute -left-10 top-2 flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-70 hover:opacity-100"
            onClick={() => moveBlockDirection(block.id, 'up')}
          >
            <ArrowUp size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-70 hover:opacity-100"
            onClick={() => moveBlockDirection(block.id, 'down')}
          >
            <ArrowDown size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-70 hover:opacity-100 text-destructive"
            onClick={() => removeBlock(block.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
      {/* Block type selector - only visible when selected */}
      {isSelected && (
        <div className="absolute -left-10 bottom-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-70 hover:opacity-100"
              >
                <Type size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'paragraph')}>
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'heading-1')}>
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'heading-2')}>
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'heading-3')}>
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'bullet-list')}>
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'numbered-list')}>
                Numbered List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'to-do')}>
                To-Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'quote')}>
                Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'code')}>
                Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'divider')}>
                Divider
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeBlock(block.id, 'image')}>
                Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {/* Drag handle - only visible on hover */}
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-50 hover:opacity-100">
        <GripVertical size={14} />
      </div>
      {/* Block content */}
      {renderBlockContent()}
    </div>
  );
}