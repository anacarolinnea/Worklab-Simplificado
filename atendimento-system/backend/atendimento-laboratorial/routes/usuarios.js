const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ROTA: Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// ROTA: Criar um novo usuário
router.post('/', async (req, res) => {
  const { nome_usuarios, nome, email, senha } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome_usuarios, nome, email, senha) VALUES (?, ?, ?, ?)',
      [nome_usuarios, nome, email, senha]
    );
    res.status(201).json({ idusuarios: result.insertId, nome_usuarios, nome, email });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// ROTA: Editar um usuário existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_usuarios, nome, email, senha } = req.body;

  if (!nome_usuarios || !nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Atualiza os dados do usuário
    const [result] = await pool.query(
      'UPDATE usuarios SET nome_usuarios = ?, nome = ?, email = ?, senha = ? WHERE idusuarios = ?',
      [nome_usuarios, nome, email, senha, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ idusuarios: id, nome_usuarios, nome, email });
  } catch (err) {
    console.error('Erro ao editar usuário:', err);
    res.status(500).json({ error: 'Erro ao editar usuário.' });
  }
});

module.exports = router;