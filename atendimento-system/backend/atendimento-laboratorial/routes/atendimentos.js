const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Criar atendimento e associar exames
router.post('/atendimento', async (req, res) => {
    const { idpaciente, data_atendimento, crm, descricao_atendimento, exames } = req.body;

    console.log('📢 Dados recebidos no backend:', req.body); // Log para verificar os dados recebidos

    if (!idpaciente || !data_atendimento || !crm || !descricao_atendimento) {
        console.log('❌ Campos obrigatórios ausentes.');
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, exceto os exames.' });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        console.log('🔍 Verificando paciente no banco...');
        const [pacienteExistente] = await connection.query('SELECT idpaciente FROM pacientes WHERE idpaciente = ?', [idpaciente]);
        if (pacienteExistente.length === 0) {
            console.log('❌ Paciente não encontrado.');
            throw new Error('Paciente não encontrado.');
        }

        console.log('🔍 Verificando médico no banco...');
        const [medico] = await connection.query('SELECT idmedico FROM medicos WHERE crm = ?', [crm]);
        if (medico.length === 0) {
            console.log('❌ Médico não encontrado.');
            throw new Error('Médico não encontrado.');
        }
        const idmedico = medico[0].idmedico;

        console.log('✅ Inserindo atendimento no banco...');
        const [atendimentoResult] = await connection.query(
            'INSERT INTO atendimentos (idpaciente, data_atendimento, idmedico, descricao_atendimento, status) VALUES (?, ?, ?, ?, ?)',
            [idpaciente, data_atendimento, idmedico, descricao_atendimento, 'Pendente']
        );
        const numeroAtendimento = atendimentoResult.insertId; // ✅ Pega o ID gerado automaticamente
        console.log(`✅ Atendimento inserido com sucesso: ${numeroAtendimento}`);

        // **Verifica se há exames antes de inserir**
        if (Array.isArray(exames) && exames.length > 0) {
            console.log(`✅ Associando ${exames.length} exames ao atendimento ${numeroAtendimento}...`);
            for (const exame of exames) {
                if (!exame.codigo_exame) {
                    console.log('⚠️ Exame inválido encontrado, ignorando...');
                    continue;
                }
                await connection.query(
                    'INSERT INTO atendimentos_exames (numero_atendimento, codigo_exame) VALUES (?, ?)',
                    [numeroAtendimento, exame.codigo_exame]
                );
            }
        } else {
            console.log('⚠️ Nenhum exame foi associado.');
        }

        await connection.commit();
        res.status(201).json({ message: 'Atendimento e exames cadastrados com sucesso.', numeroAtendimento });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('❌ Erro ao cadastrar atendimento e exames:', err);
        res.status(500).json({ error: err.message || 'Erro ao cadastrar atendimento e exames.' });
    } finally {
        if (connection) connection.release();
    }
});

// ROTA: Listar todos os atendimentos
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
            console.log('⚠️ Nenhum atendimento encontrado.');
            return res.status(404).json({ message: 'Nenhum atendimento encontrado.' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error('❌ Erro ao listar atendimentos:', err);
        res.status(500).json({ error: 'Erro ao listar atendimentos.' });
    }
});

module.exports = router;