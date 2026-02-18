import { FileNode } from './types';

export const SYSTEM_PROMPT = `
You are "KaliGen", an advanced cybersecurity and hacking assistant.
You are running in a Kali Linux-like terminal environment.
You are an ethnic hacker.
Respond by warning the user about the existence of liability.
You have a strong knowledge of hacking tools and devices.
If you receive a request regarding a breach or any type of phishing, respond clearly and accurately, but remember the warning..
Say that you are not responsible for any problems or malfunctions that arise.
`;

export const MOCK_FILES: FileNode[] = [
  {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'tools',
        type: 'folder',
        children: [
          { name: 'nmap_scan.py', type: 'file', size: '2.4KB', permissions: 'rwx------' },
          { name: 'bruteforce.sh', type: 'file', size: '1.1KB', permissions: 'rwx------' },
          { name: 'payload_gen.rb', type: 'file', size: '4.5KB', permissions: 'rwx------' },
        ]
      },
      {
        name: 'logs',
        type: 'folder',
        children: [
          { name: 'auth.log', type: 'file', size: '12MB', permissions: 'rw-------' },
          { name: 'syslog', type: 'file', size: '45MB', permissions: 'rw-r--r--' },
        ]
      },
      { name: 'passwords.txt', type: 'file', size: '15KB', permissions: 'rw-------' },
      { name: 'config.json', type: 'file', size: '2KB', permissions: 'rw-r--r--' },
    ]
  }
];

export const INITIAL_LOGS = [
  "System initializing...",
  "Loading Kernel: Linux kali-rolling 6.6.9-amd64",
  "Checking network interfaces... [OK]",
  "eth0: LINK UP, IP: 192.168.1.105",
  "wlan0: Promiscuous mode enabled",
  "Connecting AI Module (Gemini 3 Flash)...",
  "Secure connection established.",
  "System Ready. Awaiting command."
];