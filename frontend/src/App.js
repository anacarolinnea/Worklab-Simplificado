import './styles.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import AtendimentosExames from "./components/atendimentos_exames";
import Exames from "./components/exames";
import Atendimentos from "./components/atendimentos";
import { Medicos } from "./components/medicos";
import Pacientes from "./components/pacientes";
import Usuarios from "./components/usuarios";
import Relatorios from "./components/relatorios"; 

// Tela inicial
function Home() {
    return (
        <div className="container">
            <h2>Bem-vindo ao Worklab Simplificado</h2>
            <p>Escolha uma opção no menu para começar.</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div>
                <h1 className="titulo-principal">Worklab Simplificado</h1>
                <Menu />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/medicos" element={<Medicos />} />
                        <Route path="/pacientes" element={<Pacientes />} />
                        <Route path="/atendimentos" element={<Atendimentos />} />
                        <Route path="/exames" element={<Exames />} />
                        <Route path="/atendimentos_exames" element={<AtendimentosExames />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;