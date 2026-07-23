import React, { useEffect, useRef } from 'react';

const CanvasFireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Adjust canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle classes
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 2;
        this.friction = 0.95;
        this.gravity = 0.12;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Add subtle bloom glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
        this.distanceTraveled = 0;
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 12;
        this.acceleration = 1.03;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.brightness = Math.random() * 20 + 50;
        this.hue = Math.random() * 360;
      }

      update() {
        this.speed *= this.acceleration;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        
        this.x += this.vx;
        this.y += this.vy;

        this.distanceTraveled = Math.hypot(this.x - this.sx, this.y - this.sy);
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x - this.vx * 0.3, this.y - this.vy * 0.3);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.8)`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    let fireworks = [];
    let particles = [];

    // Helper to get random color
    const getRandomColor = () => {
      const colors = ['#d4af37', '#ff4500', '#dc143c', '#00ffcc', '#ff00ff', '#ffff00', '#00ffff'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create explosion particles
    const createExplosion = (x, y) => {
      const particleCount = 45;
      const color = getRandomColor();
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    // Click handler to launch firework
    const handleCanvasClick = (e) => {
      const sx = canvas.width / 2;
      const sy = canvas.height;
      const tx = e.clientX;
      const ty = e.clientY;
      fireworks.push(new Firework(sx, sy, tx, ty));
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Auto-spawning fireworks
    let autoLaunchTimer = 0;

    // Loop
    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);

      // Create trailing tail effect with transparent fill
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // Auto spawn
      autoLaunchTimer++;
      if (autoLaunchTimer > 80) { // Approx every 1.3 seconds
        const sx = Math.random() * canvas.width;
        const sy = canvas.height;
        const tx = Math.random() * canvas.width;
        const ty = Math.random() * (canvas.height * 0.5); // burst in top half
        fireworks.push(new Firework(sx, sy, tx, ty));
        autoLaunchTimer = 0;
      }

      // Update and draw fireworks
      fireworks = fireworks.filter((f) => {
        f.update();
        f.draw();
        if (f.distanceTraveled >= f.distanceToTarget) {
          createExplosion(f.tx, f.ty);
          return false; // remove
        }
        return true; // keep
      });

      // Update and draw particles
      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return p.alpha > 0;
      });
    };

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CanvasFireworks;
