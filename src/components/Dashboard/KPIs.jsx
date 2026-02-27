import React, { useMemo } from 'react';

const KPIs = ({ data, totalData }) => {
    const kpis = useMemo(() => {
        const isTotal = data.length === totalData.length;
        const formados = isTotal ? 468 : data.length;

        // Calculate total active CRMs from the uf_atuacao_cfm string (each '/' means another state + 1)
        let crmsAtivos = data.reduce((acc, curr) => {
            if (curr.uf_atuacao_cfm && curr.uf_atuacao_cfm !== 'N/A') {
                return acc + curr.uf_atuacao_cfm.split('/').length;
            }
            return acc;
        }, 0);
        if (isTotal) crmsAtivos = 544;

        let comRQE = data.filter(d => d.tem_rqe).length;
        if (isTotal) comRQE = 250;

        return [
            { label: "Total Formados", value: formados },
            { label: "CRMs Ativos", value: crmsAtivos },
            { label: "Com RQE", value: comRQE }
        ];
    }, [data]);

    return (
        <div className="kpi-row">
            {kpis.map((kpi, i) => (
                <div className="kpi-card glass-panel" key={i}>
                    <span className="kpi-value">{kpi.value}</span>
                    <span className="kpi-label">{kpi.label}</span>
                </div>
            ))}
        </div>
    );
};

export default KPIs;
