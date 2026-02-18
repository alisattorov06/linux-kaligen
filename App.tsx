import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import SystemMonitor from './components/SystemMonitor';
import WireframeGlobe from './components/WireframeGlobe';
import FileExplorer from './components/FileExplorer';
import MatrixRain from './components/MatrixRain';
import { Shield, Activity, Globe, Terminal as TerminalIcon, AlertTriangle, Power } from 'lucide-react';
import { LogType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'terminal' | 'network'>('dashboard');
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to simulate random background system logs
  useEffect(() => {
    if (!isInitialized) return;

    const logInterval = setInterval(() => {
        const msgs = [
            "[KERNEL] System integrity check: STABLE",
            "[FIREWALL] Blocked IP 192.168.1.45 (Port Scan)",
            "[AUTH] Verifying Root Permissions...",
            "[NET] Packets received: 4503",
            "[AI] Gemini Model State: READY",
            "[IDS] Intrusion Detection System: Active",
            "[WIFI] Handshake captured: wlan0"
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const timestamp = new Date().toLocaleTimeString();
        setSystemLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 10)]);
    }, 4000);
    return () => clearInterval(logInterval);
  }, [isInitialized]);

  const handleInitialize = () => {
      // Request full screen
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(err => {
              console.log("Full screen request denied or failed", err);
          });
      }
      setIsInitialized(true);
  };

  if (!isInitialized) {
      return (
          <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-green-500">
              <MatrixRain />
              <div className="z-10 flex flex-col items-center gap-6 p-10 border border-green-500/50 bg-black/80 backdrop-blur rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.3)]">
                  <Shield size={64} className="animate-pulse" />
                  <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-center neon-text" style={{ fontFamily: 'Orbitron' }}>
                      KALIGEN OS
                  </h1>
                  <p className="text-sm md:text-base opacity-70 tracking-widest">
                      SECURE TERMINAL ENVIRONMENT
                  </p>
                  <button 
                    onClick={handleInitialize}
                    className="group relative px-8 py-3 bg-green-900/20 hover:bg-green-500/20 border border-green-500 text-green-400 hover:text-white transition-all duration-300 font-bold tracking-widest flex items-center gap-2 mt-8"
                  >
                      <Power size={20} className="group-hover:animate-spin" />
                      INITIALIZE SYSTEM
                  </button>
              </div>
              <div className="absolute bottom-10 text-xs opacity-50 animate-pulse">
                  PRESS BUTTON TO MOUNT ROOT FILESYSTEM
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen w-full text-green-500 font-mono relative flex flex-col overflow-hidden bg-black">
      <MatrixRain />
      
      {/* Top Navbar */}
      <header className="h-12 bg-black/90 border-b border-green-500/50 flex items-center justify-between px-4 z-20 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
            <Shield className="text-green-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-[0.2em] neon-text" style={{ fontFamily: 'Orbitron' }}>
                KALIGEN <span className="text-xs align-top opacity-70">AI TERMINAL</span>
            </h1>
        </div>
        <div className="flex items-center gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span>ONLINE</span>
            </div>
            <div className="opacity-70">IP: 10.0.0.12 (VPN)</div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-2 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 z-10 overflow-hidden min-h-0">
        
        {/* Left Column: Sidebar / Status (Visible on Desktop) */}
        <div className="hidden md:flex md:col-span-3 flex-col gap-4 h-full overflow-hidden">
            {/* 3D Globe Visualization */}
            <div className="flex-1 bg-black/60 border border-green-500/30 rounded relative min-h-[200px]">
                <div className="absolute top-2 left-2 z-10 text-xs font-bold bg-black/80 px-2 py-1 rounded border border-green-900">
                    <Globe size={12} className="inline mr-1"/> GLOBAL THREAT MAP
                </div>
                <WireframeGlobe />
                <div className="absolute bottom-2 left-2 right-2 text-[10px] text-center opacity-60">
                    Scanning global nodes...
                </div>
            </div>

            {/* System Stats */}
            <div className="h-1/3">
                <SystemMonitor />
            </div>
        </div>

        {/* Center/Main Column: Terminal */}
        <div className="col-span-1 md:col-span-6 h-full flex flex-col min-h-0">
            <div className="flex-1 relative h-full">
                <Terminal onCommand={(cmd) => {
                    // Optional: Hook global effects to specific commands here
                    if(cmd.includes('scan')) {
                        // Trigger visual effect in future
                    }
                }} />
            </div>
        </div>

        {/* Right Column: Files & Logs */}
        <div className="hidden md:flex md:col-span-3 flex-col gap-4 h-full overflow-hidden">
             {/* File Explorer */}
             <div className="flex-1 min-h-0">
                <FileExplorer />
             </div>

             {/* System Log Feed */}
             <div className="h-1/3 bg-black/80 border border-green-500/30 rounded p-2 overflow-hidden flex flex-col">
                <h3 className="text-xs text-red-400 mb-2 font-bold uppercase tracking-widest border-b border-red-900/30 pb-1 flex items-center gap-2">
                    <AlertTriangle size={12} /> System Events
                </h3>
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto space-y-1">
                        {systemLogs.map((log, i) => (
                            <div key={i} className="text-[10px] md:text-xs truncate opacity-80 border-l-2 border-green-900 pl-2 hover:bg-green-900/20">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </div>
      </main>

      {/* Mobile Navigation Footer (Only visible on small screens) */}
      <footer className="md:hidden h-14 bg-black border-t border-green-500/30 flex justify-around items-center z-50 shrink-0">
          <button className="flex flex-col items-center gap-1 text-green-500 active:scale-95">
              <TerminalIcon size={20} />
              <span className="text-[10px]">Term</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-green-700 active:scale-95">
              <Activity size={20} />
              <span className="text-[10px]">Stats</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-green-700 active:scale-95">
              <Shield size={20} />
              <span className="text-[10px]">Files</span>
          </button>
      </footer>
    </div>
  );
};

export default App;