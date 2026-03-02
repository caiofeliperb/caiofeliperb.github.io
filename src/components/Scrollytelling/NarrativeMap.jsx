import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ArrowUpRight, Stethoscope } from 'lucide-react';
import './NarrativeMap.css';

gsap.registerPlugin(ScrollTrigger);

// Donut Component for reusable, smooth circular charts
const Donut = ({ percentage, color, id }) => {
    const radius = 40;
    const circ = 2 * Math.PI * radius; // Approx 251.32

    return (
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))', overflow: 'visible' }}>
            <circle cx="50" cy="50" r={radius} stroke="rgba(0,0,0,0.06)" strokeWidth="12" fill="none" />
            <circle
                className={`donut-path-${id}`}
                cx="50" cy="50" r={radius}
                stroke={color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circ}
                strokeDashoffset={circ}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
            />
        </svg>
    );
};

const NarrativeMap = () => {
    const containerRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        const mm = gsap.matchMedia();
        const circ = 2 * Math.PI * 40; // 251.32

        // Initial setup for Cards and Donuts (hide and reset)
        gsap.set('.card-rn', { opacity: 0, y: 30, scale: 0.95 });
        gsap.set('.cards-expandable', { height: 0, opacity: 0, marginTop: 0 });
        gsap.set('.donut-path-rn, .donut-path-ne', { strokeDashoffset: circ });

        mm.add("(min-width: 0px)", () => {
            // First text block (RN Focus)
            if (stepsRef.current[1]) {
                ScrollTrigger.create({
                    trigger: stepsRef.current[1],
                    start: "top 60%",
                    onEnter: () => animateStep(1),
                    onLeaveBack: () => animateStep(0),
                });
            }

            // Second text block (NE + NY)
            if (stepsRef.current[2]) {
                ScrollTrigger.create({
                    trigger: stepsRef.current[2],
                    start: "top 60%",
                    onEnter: () => animateStep(2),
                    onLeaveBack: () => animateStep(1),
                });
            }

            // Intro step trigger
            ScrollTrigger.create({
                trigger: ".narrative-intro",
                start: "top bottom",
                onEnter: () => animateStep(0),
                onEnterBack: () => animateStep(0)
            });
        });

        // The animation logic switching cards based on the active step
        const animateStep = (index) => {
            const isMobile = window.innerWidth <= 768;

            if (index === 0) {
                // Step 0: Intro. Cards are dim, rings are empty.
                gsap.to('.card-rn', { opacity: 0, y: 30, scale: 0.9, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                gsap.to('.cards-expandable', { height: 0, opacity: 0, marginTop: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                gsap.to('.donut-path-rn, .donut-path-ne', { strokeDashoffset: circ, duration: 0.8, ease: "power2.inOut", overwrite: "auto" });

            } else if (index === 1) {
                // Step 1: Nossas Raízes Fortes (RN Focus)
                gsap.to('.card-rn', { opacity: 1, y: 0, scale: isMobile ? 0.9 : 1, duration: 0.8, ease: "back.out(1.2)", overwrite: "auto" });
                gsap.to('.cards-expandable', { height: 0, opacity: 0, marginTop: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });

                // Animate RN Donut
                gsap.to('.donut-path-rn', { strokeDashoffset: circ - (circ * 0.845), duration: 1.5, ease: "power3.out", overwrite: "auto" });
                gsap.to('.donut-path-ne', { strokeDashoffset: circ, duration: 0.8, overwrite: "auto" });

            } else if (index === 2) {
                // Step 2: Do Nordeste para o Mundo (NE + NY Focus)
                gsap.to('.card-rn', { opacity: 0.9, scale: isMobile ? 0.8 : 0.98, duration: 0.6, overwrite: "auto" });

                // On mobile we use a fixed max height to prevent jumping
                gsap.to('.cards-expandable', {
                    height: isMobile ? '280px' : 'auto',
                    opacity: 1,
                    marginTop: isMobile ? '0.8rem' : '1.5rem',
                    duration: 0.8,
                    ease: "power3.inOut",
                    overwrite: "auto",
                    scale: isMobile ? 0.95 : 1
                });

                // Maintain RN Donut filled, animate NE Donut
                gsap.to('.donut-path-rn', { strokeDashoffset: circ - (circ * 0.845), duration: 0.5, overwrite: "auto" });
                gsap.to('.donut-path-ne', { strokeDashoffset: circ - (circ * 0.80), duration: 1.5, ease: "power3.out", overwrite: "auto", delay: 0.3 });
            }
        };

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            mm.revert();
        };
    }, []);

    const steps = [
        {
            title: "O Ponto de Partida",
            description: "Vestimos o jaleco de pesquisadores! Lançamos um formulário detalhado que nos rendeu 194 respostas. Para completar a busca e garantir o quadro geral, recorremos aos dados do CFM, conseguindo mapear 468 egressos formados entre 2010 e 2024."
        },
        {
            title: "Nossas Raízes Fortes",
            description: "O chamado da nossa terra fala mais alto! Entre os que responderam à pesquisa, 84,5% (n=164) escolheram dar seus primeiros passos profissionais aqui mesmo, no RN. É o compromisso de fincar raízes e cuidar da nossa gente, com forte atuação em Mossoró e Natal."
        },
        {
            title: "Do Nordeste para o Mundo",
            description: "Quase 80% dos nossos 545 registros ativos estão concentrados no Rio Grande do Norte, Ceará, Pernambuco e Paraíba. Mas o cuidado não tem fronteiras: temos até egresso voando alto em Nova York!"
        }
    ];

    return (
        <section className="narrative-section" ref={containerRef}>
            {/* INTRO CARD - ALWAYS 100% WIDTH */}
            <div className="narrative-intro container">
                <div className="step-content glass-panel" style={{ opacity: 0.95, margin: '2rem auto', maxWidth: '800px', textAlign: 'center' }}>
                    <div className="step-icon" style={{ margin: '0 auto 1rem' }}>
                        <Stethoscope size={32} />
                    </div>
                    <h2 className="step-title">{steps[0].title}</h2>
                    <p className="step-description">{steps[0].description}</p>
                </div>
            </div>

            <div className="narrative-map-wrapper container">
                {/* Sticky Right Container for Infographics */}
                <div className="map-sticky" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <div className="infographics-wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '550px', padding: '1rem' }}>

                        {/* Card 1: RN */}
                        <div className="info-card card-rn" style={{
                            display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.8rem 1.5rem',
                            background: '#eff6ff', borderRadius: '24px', border: '1px solid #bfdbfe',
                            boxShadow: '0 10px 30px -10px rgba(14, 165, 233, 0.2)'
                        }}>
                            <Donut percentage={84.5} color="#2563eb" id="rn" />
                            <div style={{ paddingLeft: '0.5rem' }}>
                                <h3 style={{ fontSize: '3.6rem', fontWeight: '900', color: '#1d4ed8', lineHeight: 1, margin: 0, letterSpacing: '-2px' }}>
                                    84,5%
                                </h3>
                                <p style={{ fontSize: '1.3rem', color: '#1e3a8a', margin: '0.4rem 0 0', fontWeight: '700', lineHeight: 1.1 }}>
                                    Iniciam a atuação no RN
                                </p>
                            </div>
                        </div>

                        {/* Expandable Wrapper for Card 2 and 3 */}
                        <div className="cards-expandable" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden', height: 0, opacity: 0, marginTop: 0 }}>
                            {/* Card 2: Nordeste */}
                            <div className="info-card card-ne" style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.8rem 1.5rem',
                                background: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0',
                                boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.2)'
                            }}>
                                <Donut percentage={80} color="#10b981" id="ne" />
                                <div style={{ paddingLeft: '0.5rem' }}>
                                    <h3 style={{ fontSize: '3.6rem', fontWeight: '900', color: '#047857', lineHeight: 1, margin: 0, letterSpacing: '-2px' }}>
                                        ~80%
                                    </h3>
                                    <p style={{ fontSize: '1.3rem', color: '#064e3b', margin: '0.4rem 0 0', fontWeight: '700', lineHeight: 1.1 }}>
                                        Permanecem no Nordeste
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Mundo */}
                            <div className="info-card card-ny" style={{
                                display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.8rem',
                                background: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1'
                            }}>
                                <div style={{ flex: '0 0 45px', display: 'flex', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '2.4rem' }}>💡</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.1rem', color: '#475569', margin: 0, fontWeight: '500', lineHeight: 1.4 }}>
                                        O impacto transcende fronteiras, chegando até a <strong>Nova York, EUA</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Scrolling Text Blocks (Left) */}
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
            </div>
        </section>
    );
};

export default NarrativeMap;
