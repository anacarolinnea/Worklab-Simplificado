import React, { useState } from 'react';
import axios from 'axios';

const CadastroExames = () => {
  const [codigoExame, setCodigoExame] = useState('');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se todos os campos foram preenchidos
    if (!codigoExame || !nome || !valor) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    // Envia os dados para o backend
    axios.post('http://localhost:3002/exames', { codigo_exame: codigoExame, nome, valor })
      .then((response) => {
        console.log('Exame cadastrado:', response.data);
        setCodigoExame('');
        setNome('');
        setValor('');
        setErro('');
        setSucesso('Exame cadastrado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar exame:', error);
        setErro('Erro ao cadastrar exame. Tente novamente.');
        setSucesso('');
      });
  };

  return (
    <div>
      <h2>Cadastrar Exame</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>} {/* Exibe mensagem de erro se houver */}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>} {/* Exibe mensagem de sucesso */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="codigoExame">Código do Exame:</label>
          <input
            type="text"
            id="codigoExame"
            value={codigoExame}
            onChange={(e) => setCodigoExame(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="nome">Nome do Exame:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="valor">Valor:</label>
          <input
            type="text"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroExames;