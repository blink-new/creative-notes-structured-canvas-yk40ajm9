import { useState, useEffect } from 'react';
import { NotesProvider } from '@/contexts/NotesContext';
import { Sidebar } from '@/components/Sidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { StructurePanel } from '@/components/StructurePanel';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [structurePanelCollapsed, setStructurePanelCollapsed] = useState(true);
  
  // Initial load animation
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-heading font-bold text-ink">
            Creative Notes
            <span className="ml-1 text-coral animate-pulse">.</span>
          </div>
          <div className="mt-2 text-navy/60">
            Loading your structured canvas...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <NotesProvider>
      <div className="flex h-screen overflow-hidden bg-paper">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <NoteEditor />
        </div>
        
        {/* Structure Panel */}
        <StructurePanel 
          collapsed={structurePanelCollapsed} 
          onToggle={() => setStructurePanelCollapsed(!structurePanelCollapsed)} 
        />
      </div>
    </NotesProvider>
  );
}

export default App;