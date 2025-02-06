const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Conexão com o banco de dados

// ROTA: Gerar relatório de atendimentos com exames
rrouter.get('/', async (req, res) => {
    const { data_inicio, data_fim } = req.query;

    console.log('📌 Requisição recebida para relatório');
    console.log(`➡️ Data Início: ${data_inicio}, Data Fim: ${data_fim}`);

    if (!data_inicio || !data_fim) {
        console.error('❌ ERRO: Datas não fornecidas');
        return res.status(400).json({ error: 'As datas de início e fim são obrigatórias' });
    }

    const query = `
        SELECT 
            a.numero_atendimento, 
            a.data_atendimento, 
            p.nome AS paciente_nome, 
            IFNULL(e.nome, 'Sem Exame') AS exame_nome,
            IFNULL(e.valor, 0) AS exame_valor
        FROM atendimentos a
        JOIN pacientes p ON a.idpaciente = p.idpaciente
        LEFT JOIN atendimentos_exames ae ON a.numero_atendimento = ae.numero_atendimento
        LEFT JOIN exames e ON ae.codigo_exame = e.codigo_exame
        WHERE a.data_atendimento BETWEEN ? AND ?
        ORDER BY a.data_atendimento;
    `;

    console.log('📌 Executando consulta no MySQL...');

    try {
        const [results] = await pool.query(query, [data_inicio, data_fim]);

        console.log(`✅ Consulta executada. Registros encontrados: ${results.length}`);

        if (results.length === 0) {
            console.log('⚠️ Nenhum dado encontrado para o período.');
            return res.status(404).json({ message: 'Nenhum dado encontrado para esse período.' });
        }

        console.log('✅ Enviando resposta para o frontend');
        return res.status(200).json({ relatorio: results });
    } catch (err) {
        console.error('❌ ERRO no MySQL:', err);
        return res.status(500).json({ error: 'Erro ao gerar o relatório.' });
    }
});

module.exports = router;