// Interactive Particle Physics Demo
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, isPressed: false };
        this.animationId = null;
        
        this.resize();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupEventListeners() {
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', () => {
            this.mouse.isPressed = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.explode(e.clientX - rect.left, e.clientY - rect.top);
        });
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }
    
    createParticles() {
        this.particles = [];
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                life: 1,
                maxLife: 1,
                color: {
                    r: Math.random() * 100 + 155,
                    g: Math.random() * 100 + 155,
                    b: Math.random() * 100 + 155
                }
            });
        }
    }
    
    explode(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = Math.random() * 8 + 4;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                life: 1,
                maxLife: 1,
                color: {
                    r: 255,
                    g: Math.random() * 100 + 100,
                    b: Math.random() * 50
                },
                isExplosion: true
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100 && this.mouse.isPressed) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.5;
                particle.vy += (dy / distance) * force * 0.5;
            } else if (distance < 50) {
                const force = (50 - distance) / 50;
                particle.vx -= (dx / distance) * force * 0.3;
                particle.vy -= (dy / distance) * force * 0.3;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Add friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Boundary collision
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Life decay for explosion particles
            if (particle.isExplosion) {
                particle.life -= 0.02;
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const particle of this.particles) {
            const alpha = particle.life;
            this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw connections between nearby particles
        this.drawConnections();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    const alpha = (80 - distance) / 80 * 0.3;
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}