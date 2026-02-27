import React, { useRef, useEffect } from 'react';
import { HeartHandshake, Shield, Stethoscope, Building, Users } from 'lucide-react';
import './SocialCards.css';

const SocialCards = () => {
    const cardsContainerRef = useRef(null);

    const cardsData = [
        {
            title: "Atenção Primária",
            description: "Na linha de frente: Tutores da APS e atuação no Programa Mais Médicos.",
            icon: <Stethoscope size={40} />
        },
        {
            title: "Gestão e Política Pública",
            description: "Assumindo o leme: De diretores do Hospital Regional Tarcísio Maia até Prefeito de Pilões (RN).",
            icon: <Building size={40} />
        },
        {
            title: "Organização de Serviços",
            description: "Criando regras que salvam: Fluxogramas na pandemia de Covid-19 e rotinas para Doenças Renais Crônicas.",
            icon: <Shield size={40} />
        },
        {
            title: "Saúde Pública",
            description: 'Prevenção na veia: "Projeto Kim na Escola" (contra afogamentos), "Recife Cuida" e "RN + Coração".',
            icon: <Users size={40} />
        },
        {
            title: "Voluntariado",
            description: "Cuidado sem fronteiras: Atuação clínica em ONGs em Moçambique e apoio vital na APAE.",
            icon: <HeartHandshake size={40} />
        }
    ];

    useEffect(() => {
        // Basic mouse movement parallax logic for desktop
        const container = cardsContainerRef.current;
        if (!container) return;

        const cards = container.querySelectorAll('.social-card');

        const handleMouseMove = (e) => {
            // Calculate mouse position relative to window center
            const xObj = (window.innerWidth / 2 - e.clientX) / 25;
            const yObj = (window.innerHeight / 2 - e.clientY) / 25;

            cards.forEach((card) => {
                // Apply transform to the inner content of the card
                const inner = card.querySelector('.card-inner');
                if (inner) {
                    inner.style.transform = `rotateY(${xObj}deg) rotateX(${yObj}deg)`;
                }
            });
        };

        const handleMouseLeave = () => {
            cards.forEach((card) => {
                const inner = card.querySelector('.card-inner');
                if (inner) {
                    inner.style.transform = `rotateY(0deg) rotateX(0deg)`;
                }
            });
        };

        // Only apply on non-touch devices basically
        if (window.matchMedia("(min-width: 769px)").matches) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <section className="social-section container">
            <div className="section-header">
                <h2>Muito Além do Consultório</h2>
                <p className="section-subtitle text-muted">
                    Sabe a ideia do médico só no consultório? Esqueça. Dos 194 que ouvimos, 92 estão com a mão na massa na Educação Médica, atuando como preceptores e professores. E cerca de 12% lideram projetos que mudam realidades.
                </p>
            </div>

            {/* Horizontal Carousel Container */}
            <div className="cards-scroll-container" ref={cardsContainerRef}>
                <div className="cards-track">
                    {cardsData.map((card, idx) => (
                        <div className="social-card" key={idx}>
                            {/* Wrap in perspective container for 3D parallax */}
                            <div className="card-inner glass-panel">
                                <div className="card-icon">{card.icon}</div>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-description">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialCards;
