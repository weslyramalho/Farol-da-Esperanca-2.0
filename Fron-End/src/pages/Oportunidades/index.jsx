import { useState } from "react";
import logo from "../../assets/img/logo.png"

import "./oportunidades.css";

import { faArrowRight, faBriefcase, faBuilding, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";

const Oportunidades = () => {
 const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        if (searchTerm.trim()) {
            // Redireciona para a página de listagem de vagas com o termo de pesquisa
            navigate(`/vagas-em-aberto?termo=${encodeURIComponent(searchTerm)}`);
        } else {
            // Se a pesquisa estiver vazia, apenas redireciona para a listagem completa
            navigate('/vagas-em-aberto');
        }
    };

    return (
        <div className="home-container">
            {/* Seção Hero/Banner */}
            <section className="hero-section">
                <div className="hero-content">
                    <img src={logo} alt="Logo do Portal" className="hero-logo" />
                    <h1>Encontre a Vaga Perfeita para Você ou o Talento Ideal para Sua Empresa</h1>
                    <p className="hero-subtitle">Conectando profissionais e oportunidades.</p>

                    {/* Barra de Pesquisa Rápida */}
                    <form onSubmit={handleSearch} className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar vagas por título, empresa ou local..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>

                    <div className="hero-buttons">
                        <Link to="/vagas-em-aberto" className="btn btn-hero-primary">
                            <FontAwesomeIcon icon={faBriefcase} className="me-2" /> Explorar Vagas
                        </Link>
                        <Link to="/empresa/vagas/nova" className="btn btn-hero-secondary">
                            <FontAwesomeIcon icon={faBuilding} className="me-2" /> Publicar Vaga
                        </Link>
                    </div>
                </div>
            </section>

            {/* Seção de Destaques/Como Funciona */}
            <section className="how-it-works-section">
                <h2>Como o Portal Forol da Esperança te Ajuda?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Para Candidatos</h3>
                        <p>Encontre vagas alinhadas ao seu perfil, salve favoritas e acompanhe suas candidaturas.</p>
                        <Link to="/registro" className="btn-link-action">
                            Crie seu Perfil <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                    <div className="feature-card">
                        <h3>Para Empresas</h3>
                        <p>Publique suas vagas, gerencie candidaturas e encontre os melhores talentos.</p>
                        <Link to="/registro" className="btn-link-action">
                            Cadastre sua Empresa <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                    <div className="feature-card">
                        <h3>Conexão Direta</h3>
                        <p>Simplificamos o processo de recrutamento e seleção para ambos os lados.</p>
                        <Link to="/sobrenos" className="btn-link-action">
                            Saiba Mais <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Seção de Chamada para Ação Final */}
            <section className="cta-section">
                <h2>Pronto para Começar?</h2>
                <div className="cta-buttons">
                    <Link to="/vagas-em-aberto" className="btn btn-cta">
                        Ver Todas as Vagas
                    </Link>
                    <Link to="/registro" className="btn btn-cta-outline">
                        Cadastre-se Já!
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Oportunidades;
