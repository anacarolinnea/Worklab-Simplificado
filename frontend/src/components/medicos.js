import React, { useState, useEffect } from "react";

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({ nome: "", crm: "" });

  useEffect(() => {
    fetch("http://localhost:3002/medicos")
      .then((res) => res.json())
      .then((data) => setMedicos(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3002/medicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => window.location.reload());
  };

  const buscarMedicoPorCRM = (crmDigitado) => {
    fetch(`http://localhost:3002/medicos/buscar-medico?crm=${crmDigitado}`) // ✅ Agora está correto
      .then((res) => {
        if (!res.ok) {
          throw new Error('Médico não encontrado');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Médico encontrado:', data);
        // Aqui você pode preencher automaticamente os campos no formulário
      })
      .catch((error) => {
        console.error('Erro ao buscar médico:', error.message);
      });
};

  return (
    <div>
      <h2>Médicos</h2>
      {/* Você pode adicionar um campo e um botão para chamar a função buscarMedicoPorCRM */}
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required />
        <input name="crm" placeholder="CRM" onChange={handleChange} required />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {medicos.map((medico) => (
          <li key={medico.idmedico}>{medico.nome} - {medico.crm}</li>
        ))}
      </ul>
    </div>
  );
};

export { Medicos };