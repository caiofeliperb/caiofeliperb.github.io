import React, { useMemo, useState } from 'react';

const SocialTable = ({ data }) => {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const tableData = useMemo(() => {
        // Filter to only those with Ação Social and valid description
        return data.filter(d => d.faz_acao_social && d.descricao_acao_social && d.descricao_acao_social !== 'N/A');
    }, [data]);

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const currentData = tableData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div className="table-container">
            <h3 className="card-title">Detalhamento de Impacto Social</h3>

            {tableData.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <table className="social-table">
                            <thead>
                                <tr>
                                    <th>Eixo de Ação Social</th>
                                    <th>Descrição</th>
                                    <th>Ano Form.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((row, i) => (
                                    <tr key={i}>
                                        <td><span className="badge">{row.eixo_acao_social}</span></td>
                                        <td className="description-cell">{row.descricao_acao_social}</td>
                                        <td>{row.ano_formatura}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        >
                            Anterior
                        </button>
                        <span className="text-muted">Página {page + 1} de {Math.max(1, totalPages)}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-muted">Nenhum impacto social registrado para o filtro atual.</p>
            )}
        </div>
    );
};

export default SocialTable;
