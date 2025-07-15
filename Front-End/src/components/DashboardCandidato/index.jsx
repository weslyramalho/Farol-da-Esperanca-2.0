import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardCandidato.css'; // Opcional: Crie este arquivo CSS para estilização
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserCircle,   // Ícone de usuário para o perfil
    faFileAlt,      // Ícone para currículo
    faBookmark,     // Ícone para vagas salvas
    faBriefcase,    // Ícone para candidaturas/vagas em geral
    faCog,          // Ícone para configurações/editar perfil
    faSignOutAlt,   // Ícone para sair (logout)
    faSpinner,      // Ícone de carregamento
    faCheckCircle,  // Ícone de check para currículo completo
    faEye           // Ícone para visualizar
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth ';


const DashboardCandidato = () => {
    // Estados para exibir informações do perfil do candidato
    const [nome, setNome] = useState('Carregando...');
    const [email, setEmail] = useState('Carregando...');
    const [perfilCandidatoData, setPerfilCandidatoData] = useState(null); // Para guardar dados específicos do Candidato

    // Estados de UI e feedback
    const [isLoadingData, setIsLoadingData] = useState(true); // Indica se os dados iniciais estão sendo carregados
    const [error, setError] = useState(''); // Mensagem de erro, se houver

    // Hooks de navegação e autenticação (do contexto)
    const navigate = useNavigate();
    const { authToken, userRoles, logout } = useAuth(); // Obtém o token, roles e função logout do contexto

    console.log(userRoles)

    // useEffect para buscar os dados do usuário/candidato quando o componente é montado ou o token muda
    useEffect(() => {
        const fetchUserData = async () => {
            // Verifica se o token de autenticação existe.
            // O ProtectedRoute já faz isso, mas é uma boa prática ter um fallback e limpar o estado.
            if (!authToken) {
                console.log("DashboardCandidato: Token não encontrado, redirecionando para login.");
                navigate('/login');
                return;
            }

            setIsLoadingData(true); // Inicia o estado de carregamento dos dados
            setError('');           // Limpa qualquer erro anterior

            try {
                // Faz a requisição ao backend para obter os detalhes do usuário logado (incluindo perfil)
                const response = await fetch('http://201.23.66.57:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}` // Envia o token JWT no cabeçalho Authorization
                    }
                });

                if (response.ok) {
                    const userData = await response.json(); // Pega os dados do usuário e seu perfil
                    console.log("DashboardCandidato: Dados do usuário logado recebidos:", userData);

                    // Verifica se o perfil retornado é de um candidato e se há dados específicos
                    if (userData.perfilTipo === 'candidato' && userData.perfilData) {
                        // Atualiza os estados com os dados do perfil do candidato
                        setNome(userData.perfilData.nome || userData.username || 'Candidato'); // Prioriza nome do perfil, senão username
                        setEmail(userData.email || 'email@exemplo.com');
                        setPerfilCandidatoData(userData.perfilData); // Armazena todos os dados do perfil de candidato

                        // Opcional: Se precisar de dados de vagas, candidaturas etc., buscaria aqui
                        // Ex: const vagasResponse = await fetch('http://localhost:8080/api/vagas/recomendadas', { ... });

                    } else if (userData.perfilTipo === 'empresa' && userData.perfilData) {
                        // Se o usuário logado for uma empresa, e estiver no dashboard de candidato, é um erro.
                        console.warn("DashboardCandidato: Usuário é empresa, redirecionando para dashboard correto.");
                        // Desloga e redireciona para evitar acesso indevido ou página errada
                        logout(); 
                        navigate('/login'); // Ou para /empresa/dashboard diretamente se o ProtectedRoute permitir
                    } else {
                        // Caso o perfil não seja reconhecido ou esteja incompleto
                        setError('Seu perfil não é de candidato ou está incompleto. Redirecionando...');
                        console.warn("DashboardCandidato: Perfil não reconhecido ou incompleto.");
                        logout(); // Força logout e limpa o token
                        navigate('/login');
                    }

                } else if (response.status === 401 || response.status === 403) {
                    // Se o token for inválido/expirado ou acesso proibido, desloga
                    console.error("DashboardCandidato: Não autorizado ou proibido, redirecionando para login.");
                    logout(); // Desloga o usuário
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    setError(`Erro ao buscar dados do usuário: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                // Captura erros de rede ou outros erros inesperados no fetch
                console.error("DashboardCandidato: Erro na requisição de dados do usuário:", err);
                setError('Erro de conexão ao carregar perfil do candidato.');
            } finally {
                setIsLoadingData(false); // Finaliza o estado de carregamento
            }
        };

        fetchUserData(); // Chama a função de busca de dados ao montar/atualizar
    }, [authToken, navigate, logout]); // Dependências: re-executa se token, navegação ou logout mudarem

    // Função de logout (chama a função do contexto)
    const handleLogout = () => {
        logout(); // Limpa o estado de autenticação no contexto e no localStorage
        navigate('/login'); // Redireciona para a página de login
    };

    // Renderização condicional enquanto os dados estão sendo carregados
    if (isLoadingData) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando seu dashboard...</p>
            </div>
        );
    }

    // Renderização em caso de erro ao carregar os dados iniciais
    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate('/login')}>Ir para Login</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar de Navegação */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <FontAwesomeIcon icon={faUserCircle} size="3x" className="profile-icon" />
                    <h3>{nome}</h3>
                    <p>{email}</p>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            {/* Link para o próprio dashboard, marcado como ativo */}
                            <Link to="/candidato/dashboard" className="nav-item active">
                                <FontAwesomeIcon icon={faCheckCircle} className="nav-icon" /> Dashboard
                            </Link>
                        </li>
                        <li>
                            {/* Link para editar o currículo */}
                            <Link to="/candidato/curriculo" className="nav-item" onClick={() => console.log("LINK MEU CURRÍCULO CLICADO!")}>
                                <FontAwesomeIcon icon={faFileAlt} className="nav-icon" /> Meu Currículo
                            </Link>
                        </li>
                        <li>
                            {/* Link para visualizar o currículo */}
                            <Link to="/candidato/visualizar-curriculo" className="nav-item">
                                <FontAwesomeIcon icon={faEye} className="nav-icon" /> Visualizar Currículo
                            </Link>
                        </li>
                        <li>
                            {/* Link para vagas salvas */}
                            <Link to="/candidato/vagas-salvas" className="nav-item">
                                <FontAwesomeIcon icon={faBookmark} className="nav-icon" /> Vagas Salvas
                            </Link>
                        </li>
                        <li>
                            {/* Link para candidaturas */}
                            <Link to="/candidato/minhas-candidaturas" className="nav-item">
                                <FontAwesomeIcon icon={faBriefcase} className="nav-icon" /> Minhas Candidaturas
                            </Link>
                        </li>
                        <li>
                            {/* Link para editar o perfil/configurações */}
                            <Link to="/candidato/perfil" className="nav-item">
                                <FontAwesomeIcon icon={faCog} className="nav-icon" /> Editar Perfil
                            </Link>
                        </li>
                        <li>
                            {/* Botão de Logout */}
                            <button onClick={handleLogout} className="nav-item logout-btn">
                                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" /> Sair
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Conteúdo Principal do Dashboard */}
            <main className="dashboard-content">
                <header className="content-header">
                    <h1>Bem-vindo(a) ao seu Painel</h1>
                </header>

                <section className="dashboard-summary">
                    {/* Card de status do Currículo */}
                    <div className="summary-card">
                        <h3>Currículo Completo</h3>
                        {/* Exemplo de condição para ícone baseado nos dados do perfil */}
                        {perfilCandidatoData && perfilCandidatoData.resumo && perfilCandidatoData.linkedin ?
                            <FontAwesomeIcon icon={faCheckCircle} size="2x" color="#27ae60" className="summary-icon" /> :
                            <FontAwesomeIcon icon={faFileAlt} size="2x" color="#f39c12" className="summary-icon" />
                        }
                        <p>{perfilCandidatoData && perfilCandidatoData.resumo && perfilCandidatoData.linkedin ? 
                           "Seu currículo está 100% completo!" : 
                           "Seu currículo está incompleto. Preencha agora!"}</p>
                        <Link to="/candidato/curriculo">Editar Currículo</Link>
                        <Link to="/candidato/visualizar-curriculo" className="view-link">
                            <FontAwesomeIcon icon={faEye} className="view-icon" /> Visualizar
                        </Link>
                    </div>
                    {/* Card de Vagas Salvas */}
                    <div className="summary-card">
                        <h3>Vagas Salvas</h3>
                        <FontAwesomeIcon icon={faBookmark} size="2x" color="#3498db" className="summary-icon" />
                        <p>Acompanhe as vagas que você achou interessantes.</p>
                        <Link to="/candidato/vagas-salvas">Ver Vagas Salvas</Link>
                    </div>
                    {/* Card de Minhas Candidaturas */}
                    <div className="summary-card">
                        <h3>Minhas Candidaturas</h3>
                        <FontAwesomeIcon icon={faBriefcase} size="2x" color="#f39c12" className="summary-icon" />
                        <p>Veja o status das suas aplicações.</p>
                        <Link to="/candidato/minhas-candidaturas">Ver Candidaturas</Link>
                    </div>
                </section>

                <section className="recent-activity">
                    <h2>Atividade Recente</h2>
                    {/* Estes dados viriam de uma API específica para atividades do candidato */}
                    <ul>
                        <li>Você salvou a vaga de "Desenvolvedor Front-end" (Há 1 dia)</li>
                        <li>Você se candidatou para a vaga de "Analista de Dados" (Há 3 dias)</li>
                        <li>Seu currículo foi visualizado por uma empresa (Há 5 dias)</li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default DashboardCandidato;