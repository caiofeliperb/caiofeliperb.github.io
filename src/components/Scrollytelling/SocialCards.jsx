import React, { useState } from 'react';
import { HeartHandshake, Shield, Stethoscope, Building, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import './SocialCards.css';

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

const SocialCards = () => {
    const [current, setCurrent] = useState(0);
    const total = cardsData.length;

    const prev = () => setCurrent(i => (i - 1 + total) % total);
    const next = () => setCurrent(i => (i + 1) % total);

    const card = cardsData[current];

    return (
        <section className="social-section container">
            <div className="section-header">
                <h2>Muito Além do Consultório</h2>
                <p className="section-subtitle text-muted">
                    Sabe a ideia do médico só no consultório? Esqueça. Dos 194 que ouvimos, 92 estão com a mão na massa na Educação Médica, atuando como preceptores e professores. E cerca de 12% lideram projetos que mudam realidades.
                </p>
            </div>

            {/* Carousel */}
            <div className="carousel-wrapper">
                <button className="carousel-arrow carousel-arrow--left" onClick={prev} aria-label="Card anterior">
                    <ChevronLeft size={28} />
                </button>

                <div className="carousel-card-area">
                    <div className="card-inner glass-panel carousel-card" key={current}>
                        <div className="card-icon">{card.icon}</div>
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">{card.description}</p>
                    </div>
                </div>

                <button className="carousel-arrow carousel-arrow--right" onClick={next} aria-label="Próximo card">
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Dot indicators */}
            <div className="carousel-dots">
                {cardsData.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot${i === current ? ' carousel-dot--active' : ''}`}
                        onClick={() => setCurrent(i)}
                        aria-label={`Card ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default SocialCards;
