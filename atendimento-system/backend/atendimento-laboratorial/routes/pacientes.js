const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Listar todos os pacientes
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
});

// ROTA: Criar um novo paciente
router.post('/', async (req, res) => {
    const { nome, sexo, data_nascimento, telefone, email, cpf } = req.body;

    if (!nome || !sexo || !data_nascimento || !telefone || !email || !cpf) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o CPF já existe
        const [existe] = await pool.query(
            'SELECT * FROM pacientes WHERE cpf = ?',
            [cpf]
        );

        if (existe.length > 0) {
            return res.status(400).json({ error: 'CPF já cadastrado.' });
        }

        // Cadastra o novo paciente
        const [result] = await pool.query(
            'INSERT INTO pacientes (nome, sexo, data_nascimento, telefone, email, cpf) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, sexo, data_nascimento, telefone, email, cpf]
        );

        res.status(201).json({ id: result.insertId, nome, sexo, data_nascimento, telefone, email, cpf });
    } catch (err) {
        console.error('Erro ao criar paciente:', err);
        res.status(500).json({ error: 'Erro ao criar paciente.' });
    }
});

// ROTA: Criar atendimento e associar exames
router.post('/atendimento', async (req, res) => {
    const { idpaciente, data_atendimento, crm, descricao_atendimento, exames } = req.body;

    if (!idpaciente || !data_atendimento || !crm || !descricao_atendimento || !exames || exames.length === 0) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Buscar ID do médico pelo CRM
        const [medico] = await connection.query('SELECT idmedico FROM medicos WHERE crm = ?', [crm]);
        if (medico.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Médico não encontrado.' });
        }
        const idmedico = medico[0].idmedico;

        // Criar atendimento
        const [atendimentoResult] = await connection.query(
            'INSERT INTO atendimentos (idpaciente, data_atendimento, idmedico, descricao_atendimento, status) VALUES (?, ?, ?, ?, ?)',
            [idpaciente, data_atendimento, idmedico, descricao_atendimento, 'Pendente']
        );
        const numeroAtendimento = atendimentoResult.insertId;

        // Associar exames ao atendimento
        for (const exame of exames) {
            await connection.query(
                'INSERT INTO atendimentos_exames (numero_atendimento, codigo_exame) VALUES (?, ?)',
                [numeroAtendimento, exame.codigo_exame]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Atendimento e exames cadastrados com sucesso.', numeroAtendimento });
    } catch (err) {
        console.error('Erro ao cadastrar atendimento e exames:', err);
        res.status(500).json({ error: 'Erro ao cadastrar atendimento e exames.' });
    }
});

module.exports = router;