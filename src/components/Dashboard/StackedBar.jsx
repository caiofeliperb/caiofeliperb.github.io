import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedBar = ({ data }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const chartData = useMemo(() => {
        // 1. Group by Year
        const byYear = d3.rollup(
            data.filter(d => Boolean(d.ano_formatura) && d.grande_area_rqe && d.grande_area_rqe !== 'N/A' && d.grande_area_rqe.trim() !== ''),
            v => d3.rollup(v, leaves => leaves.length, d => d.grande_area_rqe),
            d => d.ano_formatura
        );

        // 2. Extract unique specialties
        const allSpecialties = new Set();
        data.forEach(d => {
            if (d.grande_area_rqe && d.grande_area_rqe !== 'N/A' && d.grande_area_rqe.trim() !== '') {
                allSpecialties.add(d.grande_area_rqe);
            }
        });

        const keys = Array.from(allSpecialties);
        const parsedObj = Array.from(byYear, ([year, specs]) => {
            const obj = { year: String(year) };
            keys.forEach(k => obj[k] = specs.get(k) || 0);
            return obj;
        }).sort((a, b) => parseInt(a.year) - parseInt(b.year));

        return { parsedObj, keys };
    }, [data]);

    useEffect(() => {
        if (!chartData.parsedObj.length || !svgRef.current) return;

        const { parsedObj, keys } = chartData;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = containerRef.current.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        svg.attr("viewBox", [0, 0, width, height]);

        // Grouped Bar Scales
        const x0 = d3.scaleBand()
            .domain(parsedObj.map(d => d.year))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.1); // Thicker grouped cluster

        const x1 = d3.scaleBand()
            .domain(keys)
            .rangeRound([0, x0.bandwidth()])
            .padding(0.01); // Thicker individual bars within cluster

        // Find max value in any sub-group
        const maxVal = d3.max(parsedObj, d => d3.max(keys, key => d[key]));

        const y = d3.scaleLinear()
            .domain([0, maxVal]).nice()
            .rangeRound([height - margin.bottom, margin.top]);

        const getColor = (key) => {
            if (!key) return "#64748B"; // Fallback para keys vazios
            const k = key.toLowerCase();
            if (k.includes("cirúrgic") || k.includes("cirurgic")) return "#009FDF"; // Ciano
            if (k.includes("médica") || k.includes("medica")) return "#353C7C"; // Azul Azure
            if (k.includes("mfc") || k.includes("família")) return "#10B981"; // Verde Rico
            if (k.includes("pediatria")) return "#FFC107"; // Amarelo
            if (k.includes("cirurgia")) return "#8B5CF6"; // Roxo
            return "#64748B"; // Cinza
        };

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(keys.map(getColor));

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
                    <svg ref={svgRef} style={{ width: '100%', flex: 1, minHeight: '280px' }}></svg>

                    {/* Native responsive legend below the chart avoiding overlaps */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                        {chartData.keys.map((key, i) => {
                            if (!key) return null; // Prevenção contra nulos na legenda
                            const k = key.toLowerCase();
                            let col = "#64748B"; // Cinza fallback
                            if (k.includes("cirúrgic") || k.includes("cirurgic")) col = "#009FDF"; // Ciano
                            else if (k.includes("médica") || k.includes("medica")) col = "#353C7C"; // Azul Azure
                            else if (k.includes("mfc") || k.includes("família")) col = "#10B981"; // Verde Rico
                            else if (k.includes("pediatria")) col = "#FFC107"; // Amarelo
                            else if (k.includes("cirurgia")) col = "#8B5CF6"; // Roxo

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
