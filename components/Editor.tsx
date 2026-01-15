import React, { useState, useEffect } from 'react';
import { Sparkles, Save, BrainCircuit, Mic } from 'lucide-react';
import { Note, AIActionType } from '../types';
import { Button } from './Button';
import { processNoteWithAI } from '../services/geminiService';

interface EditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const handleSave = () => {
    onUpdate({
      ...note,
      title,
      content,
      updatedAt: Date.now()
    });
  };

  // Auto-save debounce effect could go here, but manual for now for simplicity + explicit save button feeling better in "cyber" context
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if (title !== note.title || content !== note.content) {
            onUpdate({ ...note, title, content, updatedAt: Date.now() });
        }
    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);


  const handleAIAction = async (action: AIActionType) => {
    if (!content.trim()) return;
    
    setIsProcessing(true);
    const result = await processNoteWithAI(content, action);
    
    if (action === AIActionType.SUMMARIZE) {
        // For summarize, maybe append or just show. Let's append for now.
        setContent(prev => `${prev}\n\n--- AI SUMMARY ---\n${result}`);
    } else {
        setContent(result);
    }
    
    setIsProcessing(false);
    setAiPanelOpen(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Background Grid FX */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

      {/* Toolbar */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-cyan-900/50 bg-slate-950/90 backdrop-blur-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ENTER NODE TITLE..."
          className="bg-transparent text-3xl font-bold font-rajdhani text-cyan-100 placeholder-cyan-900/50 focus:outline-none w-full mr-4 uppercase tracking-wide"
        />
        
        <div className="flex items-center gap-2">
           <Button 
            variant="secondary" 
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            icon={<BrainCircuit className={isProcessing ? "animate-spin" : ""} />}
            disabled={isProcessing}
          >
            {isProcessing ? 'PROCESSING...' : 'AI LINK'}
          </Button>
          <Button onClick={handleSave} icon={<Save />} className="hidden md:flex">
            SAVE
          </Button>
        </div>
      </div>

      {/* AI Panel Overlay */}
      {aiPanelOpen && (
        <div className="relative z-20 bg-slate-900/95 border-b border-purple-500/50 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-lg shadow-purple-500/10 animate-in slide-in-from-top-4 duration-300">
           <Button variant="ghost" onClick={() => handleAIAction(AIActionType.FIX_GRAMMAR)} className="border border-slate-700 hover:border-cyan-500">
             <Sparkles className="w-4 h-4 mr-2" /> DEBUG GRAMMAR
           </Button>
           <Button variant="ghost" onClick={() => handleAIAction(AIActionType.EXPAND)} className="border border-slate-700 hover:border-cyan-500">
             <Sparkles className="w-4 h-4 mr-2" /> EXPAND DATA
           </Button>
           <Button variant="ghost" onClick={() => handleAIAction(AIActionType.SUMMARIZE)} className="border border-slate-700 hover:border-cyan-500">
             <Sparkles className="w-4 h-4 mr-2" /> COMPRESS (SUMMARIZE)
           </Button>
           <Button variant="ghost" onClick={() => handleAIAction(AIActionType.CYBERPUNK_STYLE)} className="border border-slate-700 hover:border-purple-500 text-purple-300">
             <Sparkles className="w-4 h-4 mr-2" /> CYBERPUNK MODE
           </Button>
        </div>
      )}

      {/* Editor Area */}
      <div className="relative z-10 flex-1 p-6 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Initialize data stream..."
          className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-300 font-mono text-lg leading-relaxed placeholder-slate-700 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent"
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="relative z-10 bg-slate-900 border-t border-cyan-900/50 px-4 py-1 flex justify-between items-center text-xs font-mono text-cyan-600/70">
         <span>Ln {content.split('\n').length}, Col {content.length}</span>
         <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${title && content ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-yellow-500'} animate-pulse`}></span>
            {title && content ? 'SYSTEM STABLE' : 'WAITING FOR INPUT'}
         </span>
      </div>
    </div>
  );
};
