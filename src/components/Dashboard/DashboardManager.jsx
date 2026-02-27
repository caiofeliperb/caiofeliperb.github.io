import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import KPIs from './KPIs';
import StateHeatmap from './StateHeatmap';
import StackedBar from './StackedBar';
import SocialTable from './SocialTable';
import './Dashboard.css';
import './DashboardComponents.css';

const DashboardManager = () => {
    const { data, loading } = useData();

    // Filter States
    const [filters, setFilters] = useState({
        ano: 'Todos',
        uf: 'Todos',
        rqe: 'Todos',
        social: 'Todos'
    });

    // Unique values for dropdowns
    const availableYears = useMemo(() => {
        if (!data.length) return [];
        return ['Todos', ...Array.from(new Set(data.map(d => d.ano_formatura))).filter(Boolean).sort((a, b) => b - a)];
    }, [data]);

    const availableUfs = useMemo(() => {
        // uf_atuacao_cfm might contain things like "RN / CE" or just "RN". We extract unique pure states.
        if (!data.length) return [];
        const allUfs = new Set();
        data.forEach(d => {
            if (d.uf_atuacao_cfm && d.uf_atuacao_cfm !== 'N/A') {
                d.uf_atuacao_cfm.split('/').forEach(state => allUfs.add(state.trim()));
            }
        });
        return ['Todos', ...Array.from(allUfs).sort()];
    }, [data]);

    // Handle cross-filtering
    const filteredData = useMemo(() => {
        return data.filter(d => {
            // 1. Array-based UF matching because of "RN / CE"
            const ufMatches = filters.uf === 'Todos' || (d.uf_atuacao_cfm && d.uf_atuacao_cfm.includes(filters.uf));
            const anoMatches = filters.ano === 'Todos' || d.ano_formatura === Number(filters.ano);

            let rqeMatches = true;
            if (filters.rqe === 'Sim') rqeMatches = d.tem_rqe === true;
            if (filters.rqe === 'Não') rqeMatches = d.tem_rqe === false;

            let socialMatches = true;
            if (filters.social === 'Sim') socialMatches = d.faz_acao_social === true;
            if (filters.social === 'Não') socialMatches = d.faz_acao_social === false;

            return ufMatches && anoMatches && rqeMatches && socialMatches;
        });
    }, [data, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="dashboard-loading">Carregando painel de dados...</div>;

    return (
        <section className="dashboard-section container">
            <div className="section-header">
                <h2>A Base de Dados: Explore Nossa Trajetória</h2>
                <p className="section-subtitle text-muted">
                    Utilize os filtros abaixo para cruzar especialidades, anos de formatura e áreas de atuação. Descubra os detalhes do nosso impacto.
                </p>
            </div>

            <div className="dashboard-layout">
                {/* Sidebar Controls */}
                <aside className="dashboard-sidebar glass-panel">
                    <h3 className="sidebar-title">Filtros Avançados</h3>

                    <div className="filter-group">
                        <label>Ano de Formatura</label>
                        <select value={filters.ano} onChange={(e) => handleFilterChange('ano', e.target.value)}>
                            {availableYears.map(ano => <option key={ano} value={ano}>{ano}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>UF de Atuação</label>
                        <select value={filters.uf} onChange={(e) => handleFilterChange('uf', e.target.value)}>
                            {availableUfs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Possui RQE?</label>
                        <select value={filters.rqe} onChange={(e) => handleFilterChange('rqe', e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Faz Ação Social?</label>
                        <select value={filters.social} onChange={(e) => handleFilterChange('social', e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>

                    <div className="filter-summary">
                        Mostrando <strong>{filteredData.length}</strong> egressos
                    </div>
                </aside>

                {/* Main Grid */}
                <div className="dashboard-main">
                    <KPIs data={filteredData} totalData={data} />

                    <div className="dashboard-charts-row">
                        <div className="dashboard-card glass-panel flex-1">
                            <StateHeatmap data={filteredData} />
                        </div>
                        <div className="dashboard-card glass-panel flex-2">
                            <StackedBar data={filteredData} />
                        </div>
                    </div>

                    <div className="dashboard-card glass-panel w-full">
                        <SocialTable data={filteredData} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardManager;
