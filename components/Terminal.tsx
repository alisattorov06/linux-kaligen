import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from '../types';
import { streamGeminiResponse } from '../services/geminiService';
import { Terminal as TerminalIcon, Send, Wifi, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TerminalProps {
  onCommand: (cmd: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onCommand }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 'init', content: "KaliGen OS v1.0.0 Initialized. Type 'help' for available commands.", type: 'system', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Focus input on click anywhere in terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim() && !isProcessing) {
      const cmd = input.trim();
      setInput('');
      setIsProcessing(true);

      // Add user command to history
      const userLine: TerminalLine = {
        id: Math.random().toString(36),
        content: `root@kaligen:~# ${cmd}`,
        type: 'input',
        timestamp: new Date().toLocaleTimeString()
      };
      setLines(prev => [...prev, userLine]);
      onCommand(cmd);

      // Simple local command handling vs AI
      const lowerCmd = cmd.toLowerCase();
      
      if (lowerCmd === 'clear') {
        setLines([]);
        setIsProcessing(false);
        return;
      }

      if (lowerCmd === 'help') {
        setTimeout(() => {
             setLines(prev => [...prev, {
                id: Math.random().toString(),
                content: `AVAILABLE COMMANDS:
----------------
help        : Show help menu
clear       : Clear terminal screen
scan <ip>   : Network scan simulation
whoami      : Current user info
ask <query> : Ask AI directly (Gemini)`,
                type: 'system',
                timestamp: new Date().toLocaleTimeString()
             }]);
             setIsProcessing(false);
        }, 500);
        return;
      }
      
      if (lowerCmd === 'whoami') {
         setTimeout(() => {
             setLines(prev => [...prev, {
                id: Math.random().toString(),
                content: `root`,
                type: 'output',
                timestamp: new Date().toLocaleTimeString()
             }]);
             setIsProcessing(false);
        }, 300);
        return;
      }

      if (lowerCmd.startsWith('scan ')) {
         const target = lowerCmd.replace('scan ', '');
         setLines(prev => [...prev, {
            id: Math.random().toString(),
            content: `Starting Nmap 7.94 scan on: ${target}...`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString()
         }]);
         
         setTimeout(() => {
             setLines(prev => [...prev, {
                id: Math.random().toString(),
                content: `[+] Port 80 (HTTP) - OPEN\n[+] Port 443 (HTTPS) - OPEN\n[+] Port 22 (SSH) - FILTERED\n[!] OS Detection: Linux Kernel 5.x`,
                type: 'output',
                timestamp: new Date().toLocaleTimeString()
             }]);
             setIsProcessing(false);
         }, 2000);
         return;
      }

      // Default to AI for everything else or specific 'ask' command
      let aiPrompt = cmd;
      if (lowerCmd.startsWith('ask ')) {
        aiPrompt = cmd.slice(4);
      }

      // Stream AI Response
      let currentAiId = Math.random().toString();
      let aiResponseText = "";
      
      // Initialize AI line
      setLines(prev => [...prev, {
          id: currentAiId,
          content: "...",
          type: 'ai',
          timestamp: new Date().toLocaleTimeString()
      }]);

      await streamGeminiResponse(aiPrompt, (chunk) => {
         aiResponseText += chunk;
         setLines(prev => prev.map(line => 
            line.id === currentAiId 
            ? { ...line, content: aiResponseText } 
            : line
         ));
      });
      
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-black/80 border border-green-500/30 rounded shadow-[0_0_15px_rgba(0,255,0,0.2)] font-mono text-sm overflow-hidden backdrop-blur-sm"
      onClick={handleContainerClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-green-900/20 border-b border-green-500/30 select-none shrink-0">
        <div className="flex items-center gap-2 text-green-400">
          <TerminalIcon size={16} />
          <span className="font-bold tracking-wider">root@kaligen:~</span>
        </div>
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 min-h-0">
        {lines.map((line) => (
          <div key={line.id} className={`${
            line.type === 'input' ? 'text-white' : 
            line.type === 'error' ? 'text-red-500' :
            line.type === 'system' ? 'text-blue-400' :
            line.type === 'ai' ? 'text-green-300' : 'text-green-500'
          } break-words whitespace-pre-wrap leading-relaxed`}>
            <div className="flex gap-2">
                <span className="opacity-50 text-xs mt-[3px] select-none">[{line.timestamp}]</span>
                <span className="mt-[1px] select-none">{line.type === 'input' ? '' : line.type === 'ai' ? '>> ' : '> '}</span>
                <div className="flex-1 min-w-0">
                    {line.type === 'ai' ? (
                        <div className="markdown-content">
                            <ReactMarkdown>{line.content}</ReactMarkdown>
                        </div>
                    ) : (
                        line.content
                    )}
                </div>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="text-green-500 animate-pulse flex gap-2">
              <span></span>
              <span>Processing payload...</span>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 flex items-center gap-2 border-t border-green-500/30 shrink-0">
        <span className="text-green-500 font-bold animate-pulse">➜</span>
        <span className="text-blue-400 font-bold">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-green-800"
          placeholder="Enter command (e.g., help, scan, ask...)"
          disabled={isProcessing}
        />
        {isProcessing ? <Wifi className="animate-pulse text-green-500" size={18} /> : <Send size={18} className="text-green-700" />}
      </div>
    </div>
  );
};

export default Terminal;