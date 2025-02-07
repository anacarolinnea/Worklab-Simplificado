import React, { useEffect, useState } from "react";
import axios from "axios";

const Atendimentos = () => {
    const [atendimentos, setAtendimentos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3002/atendimentos")
            .then(response => {
                setAtendimentos(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar atendimentos:", error);
                setError("Erro ao buscar atendimentos.");
            });
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Lista de Atendimentos</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Número Atendimento</th>
                        <th>Paciente</th>
                        <th>Data Atendimento</th>
                        <th>Médico (CRM)</th>
                        <th>Descrição</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {atendimentos.map((atendimento) => (
                        <tr key={atendimento.numero_atendimento}>
                            <td>{atendimento.numero_atendimento}</td>
                            <td>{atendimento.paciente_nome}</td>
                            <td>{new Date(atendimento.data_atendimento).toLocaleDateString()}</td>
                            <td>{atendimento.medico_nome} (CRM: {atendimento.medico_crm})</td>
                            <td>{atendimento.descricao_atendimento}</td>
                            <td>{atendimento.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Atendimentos;