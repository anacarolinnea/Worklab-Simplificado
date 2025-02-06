import React, { useEffect, useState } from "react";
import axios from "axios";

const AtendimentosExames = () => {
    const [atendimentosExames, setAtendimentosExames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAtendimentosExames = async () => {
            try {
                const response = await axios.get("http://localhost:3002/atendimentos_exames");
                setAtendimentosExames(response.data);
            } catch (err) {
                setError("Erro ao buscar atendimentos_exames");
                console.error("Erro ao buscar atendimentos_exames:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAtendimentosExames();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Atendimentos - Exames</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>numero_atendimento</th>
                        <th>codigo_exame</th>
                    </tr>
                </thead>
                <tbody>
                    {atendimentosExames.map((item) => (
                        <tr key={item.numero_atendimento}>
                            <td>{item.numero_atendimento}</td>
                            <td>{item.codigo_exame}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AtendimentosExames;