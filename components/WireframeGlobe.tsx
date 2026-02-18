import React, { useEffect, useRef } from 'react';

const WireframeGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    const ROTATION_SPEED = 0.005;

    // Generate normalized points on sphere (radius 1)
    const normalizedPoints: {x: number, y: number, z: number}[] = [];
    const numPoints = 400;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); // Radius at y
        const theta = phi * i; 
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        normalizedPoints.push({ x, y, z });
    }

    const render = () => {
      // Get current dimensions directly from the canvas client size
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      // Ensure internal resolution matches display size
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);
      rotation += ROTATION_SPEED;

      // Calculate Globe Radius based on current size (Responsive)
      // Use the smaller dimension to keep it a perfect circle
      const globeRadius = Math.min(width, height) * 0.4;
      
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#00ff00';
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';

      // Sort and Draw
      const rotatedPoints = normalizedPoints.map(p => {
        // Rotate around Y axis
        const x = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const z = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
        
        // Scale to actual radius
        return { 
            x: x * globeRadius, 
            y: p.y * globeRadius, 
            z: z * globeRadius 
        };
      });

      ctx.beginPath();
      for (let i = 0; i < rotatedPoints.length; i++) {
         const p1 = rotatedPoints[i];
         // Don't draw back-facing lines for cleaner look
         if (p1.z < 0) ctx.globalAlpha = 0.2;
         else ctx.globalAlpha = 0.8;

         // Connections
         if (i % 10 === 0) {
             const p2 = rotatedPoints[(i + 5) % rotatedPoints.length];
             ctx.moveTo(p1.x + cx, p1.y + cy);
             ctx.lineTo(p2.x + cx, p2.y + cy);
         }
      }
      ctx.stroke();

      // Draw Dots
      rotatedPoints.forEach(p => {
        const scale = (p.z + globeRadius * 2) / (globeRadius * 3);
        const alpha = (p.z + globeRadius) / (globeRadius * 2);
        
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.beginPath();
        ctx.arc(p.x + cx, p.y + cy, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default WireframeGlobe;