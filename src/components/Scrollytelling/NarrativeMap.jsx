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
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Mobile Sequential Reveal
                gsap.utils.toArray('.reveal-on-scroll').forEach((elem) => {
                    ScrollTrigger.create({
                        trigger: elem,
                        start: "top 85%",
                        onEnter: () => elem.classList.add('active'),
                        // Reset if scrolling back up
                        onLeaveBack: () => elem.classList.remove('active'),
                    });
                });

                // Force everything visible if already past
                ScrollTrigger.refresh();
            }

            // First text block (RN Focus) triggers donut animation
            if (stepsRef.current[1]) {
                ScrollTrigger.create({
                    trigger: stepsRef.current[1],
                    start: isMobile ? "top 85%" : "top 60%",
                    onEnter: () => animateStep(1),
                    onLeaveBack: () => animateStep(0),
                });
            }

            // Second text block (NE + NY) triggers donut animation
            if (stepsRef.current[2]) {
                ScrollTrigger.create({
                    trigger: stepsRef.current[2],
                    start: isMobile ? "top 85%" : "top 60%",
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
                gsap.to('.card-rn', { opacity: 0.8, y: 0, scale: isMobile ? 0.9 : 0.95, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                gsap.to('.cards-expandable', { height: 0, opacity: 0, marginTop: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
                gsap.to('.donut-path-rn, .donut-path-ne', { strokeDashoffset: circ, duration: 0.8, ease: "power2.inOut", overwrite: "auto" });

            } else if (index === 1) {
                // Step 1: Nossas Raízes Fortes (RN Focus)
                // Highlight RN Card beautifully, hide the rest
                gsap.to('.card-rn', { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)", overwrite: "auto" });
                gsap.to('.cards-expandable', { height: 0, opacity: 0, marginTop: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });

                // Animate RN Donut
                gsap.to('.donut-path-rn', { strokeDashoffset: circ - (circ * 0.845), duration: 1.5, ease: "power3.out", overwrite: "auto" });
                gsap.to('.donut-path-ne', { strokeDashoffset: circ, duration: 0.8, overwrite: "auto" });

            } else if (index === 2) {
                // Step 2: Do Nordeste para o Mundo (NE + NY Focus)
                // Dim RN slightly, expand container to reveal NE and NY
                gsap.to('.card-rn', { opacity: 1, scale: isMobile ? 0.95 : 0.98, duration: 0.6, overwrite: "auto" });

                gsap.to('.cards-expandable', {
                    height: isMobile ? '220px' : 'auto', // Slightly more compact for mobile
                    opacity: 1,
                    marginTop: isMobile ? '0.5rem' : '1.5rem',
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
                {/* Infographics Container */}
                <div className="map-sticky reveal-on-scroll">

                    <div className="infographics-wrapper">

                        {/* Card 1: RN */}
                        <div className="info-card card-rn reveal-on-scroll">
                            <Donut percentage={84.5} color="#2563eb" id="rn" />
                            <div className="card-text">
                                <h3>84,5%</h3>
                                <p>Iniciam a atuação no RN</p>
                            </div>
                        </div>

                        {/* Expandable Wrapper for Card 2 and 3 */}
                        <div className="cards-expandable">
                            {/* Card 2: Nordeste */}
                            <div className="info-card card-ne reveal-on-scroll">
                                <Donut percentage={80} color="#10b981" id="ne" />
                                <div className="card-text">
                                    <h3>~80%</h3>
                                    <p>Permanecem no Nordeste</p>
                                </div>
                            </div>

                            {/* Card 3: Mundo */}
                            <div className="info-card card-ny reveal-on-scroll">
                                <div className="card-icon-mundo">
                                    <span style={{ fontSize: '2.4rem' }}>💡</span>
                                </div>
                                <div className="card-text">
                                    <p>
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
                            className="narrative-step reveal-on-scroll"
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
