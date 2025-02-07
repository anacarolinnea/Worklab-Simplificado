## Worklab Simplificado 🏥💻
🚀 Sobre o Projeto
O Worklab Simplificado é um sistema para gestão de atendimentos laboratoriais, permitindo:

Cadastro de usuarios, pacientes, médicos e exames.
Registro de atendimentos, associando médicos e exames aos pacientes.
Geração de relatórios para acompanhamento dos atendimentos.
Interface intuitiva construída com React.js e backend em Node.js com banco de dados MySQL.
🛠 Tecnologias Utilizadas
Frontend: React.js
Backend: Node.js + Express.js
Banco de Dados: MySQL
Gerenciamento de Estado: React Hooks (useState, useEffect)
Estilização: CSS Puro


📦 Como Instalar e Executar o Projeto
1️⃣ Clone o Repositório
git clone https://github.com/SEU_USUARIO/worklab-simplificado.git

2️⃣ Instale as Dependências
# Acesse a pasta do backend e instale as dependências
cd worklab-simplificado/backend
npm install

# Acesse a pasta do frontend e instale as dependências
cd ../frontend
npm install


3️⃣ Configure o Banco de Dados MySQL
Crie o banco de dados no MySQL:
CREATE DATABASE atendimento_db;
Configure a conexão no arquivo .env:
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=atendimento_db


Execute as tabelas no MySQL:
USE atendimento_db;
CREATE TABLE pacientes (...);
CREATE TABLE medicos (...);
CREATE TABLE exames (...);
CREATE TABLE atendimentos (...);
CREATE TABLE atendimentos_exames (...);


▶️ Executando o Projeto
Backend
cd backend
node app.js
Frontend
cd frontend
npm start
O sistema estará disponível em:

Frontend: http://localhost:3000
Backend: http://localhost:3002
