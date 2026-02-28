import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ArrowUpRight, Stethoscope } from 'lucide-react';
import './NarrativeMap.css';

gsap.registerPlugin(ScrollTrigger);

const NarrativeMap = () => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const svgContainerRef = useRef(null);
    const stepsRef = useRef([]);
    // Refs for SVG elements
    const pathMossoroRef = useRef(null);
    const pathNatalRef = useRef(null);
    const pathCERef = useRef(null);
    const pathPBRef = useRef(null);
    const pathPERef = useRef(null);
    const pathNYRef = useRef(null);

    const labelRNRef = useRef(null);
    const labelNERef = useRef(null);
    const gMapRef = useRef(null);

    useEffect(() => {
        const paths = [pathMossoroRef, pathNatalRef, pathCERef, pathPBRef, pathPERef, pathNYRef];

        paths.forEach(pRef => {
            if (pRef.current) {
                const length = pRef.current.getTotalLength();
                // Apply length for dash offset drawing animation to all paths
                gsap.set(pRef.current, { strokeDasharray: length, strokeDashoffset: length });
            }
        });

        // Hide data labels and NY elements initially
        gsap.set([labelRNRef.current, labelNERef.current, document.getElementById('ny-dot'), document.getElementById('ny-text'), pathNYRef.current], { opacity: 0 });
        gsap.set([labelRNRef.current, labelNERef.current, document.getElementById('ny-dot'), document.getElementById('ny-text')], { scale: 0.8 });

        // Initial Map Transform
        gsap.set(gMapRef.current, { scale: 0.85, transformOrigin: 'center center', opacity: 0.3 });

        const mm = gsap.matchMedia();

        // Scrollytelling Triggers using MatchMedia for correct cleanup
        mm.add("(min-width: 0px)", () => {

            // Map general appearance bound to scrub scroll
            gsap.to(gMapRef.current, {
                opacity: 1,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    end: "top 20%",
                    scrub: true
                }
            });

            // Animate based on step entering
            stepsRef.current.forEach((step, i) => {
                if (!step) return;
                ScrollTrigger.create({
                    trigger: step,
                    start: "top 60%", // Activate when step card hits 60% of viewport
                    end: "bottom center",
                    onEnter: () => animateStep(i + 1), // Offset index since array starts at index 1 for scrolling
                    onEnterBack: () => animateStep(i + 1),
                });
            });

            // Trigger step 0 immediately if already in view
            ScrollTrigger.create({
                trigger: ".narrative-intro",
                start: "top bottom",
                onEnter: () => animateStep(0),
                onEnterBack: () => animateStep(0)
            })
        });

        // Ensure visible initially if it's high enough on load
        gsap.set(svgContainerRef.current, { opacity: 1 });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            mm.revert();
        };
    }, []);

    const animateStep = (index) => {
        if (index === 0) {
            // Step 1: Base - Reset globally, keep SVG map visible but clean
            gsap.to([pathMossoroRef.current, pathNatalRef.current, pathCERef.current, pathPBRef.current, pathPERef.current, pathNYRef.current], {
                strokeDashoffset: (i, target) => target.getTotalLength(),
                duration: 0.8, ease: "power2.out", overwrite: true
            });
            gsap.to([labelRNRef.current, labelNERef.current, document.getElementById('ny-dot'), document.getElementById('ny-text'), pathNYRef.current], { opacity: 0, scale: 0.8, duration: 0.5, overwrite: true });

        } else if (index === 1) {
            // Step 2: RN Focus (Mossoró and Natal)
            // Show base paths and animate local
            gsap.to([pathMossoroRef.current, pathNatalRef.current], {
                strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", overwrite: true
            });
            // O texto 84.5% no RN surge aqui
            gsap.to(labelRNRef.current, { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.5)", overwrite: true });

            // Hide global - GARANTINDO QUE O RESTO SOME (80% NE E NY)
            gsap.to([pathCERef.current, pathPBRef.current, pathPERef.current, pathNYRef.current], {
                strokeDashoffset: (i, target) => target.getTotalLength(),
                duration: 0.8, overwrite: true
            });
            gsap.to([labelNERef.current, document.getElementById('ny-dot'), document.getElementById('ny-text'), pathNYRef.current], { opacity: 0, scale: 0.8, duration: 0.5, overwrite: true });

        } else if (index === 2) {
            // Step 3: BR/NY Expansion
            gsap.to(pathMossoroRef.current, { strokeDashoffset: 0, duration: 0.5, overwrite: true });
            gsap.to(pathNatalRef.current, { strokeDashoffset: 0, duration: 0.5, overwrite: true });
            gsap.to(labelRNRef.current, { opacity: 1, scale: 1, duration: 0.5, overwrite: true });

            gsap.to([pathCERef.current, pathPBRef.current, pathPERef.current], {
                strokeDashoffset: 0, duration: 2, ease: "power2.out", overwrite: true
            });

            // O texto de 80% do NE só surge AGORA JUNTO com Nova York, no Step 3 de expansão
            gsap.to(labelNERef.current, { opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: "power2.out", overwrite: true });

            // NY Path Animation junto com o texto de cima, mesma lentidão
            gsap.to([document.getElementById('ny-dot'), document.getElementById('ny-text'), pathNYRef.current], { opacity: 1, scale: 1, duration: 1.5, delay: 0.5, ease: "power2.out", overwrite: true });
            gsap.to(pathNYRef.current, { strokeDashoffset: 0, duration: 3, ease: "power2.inOut", delay: 0.5, overwrite: true });
        }
    };

    const steps = [
        {
            title: "O Ponto de Partida",
            description: "Vestimos o jaleco de pesquisadores! Lançamos um formulário detalhado onde conseguimos 194 respostas e mapeamos um total de 468 egressos formados de 2010 a 2024 cruzando informações com o CFM."
        },
        {
            title: "Nossas Raízes Fortes",
            description: "Nossas raízes gritam forte! Dos nossos egressos que responderam a pesquisa, 84,5% (n=164) iniciaram sua atuação profissional no próprio RN. Fincamos raízes cuidando da nossa gente, principalmente em Mossoró e Natal."
        },
        {
            title: "Do Nordeste para o Mundo",
            description: "Quase 80% dos nossos 544 registros ativos estão concentrados no RN, Ceará, Pernambuco e Paraíba. Mas o cuidado não tem fronteiras: temos até egresso voando alto em Nova York!"
        }
    ];

    return (
        <section className="narrative-section" ref={containerRef}>

            {/* INTRO CARD - ALWAYS 100% WIDTH, BEFORE MAP  */}
            <div className="narrative-intro container">
                <div className="step-content glass-panel" style={{ opacity: 0.95, margin: '2rem auto', maxWidth: '800px', textAlign: 'center' }}>
                    <div className="step-icon" style={{ margin: '0 auto 1rem' }}>
                        <Stethoscope size={32} />
                    </div>
                    <h2 className="step-title">{steps[0].title}</h2>
                    <p className="step-description">{steps[0].description}</p>
                </div>
            </div>

            {/* Wrapper for the SCROLLY parts only */}
            <div className="narrative-map-wrapper">
                {/* Sticky Map Container */}
                <div className="map-sticky" ref={mapRef}>
                    <div className="map-wrapper glass-panel" style={{ position: 'relative', zIndex: 2 }}>
                        {/* SVG Map Container */}
                        <div ref={svgContainerRef} style={{ width: '100%', height: '100%', opacity: 0 }}>
                            <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" className="map-svg">
                                <defs>
                                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--color-primary-light)" />
                                        <stop offset="100%" stopColor="var(--color-secondary)" />
                                    </linearGradient>
                                    <linearGradient id="nyGradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="var(--color-primary-light)" />
                                        <stop offset="100%" stopColor="var(--color-accent)" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="rgba(255, 255, 255, 0.05)" />
                                    </pattern>
                                    <path id="brShape" d="M 450 100 L 750 20 L 950 220 L 700 550 L 400 450 L 250 300 Z" />
                                </defs>

                                {/* Background Map Styling */}
                                <rect width="100%" height="100%" fill="url(#dotGrid)" />
                                <g ref={gMapRef}>
                                    <use href="#brShape" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" />
                                    <polygon points="650,80 920,100 950,220 800,450 550,250" fill="rgba(14, 165, 233, 0.03)" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                                    <text x="600" y="350" fill="rgba(255,255,255,0.05)" fontSize="32" fontWeight="600" style={{ letterSpacing: '8px', textTransform: 'uppercase' }}>Brasil</text>

                                    {/* Origin Point: Mossoró RN */}
                                    <circle cx="750" cy="200" r="10" fill="var(--color-primary)" filter="url(#glow)" />
                                    <text x="765" y="205" fill="var(--text-main)" fontSize="18" fontWeight="600" className="map-label">UERN Mossoró</text>

                                    {/* Path inside Mossoró (Simulated loop/stay) */}
                                    <path ref={pathMossoroRef} d="M 750 200 C 720 180 730 230 750 200" fill="none" stroke="var(--color-primary-light)" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />

                                    {/* Path to Natal */}
                                    <path ref={pathNatalRef} d="M 750 200 Q 800 210 850 240" fill="none" stroke="url(#pathGradient)" strokeWidth="4" filter="url(#glow)" strokeLinecap="round" />
                                    <circle cx="850" cy="240" r="6" fill="var(--color-secondary)" />
                                    <text x="865" y="245" fill="var(--text-muted)" fontSize="14" className="map-label">Natal</text>

                                    {/* Paths to CE, PE, PB */}
                                    {/* CE (Fortaleza) */}
                                    <path ref={pathCERef} d="M 750 200 Q 700 160 630 140" fill="none" stroke="url(#pathGradient)" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
                                    <circle cx="630" cy="140" r="5" fill="var(--color-secondary)" />
                                    <text x="610" y="130" fill="var(--text-muted)" fontSize="13" className="map-label">CE</text>

                                    {/* PB (João Pessoa) */}
                                    <path ref={pathPBRef} d="M 750 200 Q 820 280 870 300" fill="none" stroke="url(#pathGradient)" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
                                    <circle cx="870" cy="300" r="5" fill="var(--color-secondary)" />
                                    <text x="885" y="305" fill="var(--text-muted)" fontSize="13" className="map-label">PB</text>

                                    {/* PE (Recife) */}
                                    <path ref={pathPERef} d="M 750 200 Q 800 320 850 370" fill="none" stroke="url(#pathGradient)" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
                                    <circle cx="850" cy="370" r="5" fill="var(--color-secondary)" />
                                    <text x="865" y="375" fill="var(--text-muted)" fontSize="13" className="map-label">PE</text>

                                    {/* Long Path to New York */}
                                    <path ref={pathNYRef} d="M 750 200 C 600 50 400 50 200 150" fill="none" stroke="var(--color-accent)" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" opacity="0" />
                                    <circle cx="200" cy="150" r="6" fill="var(--color-accent)" filter="url(#glow)" id="ny-dot" opacity="0" />
                                    <text x="130" y="140" fill="var(--color-accent)" fontSize="16" fontWeight="600" className="map-label" id="ny-text" opacity="0">Nova York</text>

                                    {/* DATA HIGHLIGHTS */}
                                    <g ref={labelRNRef} style={{ transformOrigin: '780px 180px' }}>
                                        <rect x="620" y="140" width="310" height="40" rx="20" fill="rgba(14, 165, 233, 0.2)" stroke="var(--color-primary-light)" />
                                        <text x="775" y="165" fill="var(--text-main)" fontSize="13" fontWeight="700" textAnchor="middle">84.5% iniciam a atuação no RN (n=164)</text>
                                    </g>

                                    <g ref={labelNERef} style={{ transformOrigin: '700px 300px', opacity: 0 }}>
                                        <rect x="580" y="450" width="220" height="40" rx="20" fill="rgba(16, 185, 129, 0.2)" stroke="var(--color-secondary)" />
                                        <text x="690" y="475" fill="var(--text-main)" fontSize="14" fontWeight="700" textAnchor="middle">~80% permanecem no Nordeste</text>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Scrolling Text Blocks */}
                <div className="narrative-scroll">
                    {steps.slice(1).map((step, i) => (
                        <div
                            key={i + 1}
                            className="narrative-step"
                            ref={el => stepsRef.current[i + 1] = el}
                        >
                            <div className="step-content glass-panel" style={{ opacity: 0.95 }}>
                                <div className="step-icon">
                                    {i + 1 === 2 ? <ArrowUpRight size={32} /> : <MapPin size={32} />}
                                </div>
                                <h2 className="step-title">{step.title}</h2>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* End wrapper */}
            </div>
        </section>
    );
};

export default NarrativeMap;
