const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Listar todos os exames
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM exames');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar exames:', err);
        res.status(500).json({ error: 'Erro ao buscar exames' });
    }
});

// ROTA: Buscar exame pelo código
router.get('/:codigo_exame', async (req, res) => {
    const { codigo_exame } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM exames WHERE codigo_exame = ?', [codigo_exame]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Exame não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar exame:', err);
        res.status(500).json({ error: 'Erro ao buscar exame' });
    }
});

// ROTA: Criar um novo exame
router.post('/', async (req, res) => {
    const { codigo_exame, nome, valor } = req.body;

    if (!codigo_exame || !nome || !valor) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o código do exame já existe
        const [existe] = await pool.query(
            'SELECT * FROM exames WHERE codigo_exame = ?',
            [codigo_exame]
        );

        if (existe.length > 0) {
            return res.status(400).json({ error: 'Código do exame já existe.' });
        }

        // Cadastra o novo exame
        const [result] = await pool.query(
            'INSERT INTO exames (codigo_exame, nome, valor) VALUES (?, ?, ?)',
            [codigo_exame, nome, valor]
        );

        res.status(201).json({ codigo_exame, nome, valor });
    } catch (err) {
        console.error('Erro ao criar exame:', err);
        res.status(500).json({ error: 'Erro ao criar exame.' });
    }
});

module.exports = router;