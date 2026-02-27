import React, { useMemo } from 'react';

// Heatmap using a simple CSS Grid abstraction of Brazil for "ultra-lightweight"
// D3 geographical projection is heavy, so we map UF abbreviations to generic blocks.
const StateHeatmap = ({ data }) => {
    const stateVolumes = useMemo(() => {
        const volumes = {};
        data.forEach(d => {
            if (d.uf_atuacao_cfm && d.uf_atuacao_cfm !== 'N/A') {
                const states = d.uf_atuacao_cfm.split('/').map(s => s.trim());
                states.forEach(state => {
                    volumes[state] = (volumes[state] || 0) + 1;
                });
            }
        });
        return volumes;
    }, [data]);

    const maxVolume = Math.max(1, ...Object.values(stateVolumes));

    // Determine opacity based on absolute frequency
    const getStyle = (uf) => {
        const vol = stateVolumes[uf] || 0;
        if (vol === 0) return { backgroundColor: 'var(--bg-surface)', color: 'transparent', border: '1px solid rgba(255,255,255,0.05)' };
        const ratio = Math.max(0.2, vol / maxVolume);
        return {
            backgroundColor: `rgba(14, 165, 233, ${ratio})`, // Primary color scaling
            color: ratio > 0.5 ? '#fff' : 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(14, 165, 233, 0.5)',
            cursor: 'pointer'
        };
    };

    // Simplified schematic grid of Brazil UFs
    const gridLayout = [
        ['RR', 'AP', '', '', ''],
        ['AM', 'PA', 'MA', 'CE', 'RN'],
        ['AC', 'RO', 'MT', 'TO', 'PI', 'PB'],
        ['', '', 'MS', 'GO', 'BA', 'PE'],
        ['', '', 'PR', 'SP', 'MG', 'AL'],
        ['', '', 'SC', 'RJ', 'ES', 'SE'],
        ['', '', 'RS', '', '', '']
    ];

    return (
        <div className="heatmap-container">
            <h3 className="card-title">Volume por Estado (Heatmap)</h3>
            <div className="heatmap-grid">
                {gridLayout.map((row, i) => (
                    <div className="heatmap-row" key={i}>
                        {row.map((uf, j) => (
                            <div
                                key={`${i}-${j}`}
                                className={`heatmap-cell ${!uf ? 'empty-cell' : ''}`}
                                style={uf ? getStyle(uf) : {}}
                                title={uf ? `${uf}: ${stateVolumes[uf] || 0} médicos` : ''}
                            >
                                {uf}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StateHeatmap;
