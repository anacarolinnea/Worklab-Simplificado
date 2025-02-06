import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Certifique-se de importar seu CSS

const Menu = () => {
    return (
        <nav className="menu-container">
            <div className="menu-column">
                <h3>Início</h3>
                <Link to="/">Página Inicial</Link>
            </div>

            <div className="menu-column">
                <h3>Configuração</h3>
                <Link to="/usuarios">Usuários</Link>
                <Link to="/medicos">Médicos</Link>
                <Link to="/exames">Exames</Link>
            </div>

            <div className="menu-column">
                <h3>Atendimento</h3>
                <Link to="/pacientes">Pacientes</Link>
                <Link to="/atendimentos">Atendimentos</Link>
                <Link to="/atendimentos_exames">Atendimentos_Exames</Link>
            </div>

            <div className="menu-column">
                <h3>Relatórios</h3>
                <Link to="/relatorios">Relatórios</Link>
            </div>
        </nav>
    );
};

export default Menu;