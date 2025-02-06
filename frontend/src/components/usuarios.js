import React, { useEffect, useState } from "react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    idusuarios: '',
    nome_usuarios: '',
    nome: '',
    email: '',
    senha: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Para controlar o modo de edição

  useEffect(() => {
    // Carrega a lista de usuários
    fetch("http://localhost:3002/usuarios")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("Erro: os dados recebidos não são um array");
        }
      })
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }, []);

  // Função para lidar com alterações no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar ou editar usuário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Se está editando, faz um PUT, senão, um POST
    const url = isEditing
      ? `http://localhost:3002/usuarios/${formData.idusuarios}`
      : "http://localhost:3002/usuarios";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isEditing) {
          // Atualiza a lista de usuários
          setUsuarios(
            usuarios.map((usuario) =>
              usuario.idusuarios === formData.idusuarios ? data : usuario
            )
          );
        } else {
          setUsuarios([...usuarios, data]); // Adiciona o novo usuário à lista
        }

        // Limpa o formulário
        setFormData({
          idusuarios: '',
          nome_usuarios: '',
          nome: '',
          email: '',
          senha: ''
        });
        setIsEditing(false); // Limpa o modo de edição
      })
      .catch((error) => console.error("Erro ao salvar usuário:", error));
  };

  // Função para ativar o modo de edição
  const handleEdit = (usuario) => {
    setFormData(usuario);
    setIsEditing(true);
  };

  return (
    <div>
      <h2>{isEditing ? "Editar Usuário" : "Cadastrar Novo Usuário"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            name="nome_usuarios"
            value={formData.nome_usuarios}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">
          {isEditing ? "Salvar Alterações" : "Cadastrar Usuário"}
        </button>
      </form>

      <h3>Lista de Usuários</h3>
      {usuarios.length === 0 ? (
        <p>Não há usuários cadastrados.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>idusuarios</th>
              <th>nome_usuarios</th>
              <th>nome</th>
              <th>email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.idusuarios}>
                <td>{usuario.idusuarios}</td>
                <td>{usuario.nome_usuarios}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <button onClick={() => handleEdit(usuario)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Usuarios;