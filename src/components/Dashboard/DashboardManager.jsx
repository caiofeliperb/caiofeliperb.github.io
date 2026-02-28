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
        social: 'Todos',
        especialidade: 'Todas'
    });

    // Unique values for dropdowns
    const availableYears = useMemo(() => {
        if (!data.length) return [];
        return ['Todos', ...Array.from(new Set(data.map(d => d.ano_formatura))).filter(Boolean).sort((a, b) => b - a)];
    }, [data]);

    const availableUfs = useMemo(() => {
        if (!data.length) return [];
        const allUfs = new Set();
        data.forEach(d => {
            if (d.uf_atuacao_cfm && d.uf_atuacao_cfm !== 'N/A') {
                d.uf_atuacao_cfm.split('/').forEach(state => allUfs.add(state.trim()));
            }
        });
        return ['Todos', ...Array.from(allUfs).sort()];
    }, [data]);

    const especialidadesHierarchy = [
        {
            category: "CLÍNICO-CIRÚRGICA",
            items: [
                { name: "Ginecologia e Obstetrícia", count: 31 },
                { name: "Anestesiologia", count: 19 },
                { name: "Ortopedia e Traumatologia", count: 18 },
                { name: "Oftalmologia", count: 12 },
                { name: "Otorrinolaringologia", count: 8 }
            ]
        },
        {
            category: "ESPECIALIDADES CLÍNICAS",
            items: [
                { name: "Clínica Médica", count: 22 },
                { name: "Psiquiatria", count: 15 },
                { name: "Cardiologia", count: 7 },
                { name: "Neurologia", count: 6 },
                { name: "Endocrinologia e Metabologia", count: 5 },
                { name: "Dermatologia", count: 4 },
                { name: "Nefrologia", count: 2 },
                { name: "Hematologia e Hemoterapia", count: 2 },
                { name: "Gastroenterologia", count: 1 },
                { name: "Reumatologia", count: 1 },
                { name: "Infectologia", count: 1 },
                { name: "Geriatria", count: 1 }
            ]
        },
        {
            category: "CIRURGIA",
            items: [
                { name: "Cirurgia Geral", count: 6 },
                { name: "Cirurgia Vascular", count: 5 },
                { name: "Neurocirurgia", count: 4 },
                { name: "Cirurgia Pediátrica", count: 2 },
                { name: "Coloproctologia", count: 1 },
                { name: "Cirurgia Cardiovascular", count: 1 },
                { name: "Mastologia", count: 1 }
            ]
        },
        {
            category: "PEDIATRIA",
            items: [
                { name: "Pediatria", count: 9 },
                { name: "Neonatologia", count: 6 },
                { name: "Neurologia Pediátrica", count: 2 },
                { name: "Cardiopediatria", count: 1 },
                { name: "Endocrinologia Pediátrica", count: 1 },
                { name: "Oncologia Pediátrica", count: 1 },
                { name: "Medicina Intensiva Pediátrica", count: 1 }
            ]
        },
        {
            category: "MFC",
            items: [
                { name: "Medicina de Família e Comunidade", count: 25 }
            ]
        },
        {
            category: "OUTRAS",
            items: [
                { name: "Radiologia e Diagnóstico por Imagem", count: 12 },
                { name: "Patologia", count: 4 },
                { name: "Medicina Intensiva", count: 3 },
                { name: "Medicina do Trabalho", count: 2 },
                { name: "Medicina de Emergência", count: 2 },
                { name: "Nutrologia", count: 1 },
                { name: "Perícia Médica", count: 1 },
                { name: "Radioterapia", count: 1 },
                { name: "Medicina do Tráfego", count: 1 },
                { name: "Medicina Paliativa", count: 1 }
            ]
        }
    ];

    // Handle cross-filtering
    const filteredData = useMemo(() => {
        return data.filter(d => {
            const ufMatches = filters.uf === 'Todos' || (d.uf_atuacao_cfm && d.uf_atuacao_cfm.includes(filters.uf));
            const anoMatches = filters.ano === 'Todos' || d.ano_formatura === Number(filters.ano);

            let rqeMatches = true;
            if (filters.rqe === 'Sim') rqeMatches = d.tem_rqe === true;
            if (filters.rqe === 'Não') rqeMatches = d.tem_rqe === false;

            let socialMatches = true;
            const hasImpacto = d.faz_acao_social === true || d.atua_educacao_medica === true;
            if (filters.social === 'Sim') socialMatches = hasImpacto;
            if (filters.social === 'Não') socialMatches = !hasImpacto;

            let specMatches = true;
            if (filters.especialidade !== 'Todas') {
                if (filters.especialidade.startsWith('CAT:')) {
                    const catName = filters.especialidade.replace('CAT:', '');
                    specMatches = d.grande_area_rqe === catName;
                } else if (filters.especialidade.startsWith('SPEC:')) {
                    const specName = filters.especialidade.replace('SPEC:', '');
                    specMatches = d.especialidade_rqe === specName;
                }
            }

            return ufMatches && anoMatches && rqeMatches && socialMatches && specMatches;
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
                        <label>Especialidades</label>
                        <select value={filters.especialidade} onChange={(e) => handleFilterChange('especialidade', e.target.value)}>
                            <option value="Todas">Todas as Especialidades</option>
                            {especialidadesHierarchy.map(group => (
                                <optgroup key={group.category} label={group.category}>
                                    <option value={`CAT:${group.category}`}>{"↳ TODAS DE " + group.category}</option>
                                    {group.items.map(item => (
                                        <option key={item.name} value={`SPEC:${item.name}`}>
                                            {item.name} ({item.count})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Impacto Social</label>
                        <select value={filters.social} onChange={(e) => handleFilterChange('social', e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="Sim">Sim</option>
                        </select>
                    </div>

                    {filters.social !== 'Sim' && (
                        <div className="filter-summary">
                            Mostrando <strong>{filteredData.length}</strong> egressos
                        </div>
                    )}
                </aside>

                {/* Main Grid */}
                <div className="dashboard-main">
                    <KPIs data={filteredData} totalData={data} filters={filters} />

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
