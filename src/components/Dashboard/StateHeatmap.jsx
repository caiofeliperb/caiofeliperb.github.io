import React, { useMemo } from 'react';

// Heatmap using a simple CSS Grid abstraction of Brazil for "ultra-lightweight"
// D3 geographical projection is heavy, so we map UF abbreviations to generic blocks.
const StateHeatmap = ({ data, filters }) => {
    const stateVolumes = useMemo(() => {
        const volumes = {};
        const isFilteringSpecificState = filters?.uf && filters.uf !== 'Todos';

        data.forEach(d => {
            if (d.uf_atuacao_cfm && d.uf_atuacao_cfm !== 'N/A') {
                const states = d.uf_atuacao_cfm.split('/').map(s => s.trim());

                states.forEach(state => {
                    // Requisito: se um estado foi selecionado no filtro, contabilizar e mostrar APENAS aquele estado
                    if (isFilteringSpecificState) {
                        if (state === filters.uf) {
                            volumes[state] = (volumes[state] || 0) + 1;
                        }
                    } else {
                        volumes[state] = (volumes[state] || 0) + 1;
                    }
                });
            }
        });
        return volumes;
    }, [data, filters]);

    const maxVolume = Math.max(1, ...Object.values(stateVolumes));

    const getStyle = (uf) => {
        const vol = stateVolumes[uf] || 0;
        if (vol === 0) return { backgroundColor: 'var(--bg-surface)', color: 'transparent', border: '1px solid rgba(0,0,0,0.05)' };
        const ratio = Math.max(0.2, vol / maxVolume);
        return {
            backgroundColor: `rgba(14, 165, 233, ${ratio})`, // Primary color scaling
            color: ratio > 0.5 ? '#fff' : 'var(--text-main)',
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
