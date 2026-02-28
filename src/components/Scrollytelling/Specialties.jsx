import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useData } from '../../hooks/useData';
import './Specialties.css';

gsap.registerPlugin(ScrollTrigger);

const Specialties = () => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const pathsRef = useRef([]);

    // Hardcoded as per prompt instructions, though we could calculate this from data if needed
    const originalStats = [
        { label: "Clínico-Cirúrgicas", value: 38.4, color: "var(--color-primary)" },
        { label: "Especialidades Clínicas", value: 25.6, color: "var(--color-primary-light)" },
        { label: "Medicina de Família (MFC)", value: 10, color: "#10B981" }, // Verde
        { label: "Pediatria", value: 8.4, color: "var(--color-accent)" },
        { label: "Cirurgia Geral", value: 8.4, color: "#8B5CF6" }, // purple
        { label: "Outras", value: 9.2, color: "#475569" }
    ];

    // ... [skipping middle because we want to replace from line 15 to 78? Wait, if I do a wide replacement it's safer to use multi_replace. Actually I'll just multi_replace Specialties.jsx below... aborting this replace by fixing start and end to just 15-20]

    // Chart Setup
    const width = 450;
    const height = 450;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const pie = useMemo(() => d3.pie().value(d => d.value).sort(null), []);
    const arcGenerator = useMemo(() => d3.arc().innerRadius(radius * 0.5).outerRadius(radius), [radius]);
    const pieData = useMemo(() => pie(originalStats), [originalStats, pie]);

    useEffect(() => {
        // Set initial state
        gsap.set('.donut-slice', { opacity: 0 });

        ScrollTrigger.create({
            trigger: chartRef.current,
            start: "top 80%",
            onEnter: () => {
                // Animate pie slices fading elegantly to avoid DOM reflow transform bugs
                gsap.fromTo('.donut-slice',
                    { opacity: 0 },
                    { opacity: 1, duration: 1.5, stagger: 0.15, ease: "power2.out" }
                );

                // Also animate the labels
                gsap.fromTo('.legend-item',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
                );
            },
            once: true
        });
    }, []);

    return (
        <section className="specialties-section container" ref={containerRef}>
            <div className="section-header">
                <h2>Eles não param de estudar!<br />
                    Hoje, 250 dos nossos médicos já possuem o Registro de Qualificação de Especialista (RQE) ou estão em processo de obtenção.</h2>
            </div>

            <div className="specialties-content">
                <div className="chart-container" ref={chartRef}>
                    <svg viewBox={`0 0 ${width} ${height}`} className="donut-chart">
                        {/* Center Text */}
                        <text x={width / 2} y={height / 2 - 10} textAnchor="middle" className="donut-center-num">250</text>
                        <text x={width / 2} y={height / 2 + 20} textAnchor="middle" className="donut-center-label" style={{ fontSize: '10px' }}>COM RQE OU EM OBTENÇÃO</text>

                        <g transform={`translate(${width / 2},${height / 2})`}>
                            {pieData.map((d, i) => (
                                <path
                                    key={i}
                                    className="donut-slice"
                                    d={arcGenerator(d)}
                                    fill={d.data.color}
                                    stroke="var(--bg-color)"
                                    strokeWidth="2"
                                />
                            ))}
                        </g>
                    </svg>
                </div>

                <div className="chart-legend">
                    {originalStats.map((stat, i) => (
                        <div className="legend-item glass-panel" key={i}>
                            <div className="legend-color" style={{ backgroundColor: stat.color }}></div>
                            <div className="legend-text">
                                <span className="legend-value">{stat.value}%</span>
                                <span className="legend-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Specialties;
