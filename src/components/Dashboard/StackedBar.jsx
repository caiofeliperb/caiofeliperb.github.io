import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedBar = ({ data }) => {
    const svgRef = useRef(null);

    const chartData = useMemo(() => {
        // 1. Group by Year
        const byYear = d3.rollup(
            data.filter(d => Boolean(d.ano_formatura) && d.grande_area_rqe && d.grande_area_rqe !== 'N/A'),
            v => d3.rollup(v, leaves => leaves.length, d => d.grande_area_rqe),
            d => d.ano_formatura
        );

        // 2. Extract unique specialties
        const allSpecialties = new Set();
        data.forEach(d => {
            if (d.grande_area_rqe && d.grande_area_rqe !== 'N/A') {
                allSpecialties.add(d.grande_area_rqe);
            }
        });

        // 3. Convert to tabular format for D3 Stack
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
        svg.selectAll("*").remove(); // Clear previous

        const width = svgRef.current.parentElement.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        svg.attr("viewBox", [0, 0, width, height]);

        const stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const series = stack(parsedObj);

        const x = d3.scaleBand()
            .domain(parsedObj.map(d => d.year))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#0EA5E9", "#38BDF8", "#F59E0B", "#10B981", "#8B5CF6", "#64748B"]);

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.year))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .append("title")
            .text(function () {
                const d = d3.select(this.parentNode).datum();
                const val = this.__data__[1] - this.__data__[0];
                return `${d.key}: ${val}`;
            });

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .attr("color", "var(--text-muted)");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .attr("color", "var(--text-muted)");

    }, [chartData]); // Re-run when data changes

    return (
        <div className="bar-chart-container" style={{ width: '100%', height: '100%' }}>
            <h3 className="card-title">Evolução por Área (RQE)</h3>
            {chartData.parsedObj.length > 0 ? (
                <svg ref={svgRef} style={{ width: '100%', height: '300px' }}></svg>
            ) : (
                <div className="text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                    Sem dados suficientes para exibir o gráfico.
                </div>
            )}
        </div>
    );
};

export default StackedBar;
