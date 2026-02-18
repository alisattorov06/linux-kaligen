import React, { useState } from 'react';
import { MOCK_FILES } from '../constants';
import { FileNode } from '../types';
import { Folder, FileText, Lock, ChevronRight, ChevronDown } from 'lucide-react';

const FileItem: React.FC<{ node: FileNode, level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1 hover:bg-green-900/30 cursor-pointer text-sm ${level === 0 ? 'text-green-400 font-bold' : 'text-green-600'}`}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <span className="opacity-70">
            {isFolder ? (isOpen ? <ChevronDown size={12}/> : <ChevronRight size={12}/>) : <div className="w-3" />}
        </span>
        {isFolder ? <Folder size={14} /> : <FileText size={14} />}
        <span>{node.name}</span>
        {node.permissions && <span className="text-[10px] ml-auto mr-2 opacity-50 font-mono">{node.permissions}</span>}
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileItem key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC = () => {
  return (
    <div className="h-full bg-black/80 border border-green-500/30 rounded p-2 overflow-y-auto font-mono">
      <h3 className="text-xs text-green-400 mb-2 font-bold uppercase tracking-widest border-b border-green-900 pb-1 flex items-center gap-2">
         <Lock size={12} /> File System (Root)
      </h3>
      {MOCK_FILES.map((file, idx) => (
        <FileItem key={idx} node={file} level={0} />
      ))}
    </div>
  );
};

export default FileExplorer;