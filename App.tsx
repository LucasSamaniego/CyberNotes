import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Note } from './types';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('cybernotes_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('cybernotes_data', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("PURGING DATA NODE. CONFIRM?");
    if (confirmed) {
      setNotes(notes.filter((n) => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Mobile Menu Toggle could go here, for now Sidebar is responsive via CSS width */}
      
      <Sidebar
        notes={filteredNotes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex-1 h-full relative">
        {activeNote ? (
          <Editor note={activeNote} onUpdate={updateNote} />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-10" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)' 
                 }}>
            </div>

            <div className="z-10 text-center space-y-6 max-w-md px-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                <Terminal className="w-24 h-24 text-cyan-400 relative z-10 mx-auto" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold font-rajdhani text-white tracking-widest">
                CYBER<span className="text-cyan-400">NOTES</span>
              </h1>
              
              <p className="text-slate-500 font-mono text-sm md:text-base border-l-2 border-cyan-500/50 pl-4 text-left">
                &gt; SYSTEM READY <br/>
                &gt; NEURAL LINK ESTABLISHED <br/>
                &gt; SELECT A DATA NODE TO BEGIN
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
