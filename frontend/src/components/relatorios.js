import React, { useState } from 'react';

const Relatorios = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [relatorio, setRelatorio] = useState(null);
    const [erro, setErro] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);

        if (!dataInicio || !dataFim) {
            setErro("As datas de início e fim são obrigatórias.");
            return;
        }

        const url = `http://localhost:3002/relatorio/?data_inicio=${dataInicio}&data_fim=${dataFim}`;
        console.log('Fazendo requisição para:', url);

        try {
            const response = await fetch(url);

            console.log('Resposta recebida:', response);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Resultado:', result);

            setRelatorio(result.relatorio || []);
        } catch (err) {
            console.error('Erro na requisição:', err);
            setErro('Erro ao buscar os dados. Verifique se o backend está rodando.');
        }
    };

    return (
        <div>
            <h1>Relatório de Atendimentos e Exames</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Data Início:</label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>

                <div>
                    <label>Data Fim:</label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>

                <button type="submit">Gerar Relatório</button>
                <button
                    type="button"
                    onClick={() => {
                        setDataInicio('');
                        setDataFim('');
                        setRelatorio(null);
                        setErro(null);
                    }}
                >
                    Limpar
                </button>
            </form>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {relatorio && relatorio.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Número Atendimento</th>
                            <th>Data Atendimento</th>
                            <th>Paciente</th>
                            <th>Exame</th>
                            <th>Tipo Exame</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relatorio.map((item) => (
                            <tr key={item.numero_atendimento}>
                                <td>{item.numero_atendimento}</td>
                                <td>{item.data_atendimento}</td>
                                <td>{item.paciente_nome}</td>
                                <td>{item.exame_nome}</td>
                                <td>{item.exame_tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum resultado encontrado.</p>
            )}
        </div>
    );
};

export default Relatorios;