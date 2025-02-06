const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Configurações do middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(bodyParser.json());

// Importar rotas
const usuariosRoutes = require('./atendimento-laboratorial/routes/usuarios');
const pacientesRoutes = require('./atendimento-laboratorial/routes/pacientes');
const medicosRoutes = require('./atendimento-laboratorial/routes/medicos');
const examesRoutes = require('./atendimento-laboratorial/routes/exames');
const atendimentosRoutes = require('./atendimento-laboratorial/routes/atendimentos');
const atendimentosExamesRoutes = require('./atendimento-laboratorial/routes/atendimentos_exames');
const relatoriosRoutes = require('./atendimento-laboratorial/routes/relatorios');

// Usar as rotas
app.use('/usuarios', usuariosRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/medicos', medicosRoutes);
app.use('/exames', examesRoutes);
app.use('/atendimentos', atendimentosRoutes);
app.use('/atendimentos_exames', atendimentosExamesRoutes);
app.use('/relatorio', relatoriosRoutes);

// Testar conexão com o banco de dados
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
    console.log('Conexão com o banco de dados estabelecida');
    connection.release();
});

// Rota de teste de conexão
app.get('/teste', (req, res) => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao testar a conexão' });
        }
        res.status(200).json({ message: 'Conexão testada com sucesso!', results });
    });
});

// Rota de status do servidor
app.get('/status', (req, res) => {
    res.status(200).json({ message: 'Servidor está funcionando normalmente' });
});

// Rota principal
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bem-vindo ao Worklab Simplificado!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Iniciar o servidor
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});