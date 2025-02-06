const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Listar todos os exames de atendimentos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM atendimentos_exames');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar exames de atendimentos:', err);
    res.status(500).json({ error: 'Erro ao buscar exames de atendimentos' });
  }
});

// ROTA: Associar um exame a um atendimento
router.post('/', async (req, res) => {
  const { numero_atendimento, codigo_exame } = req.body;

  // Validação simples para verificar se os dados estão sendo enviados
  if (!numero_atendimento || !codigo_exame) {
    return res.status(400).json({ error: 'Número de atendimento e código do exame são obrigatórios.' });
  }

  try {
    // Verificar se o atendimento existe
    const [atendimentoExistente] = await pool.query('SELECT 1 FROM atendimentos WHERE numero_atendimento = ?', [numero_atendimento]);
    if (atendimentoExistente.length === 0) {
      return res.status(404).json({ error: 'Atendimento não encontrado.' });
    }

    // Verificar se o exame existe
    const [exameExistente] = await pool.query('SELECT 1 FROM exames WHERE codigo_exame = ?', [codigo_exame]);
    if (exameExistente.length === 0) {
      return res.status(404).json({ error: 'Exame não encontrado.' });
    }

    // Associar o exame ao atendimento
    await pool.query(
      'INSERT INTO atendimentos_exames (numero_atendimento, codigo_exame) VALUES (?, ?)',
      [numero_atendimento, codigo_exame]
    );

    res.status(201).json({ message: 'Exame associado ao atendimento com sucesso!' });
  } catch (err) {
    console.error('Erro ao associar exame ao atendimento:', err);
    res.status(500).json({ error: 'Erro ao associar exame ao atendimento' });
  }
});

module.exports = router;