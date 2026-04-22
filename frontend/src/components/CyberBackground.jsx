import { useEffect, useRef } from 'react';
import useTheme from '../context/ThemeContext';

const CyberBackground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    let frame = 0;

    // ----- DARK MODE: Matrix Rain + Hex + Nodes -----
    // Matrix Rain
    const COL_W = 18;
    let COLS = Math.floor(W / COL_W) + 1;
    let drops = [];
    let speeds = [];
    for (let i = 0; i < COLS; i++) {
      drops[i] = Math.random() * -100;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    const CHARS = '01アイウエオカキクケコサシスセソタチツテト∑∏Ω≡≠∞';

    // Network Nodes
    const NODE_COUNT = 28;
    let nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    const LINK_DIST = 220;

    // Hex Grid
    const HEX_R = 44;
    const hexPath = (cx, cy, r) => {
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        let a = (Math.PI / 3) * s - Math.PI / 6;
        let px = cx + r * Math.cos(a);
        let py = cy + r * Math.sin(a);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let scanPhase = 0;
    const SCAN_SPEED = 0.5;

    // ----- LIGHT MODE: 3D Particle Wave -----
    const WAVE_POINTS = 200;
    let wavePoints = [];
    for (let i = 0; i < WAVE_POINTS; i++) {
      wavePoints.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 1000,
        vy: -0.5 - Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02
      });
    }
    
    // Light mode 3D connected grid
    const GRID_SIZE = 12;
    const SPACING = W / (GRID_SIZE - 1);
    let gridNodes = [];
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE; c++) {
        gridNodes.push({
          x: c * SPACING,
          y: r * SPACING,
          ox: c * SPACING,
          oy: r * SPACING,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    const draw = () => {
      frame++;

      if (isDark) {
        // --- DARK MODE LOGIC ---
        ctx.fillStyle = 'rgba(5, 5, 9, 0.16)';
        ctx.fillRect(0, 0, W, H);

        if (frame % 4 === 0) {
          ctx.strokeStyle = 'rgba(79, 70, 229, 0.04)';
          ctx.lineWidth = 0.5;
          let rowH = HEX_R * Math.sqrt(3);
          let colW = HEX_R * 1.5;
          for (let row = -1; row < H / rowH + 2; row++) {
            for (let col = -1; col < W / colW + 2; col++) {
              let cx = col * colW;
              let cy = row * rowH + ((col % 2 === 0) ? 0 : rowH * 0.5);
              hexPath(cx, cy, HEX_R - 2);
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          let n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;
          n.phase += 0.035;

          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;

          for (let j = i + 1; j < nodes.length; j++) {
            let m = nodes[j];
            let dx = n.x - m.x;
            let dy = n.y - m.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < LINK_DIST) {
              let alpha = (1 - dist / LINK_DIST) * 0.18;
              ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();
            }
          }

          let pulseR = n.r + Math.sin(n.phase) * 0.7;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(99, 102, 241, ' + (0.35 + Math.sin(n.phase) * 0.15) + ')';
          ctx.fill();
        }

        ctx.font = (COL_W - 4) + 'px "JetBrains Mono", monospace';
        for (let i = 0; i < COLS; i++) {
          let yPos = drops[i] * COL_W;
          if (yPos > 0 && yPos < H) {
            let ch = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillStyle = 'rgba(129, 140, 248, 0.9)';
            ctx.fillText(ch, i * COL_W, yPos);
            if (yPos > COL_W) {
              ctx.fillStyle = 'rgba(79, 70, 229, 0.30)';
              ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * COL_W, yPos - COL_W);
            }
            if (yPos > COL_W * 2) {
              ctx.fillStyle = 'rgba(79, 70, 229, 0.12)';
              ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * COL_W, yPos - COL_W * 2);
            }
          }
          drops[i] += speeds[i];
          if (drops[i] * COL_W > H && Math.random() > 0.975) {
            drops[i] = -Math.floor(Math.random() * 40);
          }
        }

        scanPhase += SCAN_SPEED;
        if (scanPhase > H + 40) scanPhase = -40;
        let scanGrad = ctx.createLinearGradient(0, scanPhase - 12, 0, scanPhase + 12);
        scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        scanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
        scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanPhase - 12, W, 24);

      } else {
        // --- LIGHT MODE LOGIC ---
        // Clean white background fade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, W, H);

        // Render connected interactive wave mesh
        const time = frame * 0.01;
        
        // Draw light node grid with organic movement
        for (let i = 0; i < gridNodes.length; i++) {
          let n = gridNodes[i];
          n.phase += 0.02;
          
          // Organic drifting around origin
          n.x = n.ox + Math.sin(time + n.phase) * 30;
          n.y = n.oy + Math.cos(time * 0.8 + n.phase) * 30;

          // Connect to nearby nodes in the grid
          for (let j = i + 1; j < gridNodes.length; j++) {
            let m = gridNodes[j];
            let dx = n.x - m.x;
            let dy = n.y - m.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < SPACING * 1.5) {
              let alpha = (1 - dist / (SPACING * 1.5)) * 0.25;
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();
            }
          }
          
          // Draw subtle glowing point
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2 + Math.sin(n.phase)*1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79, 70, 229, ${0.4 + Math.sin(n.phase)*0.2})`;
          ctx.fill();
        }

        // Draw ascending 3D floating particles (like data fragments)
        for (let i = 0; i < wavePoints.length; i++) {
          let p = wavePoints[i];
          p.y += p.vy;
          p.phase += p.speed;
          p.x += Math.sin(p.phase) * 0.5;

          if (p.y < -50) {
            p.y = H + 50;
            p.x = Math.random() * W;
          }

          // Pseudo 3D size and opacity
          let scale = 1000 / (1000 + p.z);
          let r = 3 * scale + Math.sin(p.phase) * scale;
          let alpha = 0.6 * scale;
          
          // Color varies slightly based on depth
          let color = p.z > 500 ? `rgba(6, 182, 212, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;

      // Reset dark mode
      COLS = Math.floor(W / COL_W) + 1;
      drops = [];
      speeds = [];
      for (let ri = 0; ri < COLS; ri++) {
        drops[ri] = Math.random() * -80;
        speeds[ri] = 0.3 + Math.random() * 0.7;
      }
      for (let ni = 0; ni < nodes.length; ni++) {
        nodes[ni].x = Math.random() * W;
        nodes[ni].y = Math.random() * H;
      }
      
      // Reset light mode grid
      gridNodes = [];
      for(let r=0; r<GRID_SIZE; r++) {
        for(let c=0; c<GRID_SIZE; c++) {
          gridNodes.push({
            x: c * (W / (GRID_SIZE - 1)),
            y: r * (H / (GRID_SIZE - 1)),
            ox: c * (W / (GRID_SIZE - 1)),
            oy: r * (H / (GRID_SIZE - 1)),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [isDark]); // Re-initialize completely if theme changes to handle background clear properly

  return (
    <canvas
      ref={canvasRef}
      className="cyber-bg-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isDark ? 0.5 : 1, // Full opacity in light mode!
      }}
    />
  );
};

export default CyberBackground;
