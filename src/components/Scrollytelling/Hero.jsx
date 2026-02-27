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

        // Soft blue tones requested: variations of Cyan/Azure light
        const particleColors = ['#009FDF', '#33B2E5', '#66C2FF', '#99D6FF', '#B3E0FF'];

        // Creates an accurate Path representing the RN Map silhouette
        const getRNMapPoints = (count, w, h) => {
            const points = [];

            // Detailed polygon approximating the RN exact map (Elephant shape)
            const offPath = new Path2D("M 15 75 L 10 80 L 25 85 L 35 80 L 45 90 L 50 100 L 60 95 L 70 95 L 75 105 L 85 100 L 95 90 L 110 85 L 115 75 L 125 55 L 115 40 L 105 25 L 90 20 L 70 20 L 55 25 L 40 30 L 30 40 L 25 55 L 15 65 Z");

            const tempCanvas = document.createElement('canvas');
            const tCtx = tempCanvas.getContext('2d');
            // Do not translate or scale tCtx so isPointInPath evaluates against the raw 0-140 coordinates.

            const scale = Math.min(w, h) * 0.0055; // Slightly larger for clarity
            const offsetX = w / 2 - 70 * scale;
            const offsetY = h / 2 - 60 * scale;

            let attempts = 0;
            // Strict rejection sampling
            while (points.length < count && attempts < count * 300) {
                const px = Math.random() * 140;
                const py = Math.random() * 120;

                // Test point against raw path
                if (tCtx.isPointInPath(offPath, px, py)) {
                    // Pre-scale and translate ONLY the injected points to position the elephant correctly
                    points.push({
                        x: offsetX + (px * scale),
                        y: offsetY + (py * scale)
                    });
                }
                attempts++;
            }

            while (points.length < count) {
                points.push({ x: w / 2 + (Math.random() - 0.5) * 200, y: h / 2 + (Math.random() - 0.5) * 200 });
            }
            return points;
        };

        const targetPoints = getRNMapPoints(numParticles, width, height);

        const particles = Array.from({ length: numParticles }, (_, i) => {
            const startX = Math.random() * width;
            const startY = Math.random() * height;

            return {
                x: startX,
                y: startY,
                startX,
                startY,
                targetX: targetPoints[i].x,
                targetY: targetPoints[i].y,
                size: Math.random() * 1.5 + 1.2,
                color: particleColors[i % particleColors.length],
                alpha: Math.random() * 0.6 + 0.4,
                // For organic infinite floating - VERY calm and slow
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                speedX: Math.random() * 0.0008 + 0.0002,
                speedY: Math.random() * 0.0008 + 0.0002,
                targetProgress: 0,
                currentProgress: 0
            };
        });

        let animationFrameId;
        let isVisible = true;

        const drawParticles = (time) => {
            if (!isVisible) return; // Performance Optimization: Stop drawing if offscreen

            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                // Smooth interpolation for scroll (slower transition)
                p.currentProgress += (p.targetProgress - p.currentProgress) * 0.015;

                // Infinite organic floating (Sine wave based on time)
                const floatX = Math.sin(time * p.speedX + p.phaseX) * 15 * (1 - p.currentProgress * 0.5);
                const floatY = Math.cos(time * p.speedY + p.phaseY) * 15 * (1 - p.currentProgress * 0.5);

                const currentX = p.startX + (p.targetX - p.startX) * p.currentProgress + floatX;
                const currentY = p.startY + (p.targetY - p.startY) * p.currentProgress + floatY;

                ctx.beginPath();
                ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();

                // Bright glowing effect for Cyan/Gold/White
                ctx.shadowBlur = p.color === '#FFFFFF' ? 8 : 12;
                ctx.shadowColor = p.color;
            });
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId) {
                animationFrameId = requestAnimationFrame(drawParticles);
            } else if (!isVisible && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }, { threshold: 0 });

        if (containerRef.current) observer.observe(containerRef.current);

        // GSAP ScrollTrigger to animate progress towards the "Elephant" map
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
                const easeProgress = gsap.parseEase("power3.inOut")(self.progress);
                particles.forEach(p => {
                    // Magnetic attraction feeling: adding minor delay variations
                    const individualProgress = Math.min(1, Math.max(0, easeProgress * 1.2 - (p.size * 0.03)));
                    p.targetProgress = individualProgress;
                });
            }
        });

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            const newTargetPoints = getRNMapPoints(numParticles, width, height);
            particles.forEach((p, i) => {
                p.targetX = newTargetPoints[i].x;
                p.targetY = newTargetPoints[i].y;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            observer.disconnect();
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
                        <span className="metric-label">FORMADOS</span>
                    </div>
                    <div className="metric-divider"></div>
                    <div className="metric">
                        <span className="metric-value">544<span style={{ fontSize: '0.35em', verticalAlign: 'super', opacity: 0.8 }}>*</span></span>
                        <span className="metric-label">CRMs ATIVOS</span>
                    </div>
                    <div className="metric-divider"></div>
                    <div className="metric">
                        <span className="metric-value" style={{ fontSize: '1.8rem' }}>INÚMERAS</span>
                        <span className="metric-label">VIDAS IMPACTADAS</span>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <small style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>*Geralmente um médico atua em mais de um estado.</small>
                </div>
            </div>
        </section>
    );
};

export default Hero;
