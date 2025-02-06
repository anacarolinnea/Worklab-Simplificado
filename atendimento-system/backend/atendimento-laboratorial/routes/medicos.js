const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Listar todos os médicos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM medicos');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar médicos:', err);
        res.status(500).json({ error: 'Erro ao buscar médicos' });
    }
});

// ROTA: Buscar médico pelo CRM
router.get('/:crm', async (req, res) => {
    const { crm } = req.params;

    if (!crm) {
        return res.status(400).json({ error: 'Informe o CRM do médico.' });
    }

    try {
        // Corrigido a query que estava fora de lugar
        const [results] = await pool.query('SELECT idmedico, nome FROM medicos WHERE crm = ?', [crm]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Médico não encontrado.' });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Erro ao buscar médico:', err);
        res.status(500).json({ error: 'Erro ao buscar médico.' });
    }
});

// ROTA: Criar um novo médico
router.post('/', async (req, res) => {
    const { nome, crm } = req.body;

    if (!nome || !crm) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o CRM já existe
        const [existe] = await pool.query('SELECT * FROM medicos WHERE crm = ?', [crm]);

        if (existe.length > 0) {
            return res.status(400).json({ error: 'CRM já cadastrado.' });
        }

        // Cadastra o novo médico
        const [result] = await pool.query('INSERT INTO medicos (nome, crm) VALUES (?, ?)', [nome, crm]);

        res.status(201).json({ idmedico: result.insertId, nome, crm });
    } catch (err) {
        console.error('Erro ao cadastrar médico:', err);
        res.status(500).json({ error: 'Erro ao cadastrar médico.' });
    }
});

module.exports = router;
