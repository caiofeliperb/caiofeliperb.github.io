import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useData } from '../../hooks/useData';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { data, loading } = useData();

    useEffect(() => {
        if (loading || !data.length) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // We have 468 egressos
        const numParticles = data.length;

        // Abstract representation of RN (simplified elephant shape points roughly mapped to 0-1 range)
        // For a real implementation, we'd use D3 GeoAlbers with TopoJSON. Here we generate an organic cluster.
        const rnShapeCenter = { x: width / 2, y: height / 2 };

        // Create particles
        const particles = Array.from({ length: numParticles }, (_, i) => {
            // Random starting positions (scattered)
            const startX = Math.random() * width;
            const startY = Math.random() * height;

            // Target position: forming a rough shape in the center (representing RN)
            // Here we create a clustered ellipse just as a fallback if no path is given
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (Math.min(width, height) * 0.25);
            const targetX = rnShapeCenter.x + Math.cos(angle) * radius * 1.5; // Wider
            const targetY = rnShapeCenter.y + Math.sin(angle) * radius * 0.8; // Shorter

            return {
                x: startX,
                y: startY,
                startX,
                startY,
                targetX,
                targetY,
                size: Math.random() * 2 + 1.5,
                color: i % 3 === 0 ? '#38BDF8' : (i % 5 === 0 ? '#F59E0B' : '#0EA5E9'), // Theme colors
                alpha: Math.random() * 0.5 + 0.3,
                progress: 0 // Progress from 0 (start) to 1 (target)
            };
        });

        let animationFrameId;

        const drawParticles = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                // Interpolate position based on progress
                const currentX = p.startX + (p.targetX - p.startX) * p.progress;
                const currentY = p.startY + (p.targetY - p.startY) * p.progress;

                ctx.beginPath();
                ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();

                // Add a subtle glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
            });
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        drawParticles();

        // GSAP ScrollTrigger to animate progress
        const proxy = { progress: 0 };

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top", // The animation happens over 1 viewport height
            scrub: 1, // Smooth scrubbing
            onUpdate: (self) => {
                // Easing function for smoother gathering
                const easeProgress = gsap.parseEase("power2.inOut")(self.progress);

                particles.forEach(p => {
                    // Add some individual variance to progress feeling organic
                    const individualProgress = Math.min(1, Math.max(0, easeProgress * 1.2 - (p.size * 0.05)));
                    p.progress = individualProgress;
                });
            }
        });

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            const newCenter = { x: width / 2, y: height / 2 };
            particles.forEach(p => {
                // Recalculate target position based on new center
                const angle = Math.atan2(p.targetY - rnShapeCenter.y, p.targetX - rnShapeCenter.x);
                const dist = Math.hypot(p.targetX - rnShapeCenter.x, p.targetY - rnShapeCenter.y);
                p.targetX = newCenter.x + Math.cos(angle) * dist;
                p.targetY = newCenter.y + Math.sin(angle) * dist;
            });

            rnShapeCenter.x = newCenter.x;
            rnShapeCenter.y = newCenter.y;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [data, loading]);

    return (
        <section className="hero-section" ref={containerRef}>
            <canvas ref={canvasRef} className="hero-canvas" />

            <div className="hero-content container">
                <h1 className="hero-title text-gradient">
                    A Jornada dos Nossos Médicos:<br />Onde Estão e o Que Fazem?
                </h1>
                <p className="hero-subtitle">
                    Bem-vindo aos bastidores da nossa história! Qual o impacto real do curso de medicina da UERN? Mapeamos 468 egressos formados entre 2010 e 2024 para descobrir o impacto das nossas raízes na saúde.
                </p>

                <div className="hero-metrics glass-panel">
                    <div className="metric">
                        <span className="metric-value">468</span>
                        <span className="metric-label">Formados</span>
                    </div>
                    <div className="metric-divider"></div>
                    <div className="metric">
                        <span className="metric-value">544</span>
                        <span className="metric-label">CRMs Ativos</span>
                    </div>
                    <div className="metric-divider"></div>
                    <div className="metric">
                        <span className="metric-value">194</span>
                        <span className="metric-label">Histórias Ouvidas</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
