import React, { useState } from 'react';

const SocialTable = () => {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    // Hardcoded as requested
    const tableData = [
        { eixo: "Atenção Primária", desc: "Tutor da atenção primária", impacto: "Apoio à formação local" },
        { eixo: "Atenção Primária", desc: "Programa Mais Médicos", impacto: "Expansão do acesso médico" },
        { eixo: "Gestão/Política Pública", desc: "Prefeito do Município de Pilões-RN", impacto: "Liderança em saúde" },
        { eixo: "Gestão/Política Pública", desc: "Diretor Técnico do Hospital Regional Tarcísio Maia", impacto: "Gestão de alta complexidade" },
        { eixo: "Gestão/Política Pública", desc: "Diretor Técnico de Hospital", impacto: "Otimização de recursos" },
        { eixo: "Gestão/Política Pública", desc: "Trabalhei com Gestão e Auditoria em UTI em Limoeiro do Norte", impacto: "Controle e auditoria" },
        { eixo: "Gestão/Política Pública", desc: "Diretor Técnico de 02 Hospitais Municipais", impacto: "Gestão em rede" },
        { eixo: "Organização de Serviços", desc: "Construção de fluxo COVID na pandemia", impacto: "Resposta a crises sanitárias" },
        { eixo: "Organização de Serviços", desc: "Fluxograma de pacientes com Doença Renal Crônica", impacto: "Padronização do cuidado" },
        { eixo: "Saúde Pública", desc: "Kim na Escola (Projeto de redução de óbitos por afogamento)", impacto: "Prevenção e salvamento" },
        { eixo: "Saúde Pública", desc: "Projeto Recife Cuida", impacto: "Atenção à comunidade" },
        { eixo: "Saúde Pública", desc: "Projeto RN + Coração", impacto: "Cuidado cardiovascular" },
        { eixo: "Voluntariado", desc: "Voluntariado através de uma ONG em Moçambique", impacto: "Assistência humanitária" },
        { eixo: "Voluntariado", desc: "Trabalho voluntário na APAE de Pau dos Ferros", impacto: "Inclusão e apoio" }
    ];

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const currentData = tableData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div className="table-container">
            <h3 className="card-title">Detalhamento de Impacto Social</h3>

            <div className="table-wrapper">
                <table className="social-table">
                    <thead>
                        <tr>
                            <th>Eixo de Ação Social</th>
                            <th>Descrição</th>
                            <th>Impacto Gerado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, i) => (
                            <tr key={i}>
                                <td><span className="badge">{row.eixo}</span></td>
                                <td className="description-cell">{row.desc}</td>
                                <td>{row.impacto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(prev => Math.max(0, prev - 1))}>Anterior</button>
                <span className="text-muted">Página {page + 1} de {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}>Próxima</button>
            </div>
        </div>
    );
};

export default SocialTable;
