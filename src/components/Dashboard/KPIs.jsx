import React, { useMemo } from 'react';
import { formaturasData } from '../../data/formaturasData';
import { rqeData } from '../../data/rqeData';
import { especialidadesData, categoriaEspecialidadesData } from '../../data/especialidadesData';
import { ufData } from '../../data/ufData';

const KPIs = ({ data, totalData, filters }) => {
    const kpis = useMemo(() => {
        if (filters?.social === 'Sim') {
            return [
                { label: "NA EDUCAÇÃO MÉDICA", value: "92" },
                { label: "EM PROJETOS SOCIAIS", value: "14" },
                { label: "DE VIDAS IMPACTADAS", value: "CENTENAS" }
            ];
        }

        const isTotal = data.length === totalData.length;
        let formados = isTotal ? 468 : data.length;

        // Calculate total active CRMs from the uf_atuacao_cfm string (each '/' means another state + 1)
        let crmsAtivos = data.reduce((acc, curr) => {
            if (curr.uf_atuacao_cfm && curr.uf_atuacao_cfm !== 'N/A') {
                return acc + curr.uf_atuacao_cfm.split('/').length;
            }
            return acc;
        }, 0);

        let comRQE = data.filter(d => d.tem_rqe).length;

        // Verify if we can use the absolute data from formaturas.csv
        // We use absolute data if only 'ano' or 'rqe' are filtering the dataset
        const noSpecificFilters = (!filters || (
            filters.uf === 'Todos' &&
            filters.social === 'Todos' &&
            filters.especialidade === 'Todas'
        ));

        // Use formaturasData when RQE is "Todos", otherwise use rqeData when RQE is "Sim"
        const dataSource = filters?.rqe === 'Sim' ? rqeData : formaturasData;

        // NEW LOGIC: Se tiver filtro combinado (ex: UF + Ano), recálculo dinâmico baseado no filteredData (data real da tela)
        const isCombinedFilter = filters && ((filters.uf !== 'Todos' && filters.ano !== 'Todos') || filters.social !== 'Todos' || filters.especialidade !== 'Todas');

        if (isCombinedFilter) {
            // Conta formados: quantidade total no array filtrado
            formados = data.length;

            // Conta CRMs no estado filtrado (ou em todos os estados se for 'Todos')
            crmsAtivos = 0;
            data.forEach(d => {
                if (d.uf_atuacao_cfm && d.uf_atuacao_cfm !== 'N/A') {
                    if (filters.uf !== 'Todos') {
                        if (d.uf_atuacao_cfm.includes(filters.uf)) crmsAtivos++;
                    } else {
                        crmsAtivos += d.uf_atuacao_cfm.split('/').length;
                    }
                }
            });

            // Conta RQE: quantos no array filtrado têm RQE
            comRQE = data.filter(d => d.tem_rqe).length;

            // Se for RQE "Não", ajustamos o label e value
            if (filters.rqe === 'Não') {
                finalLabelRQE = "Sem RQE";
                comRQE = formados; // Quando já está filtrado por "Não", todos na tela não têm RQE
            } else if (filters.rqe === 'Sim') {
                formados = comRQE;
            }

        } else if (noSpecificFilters) {
            const anoKey = filters?.ano || 'Todos';
            const fd = dataSource[anoKey];
            if (fd) {
                formados = fd.total;
                crmsAtivos = fd.crms;
                comRQE = fd.rqe;
            }
        } else {
            if (isTotal) {
                formados = dataSource['Todos'].total;
                crmsAtivos = dataSource['Todos'].crms;
                comRQE = dataSource['Todos'].rqe;
            }

            // Requisito: Exibir dados absolutos atrelados à UF de atuação (Sozinho)
            if (filters?.uf && filters.uf !== 'Todos') {
                if (ufData[filters.uf]) {
                    formados = ufData[filters.uf].total;
                    crmsAtivos = ufData[filters.uf].crms;
                    comRQE = ufData[filters.uf].rqe;
                }
            }
        }

        // Requisito original de substituição de nomes para filtros de especialidade já é coberto pelo isCombinedFilter acima dinamicamente

        let finalLabelRQE = "Com RQE";

        if (!isCombinedFilter) {
            if (filters?.rqe === 'Sim') {
                formados = comRQE;
                if (noSpecificFilters && (!filters.ano || filters.ano === 'Todos')) {
                    formados = 250;
                    crmsAtivos = 288;
                    comRQE = 250;
                }
            } else if (filters?.rqe === 'Não') {
                finalLabelRQE = "Sem RQE";
                if (noSpecificFilters && (!filters.ano || filters.ano === 'Todos')) {
                    formados = 218;
                    crmsAtivos = 257;
                    comRQE = 218; // The user requested the third card to show 218 as well.
                } else if (noSpecificFilters && formaturasData[filters?.ano || 'Todos']) {
                    formados = formaturasData[filters?.ano || 'Todos'].total - formaturasData[filters?.ano || 'Todos'].rqe;
                    crmsAtivos = formaturasData[filters?.ano || 'Todos'].crms - rqeData[filters?.ano || 'Todos'].crms;
                    comRQE = formados; // Keep it consistent with total for 'Não'
                }
            }
        } else {
            if (filters?.rqe === 'Não') finalLabelRQE = "Sem RQE";
        }

        return [
            { label: "Total Formados", value: formados },
            { label: "CRMs Ativos", value: crmsAtivos },
            { label: finalLabelRQE, value: comRQE }
        ];
    }, [data, filters, totalData]);

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
