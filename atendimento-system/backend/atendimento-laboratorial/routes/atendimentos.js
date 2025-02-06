const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Criar atendimento e associar exames
router.post('/atendimento', async (req, res) => {
    const { idpaciente, data_atendimento, crm, descricao_atendimento, exames } = req.body;

    console.log('Dados recebidos no backend:', req.body); // Log para verificar os dados recebidos
    console.log('Exames recebidos:', exames); // Log específico para os exames

    if (!idpaciente || !data_atendimento || !crm || !descricao_atendimento) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, exceto os exames.' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        console.log('Verificando paciente no banco...');
        const [pacienteExistente] = await connection.query('SELECT idpaciente FROM pacientes WHERE idpaciente = ?', [idpaciente]);
        if (pacienteExistente.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Paciente não encontrado.' });
        }

        console.log('Verificando médico no banco...');
        const [medico] = await connection.query('SELECT idmedico FROM medicos WHERE crm = ?', [crm]);
        if (medico.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Médico não encontrado.' });
        }
        const idmedico = medico[0].idmedico;

        console.log('Inserindo atendimento no banco...');
        const [atendimentoResult] = await connection.query(
            'INSERT INTO atendimentos (idpaciente, data_atendimento, idmedico, descricao_atendimento, status) VALUES (?, ?, ?, ?, ?)',
            [idpaciente, data_atendimento, idmedico, descricao_atendimento, 'Pendente']
        );
        const numeroAtendimento = atendimentoResult.insertId;
        console.log(`Atendimento inserido com sucesso: ${numeroAtendimento}`);

        // Associar exames ao atendimento, se houver
        if (Array.isArray(exames) && exames.length > 0) {
            console.log(`Associando ${exames.length} exames ao atendimento ${numeroAtendimento}...`);
            for (const exame of exames) {
                await connection.query(
                    'INSERT INTO atendimentos_exames (numero_atendimento, codigo_exame) VALUES (?, ?)',
                    [numeroAtendimento, exame.codigo_exame]
                );
            }
        } else {
            console.log('Nenhum exame foi associado a este atendimento.');
        }

        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Atendimento e exames cadastrados com sucesso.', numeroAtendimento });
    } catch (err) {
        console.error('Erro ao cadastrar atendimento e exames:', err);
        res.status(500).json({ error: 'Erro ao cadastrar atendimento e exames.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.numero_atendimento, 
                a.data_atendimento, 
                p.nome AS paciente_nome, 
                p.cpf AS paciente_cpf,
                m.nome AS medico_nome, 
                m.crm AS medico_crm,
                a.descricao_atendimento, 
                a.status
            FROM atendimentos a
            JOIN pacientes p ON a.idpaciente = p.idpaciente
            JOIN medicos m ON a.idmedico = m.idmedico
            ORDER BY a.data_atendimento DESC
        `;

        const [rows] = await pool.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum atendimento encontrado.' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar atendimentos:', err);
        res.status(500).json({ error: 'Erro ao listar atendimentos.' });
    }
});

module.exports = router;