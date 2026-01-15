import React from 'react';
import { Plus, Search, Terminal, Trash2, Cpu } from 'lucide-react';
import { Note } from '../types';
import { Button } from './Button';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="w-full md:w-80 h-full border-r border-cyan-900/50 bg-slate-950/80 backdrop-blur-md flex flex-col relative z-10">
      {/* Header */}
      <div className="p-4 border-b border-cyan-900/50">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold font-rajdhani text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest">
            CYBER<span className="text-white">NOTES</span>
          </h1>
        </div>
        
        <Button onClick={onCreateNote} className="w-full mb-4" icon={<Plus />}>
          New Data Node
        </Button>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-700 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="SCAN DATABASE..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900/50 border border-cyan-900/50 text-cyan-100 pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] font-rajdhani placeholder-cyan-900"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-slate-900">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-cyan-900/50 font-rajdhani">
            <Terminal className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>NO DATA FOUND</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`
                  group p-4 border-b border-cyan-900/30 cursor-pointer transition-all duration-200
                  hover:bg-cyan-900/20
                  ${activeNoteId === note.id ? 'bg-cyan-900/30 border-l-4 border-l-cyan-400' : 'border-l-4 border-l-transparent'}
                `}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-rajdhani font-semibold truncate pr-2 ${activeNoteId === note.id ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-200'}`}>
                    {note.title || 'UNTITLED DATA'}
                  </h3>
                  <button
                    onClick={(e) => onDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                  {new Date(note.updatedAt).toLocaleDateString()} // {new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2 group-hover:text-slate-500 transition-colors font-sans">
                  {note.content || 'Empty data node...'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Stats */}
      <div className="p-2 border-t border-cyan-900/50 text-[10px] text-cyan-900/80 font-mono flex justify-between uppercase">
        <span>Mem: {notes.length} Nodes</span>
        <span>Sys: Online</span>
      </div>
    </div>
  );
};
