import React, { useState, useEffect } from 'react';
import '../styles.css'; // Importando os estilos globais

const Pacientes = () => {
    const [form, setForm] = useState({ nome: '', sexo: '', data_nascimento: '', telefone: '', email: '', cpf: '', crm: '' });
    const [medico, setMedico] = useState({ idmedico: '', nome: '' });
    const [exames, setExames] = useState([]);
    const [novoExame, setNovoExame] = useState({ codigo_exame: '', nome: '', valor: '' });

    const buscarMedicoPorCRM = async () => {
        if (!form.crm) return;
        try {
            const response = await fetch(`http://localhost:3002/medicos/${form.crm}`);
            if (response.ok) {
                const data = await response.json();
                setMedico({ idmedico: data.idmedico, nome: data.nome });
            } else {
                alert('Médico não encontrado. Verifique o CRM.');
            }
        } catch (error) {
            console.error('Erro ao buscar médico:', error);
        }
    };

    const buscarExamePorCodigo = async () => {
        if (!novoExame.codigo_exame) return;
        try {
            const response = await fetch(`http://localhost:3002/exames/${novoExame.codigo_exame}`);
            if (response.ok) {
                const exame = await response.json();
                setNovoExame({ ...novoExame, nome: exame.nome, valor: exame.valor });
            } else {
                alert('Exame não encontrado. Preencha os campos manualmente.');
            }
        } catch (error) {
            console.error('Erro ao buscar exame:', error);
        }
    };

    const adicionarExame = () => {
        if (!novoExame.codigo_exame || !novoExame.nome || !novoExame.valor) {
            alert('Todos os campos do exame são obrigatórios.');
            return;
        }
        setExames([...exames, novoExame]);
        setNovoExame({ codigo_exame: '', nome: '', valor: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.sexo || !form.data_nascimento || !form.telefone || !form.email || !form.cpf || !form.crm) {
            alert('Todos os campos do paciente e do médico são obrigatórios.');
            return;
        }

        try {
            // Cadastrar paciente
            const pacienteResponse = await fetch('http://localhost:3002/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!pacienteResponse.ok) {
                const errorData = await pacienteResponse.json();
                alert(`Erro ao cadastrar paciente: ${errorData.error}`);
                return;
            }

            const pacienteData = await pacienteResponse.json();
            const idpaciente = pacienteData.id; // ID do paciente cadastrado

            // Cadastrar atendimento
            const atendimentoResponse = await fetch('http://localhost:3002/atendimentos/atendimento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idpaciente: idpaciente,
                    data_atendimento: new Date().toISOString().split('T')[0], // Data atual
                    crm: form.crm,
                    descricao_atendimento: "Atendimento registrado",
                    exames: exames.length > 0 ? exames : [],
                }),
            });

            if (!atendimentoResponse.ok) {
                const errorData = await atendimentoResponse.json();
                alert(`Erro ao cadastrar atendimento: ${errorData.error}`);
                return;
            }

            alert('Paciente e atendimento cadastrados com sucesso!');
            setForm({ nome: '', sexo: '', data_nascimento: '', telefone: '', email: '', cpf: '', crm: '' });
            setExames([]);

        } catch (error) {
            console.error('Erro ao cadastrar atendimento:', error);
            alert('Erro ao cadastrar atendimento. Tente novamente.');
        }
    };

    return (
        <div className="pacientes-container">
            <h2>Cadastro de Pacientes</h2>

            {/* DADOS DO PACIENTE */}
            <h3>Dados do Paciente</h3>
            <div className="form-section">
                <div className="form-group">
                    <label>Nome:</label>
                    <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Sexo:</label>
                    <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Data de Nascimento:</label>
                    <input type="date" value={form.data_nascimento} onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Telefone:</label>
                    <input type="text" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>CPF:</label>
                    <input type="text" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
                </div>
            </div>

            {/* DADOS DO MÉDICO */}
            <h3>Dados do Médico</h3>
            <div className="form-group">
                <label>CRM do Médico:</label>
                <input type="text" value={form.crm} onChange={(e) => setForm({ ...form, crm: e.target.value })} onBlur={buscarMedicoPorCRM} />
            </div>
            <p>Médico selecionado: {medico.nome}</p>

            {/* ADICIONAR EXAMES */}
            <h3>Adicionar Exame</h3>
            <div className="form-section">
                <div className="form-group">
                    <label>Código do Exame:</label>
                    <input type="text" value={novoExame.codigo_exame} onChange={(e) => setNovoExame({ ...novoExame, codigo_exame: e.target.value })} onBlur={buscarExamePorCodigo} />
                </div>
                <div className="form-group">
                    <label>Nome do Exame:</label>
                    <input type="text" value={novoExame.nome} onChange={(e) => setNovoExame({ ...novoExame, nome: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Valor do Exame:</label>
                    <input type="text" value={novoExame.valor} onChange={(e) => setNovoExame({ ...novoExame, valor: e.target.value })} />
                </div>
            </div>
            <button type="button" onClick={adicionarExame}>Adicionar Exame</button>

            <h3>Exames Adicionados</h3>
            <ul>
                {exames.map((exame, index) => (
                    <li key={index}>{exame.nome} - R$ {exame.valor}</li>
                ))}
            </ul>

            <button type="submit" onClick={handleSubmit}>Cadastrar Paciente e Atendimento</button>
        </div>
    );
};

export default Pacientes;
