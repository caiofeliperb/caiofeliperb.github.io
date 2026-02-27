import React, { createContext, useState, useEffect } from 'react';
import { csvParse } from 'd3-dsv';
import rawData from '../data/data.csv?raw';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Parse the data on mount using d3's csvParse against the raw string
        try {
            const parsedData = csvParse(rawData, (d) => ({
                id_egresso: +d.id_egresso,
                ano_formatura: +d.ano_formatura,
                respondeu_formulario: d.respondeu_formulario === 'Sim',
                tem_rqe: d.tem_rqe === 'Sim',
                grande_area_rqe: d.grande_area_rqe,
                especialidade_rqe: d.especialidade_rqe,
                uf_atuacao_cfm: d.uf_atuacao_cfm,
                cidade_atuacao_form: d.cidade_atuacao_form,
                atua_educacao_medica: d.atua_educacao_medica,
                faz_acao_social: d.faz_acao_social === 'Sim',
                eixo_acao_social: d.eixo_acao_social,
                descricao_acao_social: d.descricao_acao_social
            }));

            console.log(`Loaded ${parsedData.length} records.`);
            setData(parsedData);
        } catch (err) {
            console.error("Error parsing CSV data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <DataContext.Provider value={{ data, loading }}>
            {children}
        </DataContext.Provider>
    );
};
