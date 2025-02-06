import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CadastroExames from './CadastroExames'; // ✅ Deve estar no topo

const Exames = () => {
  const [exames, setExames] = useState([]);

  useEffect(() => {
    // Chama a API para buscar os exames ao carregar o componente
    axios.get("http://localhost:3002/exames")
      .then(response => {
        setExames(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar exames:", error);
      });
  }, []); // O array vazio [] significa que isso só será chamado uma vez, ao carregar o componente

  // Função para buscar um exame pelo código digitado
  const buscarExamePorCodigo = (codigoDigitado) => {
    console.log("Código digitado:", codigoDigitado);

    fetch(`http://localhost:3002/exames/${codigoDigitado}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Exame não encontrado');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // Aqui, você pode preencher os dados no formulário, se necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Lista de Exames</h2>
      {/* Você pode utilizar a função buscarExamePorCodigo em algum input ou evento */}
      <CadastroExames /> {/* Formulário de cadastro de exames */}
      <table border="1">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {exames.map((exame) => (
            <tr key={exame.codigo_exame}>
              <td>{exame.codigo_exame}</td>
              <td>{exame.nome}</td>
              <td>R$ {exame.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Exames;