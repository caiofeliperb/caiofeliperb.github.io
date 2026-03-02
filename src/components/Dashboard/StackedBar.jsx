import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CUSTOM_SUB_SPECIALTY_COLORS = {
    "oftalmologia": "#2A5C8A", // Azul Safira
    "anestesiologia": "#E67E22", // Coral Suave
    "ginecologia e obstetrícia": "#27AE60", // Verde Esmeralda
    "ortopedia e traumatologia": "#4D5656", // Cinza Grafite
    "otorrinolaringologia": "#922B21", // Vinho Tinto

    "clínica médica": "#007FFF", // Azul Azure
    "psiquiatria": "#1E3A8A", // Azul Escuro Profundo
    "dermatologia": "#9C27B0", // Roxo Magenta
    "endocrinologia e metabologia": "#FF9800", // Laranja Vibrante
    "cardiologia": "#00BCD4", // Azul Ciano
    "reumatologia": "#F44336", // Vermelho Vivo
    "hematologia e hemoterapia": "#DC2626", // Vermelho Carmesim
    "nefrologia": "#CDDC39", // Verde Lima
    "gastroenterologia": "#795548", // Marrom Escuro

    "neurologia": "#C79733", // Amarelo Mustarda
    "infectologia": "#10B981", // Verde Esmeralda

    "neurocirurgia": "#007FFF", // Azul Azure
    "cirurgia geral": "#86A18C", // Verde Musgo Suave
    "cirurgia vascular": "#B46338", // Marrom Avermelhado
    "coloproctologia": "#D6B564", // Dourado Queimado
    "cirurgia pediátrica": "#6D122B", // Vinho Profundo
    "cirurgia cardiovascular": "#1F498F", // Azul Petróleo
    "mastologia": "#F5E6D8", // Pêssego Pálido

    "pediatria": "#DA70D6", // Orchid
    "endocrinologia pediátrica": "#4682B4", // Steel Blue

    "radiologia e diagnóstico por imagem": "#3F4B55", // Cinza Chumbo
    "patologia": "#0A9B6B", // Verde Esmeralda
    "medicina do tráfego": "#C79733", // Amarelo Mostarda
    "medicina do trabalho": "#D8BFD8", // Lilás
    "perícia médica": "#F0E592", // Amarelo Pálido / Creme
    "medicina de emergência": "#CB7B4A", // Laranja Queimado / Terracota
    "medicina intensiva": "#6F1E2F", // Vermelho Vinho / Borgonha
    "nutrologia": "#353C7C", // Azul Azure
    "radioterapia": "#4D205F", // Roxo Profundo
    "medicina paliativa": "#874A2B", // Marrom Terra

    "geriatria": "#a9a9a9", // Gray
    "reumatologia": "#4D205F" // Roxo Profundo
};

const StackedBar = ({ data, filters = {} }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const isSpecialtyFiltered = filters.especialidade && filters.especialidade !== 'Todas';
    const groupKey = isSpecialtyFiltered ? 'especialidade_rqe' : 'grande_area_rqe';

    const chartData = useMemo(() => {
        // 1. Group by Year
        const byYear = d3.rollup(
            data.filter(d => Boolean(d.ano_formatura) && d[groupKey] && d[groupKey] !== 'N/A' && d[groupKey].trim() !== ''),
            v => d3.rollup(v, leaves => leaves.length, d => d[groupKey]),
            d => d.ano_formatura
        );

        // 2. Extract unique specialties
        const allSpecialties = new Set();
        data.forEach(d => {
            if (d[groupKey] && d[groupKey] !== 'N/A' && d[groupKey].trim() !== '') {
                allSpecialties.add(d[groupKey]);
            }
        });

        const keys = Array.from(allSpecialties);
        const parsedObj = Array.from(byYear, ([year, specs]) => {
            const obj = { year: String(year) };
            keys.forEach(k => obj[k] = specs.get(k) || 0);
            return obj;
        }).sort((a, b) => parseInt(a.year) - parseInt(b.year));

        const allPossibleSubSpecialties = [
            "Anestesiologia", "Cardiologia", "Cardiopediatria", "Cirurgia Cardiovascular", "Cirurgia Geral",
            "Cirurgia Pediátrica", "Cirurgia Vascular", "Clínica Médica", "Coloproctologia", "Dermatologia",
            "Endocrinologia Pediátrica", "Endocrinologia e Metabologia", "Gastroenterologia", "Geriatria",
            "Ginecologia e Obstetrícia", "Hematologia e Hemoterapia", "Infectologia", "Mastologia",
            "Medicina Intensiva", "Medicina Intensiva Pediátrica", "Medicina Paliativa", "Medicina de Emergência",
            "Medicina de Família e Comunidade", "Medicina do Trabalho", "Medicina do Tráfego", "Nefrologia",
            "Neonatologia", "Neurocirurgia", "Neurologia", "Neurologia Pediátrica", "Nutrologia", "Oftalmologia",
            "Oncologia Pediátrica", "Ortopedia e Traumatologia", "Otorrinolaringologia", "Patologia",
            "Pediatria", "Perícia Médica", "Psiquiatria", "Radiologia e Diagnóstico por Imagem", "Radioterapia",
            "Reumatologia"
        ];

        return { parsedObj, keys, allPossibleSubSpecialties };
    }, [data]);

    useEffect(() => {
        if (!chartData.parsedObj.length || !svgRef.current) return;

        const { parsedObj, keys } = chartData;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const baseWidth = containerRef.current.clientWidth;
        const width = Math.max(baseWidth, parsedObj.length * 45);
        const height = 240;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        svg.attr("viewBox", [0, 0, width, height]);

        // Grouped Bar Scales
        const x0 = d3.scaleBand()
            .domain(parsedObj.map(d => d.year))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.05); // Deixa os grupos de anos MUITO MAIS JUNTOS (aumenta o espaço para as barras)

        const x1 = d3.scaleBand()
            .domain(keys)
            .rangeRound([0, x0.bandwidth()])
            .padding(0); // Elimina o espaço extra entre as barras de um mesmo ano

        // Find max value in any sub-group
        const maxVal = d3.max(parsedObj, d => d3.max(keys, key => d[key]));

        const y = d3.scaleLinear()
            .domain([0, maxVal]).nice()
            .rangeRound([height - margin.bottom, margin.top]);

        const distinctColors = [
            '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
            '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4',
            '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000',
            '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',
            '#8B4513', '#2E8B57', '#DAA520', '#483D8B', '#B8860B',
            '#556B2F', '#8B008B', '#FF8C00', '#9932CC', '#E9967A',
            '#8FBC8F', '#48D1CC', '#C71585', '#191970', '#FF4500' // Extended to 35 to prevent wrapping overlaps
        ];
        const specificColorScale = d3.scaleOrdinal(distinctColors).domain(chartData.allPossibleSubSpecialties);

        const getColor = (key) => {
            if (!key) return "#0097A7"; // Fallback para keys vazios

            if (isSpecialtyFiltered) {
                const lowerKey = key.toLowerCase();
                if (CUSTOM_SUB_SPECIALTY_COLORS[lowerKey]) {
                    return CUSTOM_SUB_SPECIALTY_COLORS[lowerKey];
                }
                return specificColorScale(key);
            }

            const k = key.toLowerCase();
            // CLÍNICO-CIRÚRGICA
            if (k.includes("clínico-cirúrgic") || k.includes("clinico-cirurgi")) return "#1D5C8F";
            // ESPECIALIDADES CLÍNICAS
            if (k.includes("clínica") || k.includes("clinica") || k.includes("clínic") || k.includes("clinic")) return "#ECA427";
            if (k.includes("mfc") || k.includes("família")) return "#2E7D32";
            if (k.includes("pediatria")) return "#7B1FA2";
            if (k.includes("cirurgia")) return "#C62828";
            return "#0097A7"; // Outras
        };

        const color = (key) => getColor(key);

        // Draw groups
        svg.append("g")
            .selectAll("g")
            .data(parsedObj)
            .join("g")
            .attr("transform", d => `translate(${x0(d.year)},0)`)
            .selectAll("rect")
            .data(d => keys.map(key => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .attr("fill", d => color(d.key))
            .append("title")
            .text(d => `${d.key}: ${d.value} RQE(s)`);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x0).tickSizeOuter(0))
            .attr("color", "var(--text-muted)")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .attr("color", "var(--text-muted)");

        // Add a smooth legend wrapper inside the chart container natively (react level instead of D3 for UX)
    }, [chartData, containerRef.current?.clientWidth]); // Re-run when resized

    return (
        <div className="bar-chart-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} ref={containerRef}>
            <div style={{ marginBottom: '10px' }}>
                <h3 className="card-title" style={{ marginBottom: '2px' }}>RQEs de Acordo com o Ano de Formatura</h3>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(Dados coletados até abril de 2025 com informações do formulário e CFM)</small>
            </div>

            {chartData.parsedObj.length > 0 ? (
                <>
                    <div style={{ width: '100%', overflowX: 'auto', flex: 1, minHeight: '300px', cursor: 'grab' }}>
                        <svg ref={svgRef} style={{
                            width: '100%',
                            minWidth: chartData.parsedObj.length > 8 ? `${chartData.parsedObj.length * 45}px` : '100%',
                            height: '100%',
                            minHeight: '280px'
                        }}></svg>
                    </div>

                    {/* Native responsive legend below the chart avoiding overlaps */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                        {chartData.keys.map((key, i) => {
                            if (!key) return null; // Prevenção contra nulos na legenda

                            let col = "#0097A7"; // Fallback (Outras)

                            if (isSpecialtyFiltered) {
                                const distinctColors = [
                                    '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
                                    '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4',
                                    '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000',
                                    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',
                                    '#8B4513', '#2E8B57', '#DAA520', '#483D8B', '#B8860B',
                                    '#556B2F', '#8B008B', '#FF8C00', '#9932CC', '#E9967A',
                                    '#8FBC8F', '#48D1CC', '#C71585', '#191970', '#FF4500'
                                ];
                                const specificColorScale = d3.scaleOrdinal(distinctColors).domain(chartData.allPossibleSubSpecialties);
                                const lowerKey = key.toLowerCase();
                                if (CUSTOM_SUB_SPECIALTY_COLORS[lowerKey]) {
                                    col = CUSTOM_SUB_SPECIALTY_COLORS[lowerKey];
                                } else {
                                    col = specificColorScale(key);
                                }
                            } else {
                                const k = key.toLowerCase();
                                // CLÍNICO-CIRÚRGICA
                                if (k.includes("clínico-cirúrgic") || k.includes("clinico-cirurgi")) col = "#1D5C8F";
                                // ESPECIALIDADES CLÍNICAS
                                else if (k.includes("clínica") || k.includes("clinica") || k.includes("clínic") || k.includes("clinic")) col = "#ECA427";
                                else if (k.includes("mfc") || k.includes("família")) col = "#2E7D32";
                                else if (k.includes("pediatria")) col = "#7B1FA2";
                                else if (k.includes("cirurgia")) col = "#C62828";
                            }

                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '12px', height: '12px', backgroundColor: col, marginRight: '5px', borderRadius: '3px' }}></div>
                                    {key}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                    Sem dados suficientes para exibir o gráfico.
                </div>
            )}
        </div>
    );
};

export default StackedBar;
