import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SystemMonitor: React.FC = () => {
  const [data, setData] = useState<{time: string, cpu: number, ram: number, net: number}[]>([]);

  useEffect(() => {
    // Fill initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
        time: i.toString(),
        cpu: Math.floor(Math.random() * 30),
        ram: Math.floor(Math.random() * 40) + 20,
        net: Math.floor(Math.random() * 100)
    }));
    setData(initialData);

    const interval = setInterval(() => {
        setData(prev => {
            const newData = [...prev.slice(1)];
            newData.push({
                time: new Date().getSeconds().toString(),
                cpu: Math.floor(Math.random() * (90 - 10) + 10),
                ram: Math.floor(Math.random() * (80 - 40) + 40),
                net: Math.floor(Math.random() * 500)
            });
            return newData;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-rows-2 gap-4 h-full">
        {/* CPU/RAM Chart */}
        <div className="bg-black/80 border border-green-500/30 p-2 rounded relative overflow-hidden">
             <h3 className="text-xs text-green-400 mb-2 font-bold uppercase tracking-widest border-b border-green-900 pb-1 flex justify-between">
                <span>CPU / RAM Usage</span>
                <span className="text-red-500 animate-pulse">LIVE</span>
             </h3>
             <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #0f0', color: '#0f0' }} 
                        itemStyle={{ color: '#0f0' }}
                    />
                    <Area type="monotone" dataKey="cpu" stroke="#8884d8" fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="ram" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRam)" />
                </AreaChart>
             </ResponsiveContainer>
        </div>

        {/* Network Traffic */}
        <div className="bg-black/80 border border-green-500/30 p-2 rounded relative">
             <h3 className="text-xs text-green-400 mb-2 font-bold uppercase tracking-widest border-b border-green-900 pb-1">
                Network Packets (eth0)
             </h3>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <Bar dataKey="net" fill="#00ff00" />
                </BarChart>
             </ResponsiveContainer>
             <div className="absolute top-2 right-2 text-[10px] text-green-600">
                TX: {data[data.length-1]?.net} KB/s
             </div>
        </div>
    </div>
  );
};

export default SystemMonitor;