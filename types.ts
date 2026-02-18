export enum LogType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  SYSTEM = 'SYSTEM'
}

export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'system' | 'ai' | 'error';
  timestamp: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: string;
  permissions?: string;
}

export interface NetworkPacket {
  id: number;
  source: string;
  dest: string;
  protocol: string;
  status: string;
}