import{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardEmpresa.css'; // Crie ou use seu arquivo CSS para este dashboard
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding,      // Ícone de prédio para a empresa
    faBriefcase,     // Ícone de pasta/trabalho
    faUsers,         // Ícone para candidatos
    faPlusCircle,    // Ícone para criar nova vaga
    faCog,           // Ícone para configurações
    faSignOutAlt,    // Ícone para sair (logout)
    faSpinner,       // Ícone de carregamento
    faChartBar,      // Ícone para dashboard/métricas
    faClipboardList,  // Ícone para lista de vagas
    faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/useAuth ';


const DashboardEmpresa = () => {
    // Estados para exibir dados da empresa
    const [empresaNome, setEmpresaNome] = useState('Carregando...');
    const [userEmail, setUserEmail] = useState('Carregando...');
    const [empresaCnpj, setEmpresaCnpj] = useState('Carregando...');
    const [vagasAtivas, setVagasAtivas] = useState("")
     // Novo estado para CNPJ
   // const [perfilEmpresaData, setPerfilEmpresaData] = useState(null); // Para guardar os dados específicos do perfil (Empresa)

    // Estados de UI e feedback
    const [isLoadingData, setIsLoadingData] = useState(true); // Carregamento inicial dos dados do perfil
    const [error, setError] = useState(''); // Mensagem de erro, se houver

    // Hooks de navegação e autenticação
    const navigate = useNavigate();
    const { authToken, logout } = useAuth(); // Obtenha o token e roles do contexto
    //console.logo(perfilEmpresaData, userRoles)

    useEffect(() => {
        const fetchEmpresaData = async () => {
            // Verifica a presença do token. ProtectedRoute já faz isso, mas é bom ter um fallback.
            if (!authToken) {
                console.log("DashboardEmpresa: Token não encontrado, redirecionando para login.");
                navigate('/login');
                return;
            }

            setIsLoadingData(true); // Inicia o carregamento dos dados
            setError(''); // Limpa erros anteriores

            try {
                // Requisição para obter os dados do usuário logado (incluindo perfil de empresa)
                const response = await fetch('http://201.23.66.57:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}` // Envia o token JWT
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("DashboardEmpresa: Dados do usuário logado:", userData);

                    // Verifica se o perfil retornado é realmente de uma empresa
                    if (userData.perfilTipo === 'empresa' && userData.perfilData) {
                        //setPerfilEmpresaData(userData.perfilData); // Armazena todos os dados do perfil de empresa
                        setEmpresaNome(userData.perfilData.nome || userData.username || 'Empresa'); // Prioriza o nome da empresa, senão username
                        setUserEmail(userData.email || 'email@exemplo.com');
                        setEmpresaCnpj(userData.perfilData.cnpj || 'Não informado'); // Seta o CNPJ

                        // Opcional: Aqui você pode fazer outras chamadas para métricas da empresa
                         const vagasResponse = await fetch('http://201.23.66.57:8080/api/vagas/by-empresa/me', { 
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}` // Envia o token JWT
                            }
                            
                          });
                             const vagasData = await vagasResponse.json();
                             setVagasAtivas(vagasData.length);

                    } else if (userData.perfilTipo === 'candidato' && userData.perfilData) {
                        // Se o usuário logado for um candidato, e estiver no dashboard de empresa, é um erro.
                        console.warn("DashboardEmpresa: Usuário é candidato, redirecionando para dashboard correto.");
                        logout(); // Desloga e limpa o token
                        navigate('/login'); // Ou para /candidato/dashboard diretamente se o ProtectedRoute permitir
                    } else {
                        // Caso o perfil não seja reconhecido ou esteja incompleto
                        setError('Seu perfil não é de empresa ou está incompleto. Redirecionando...');
                        console.warn("DashboardEmpresa: Perfil não reconhecido ou incompleto.");
                        logout(); // Força logout e limpa o token
                        navigate('/login');
                    }

                } else if (response.status === 401 || response.status === 403) {
                    // Se o token for inválido/expirado ou acesso proibido, desloga
                    console.error("DashboardEmpresa: Não autorizado ou proibido, redirecionando para login.");
                    logout();
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    setError(`Erro ao buscar dados da empresa: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                // Captura erros de rede
                console.error("DashboardEmpresa: Erro na requisição de dados da empresa:", err);
                setError('Erro de conexão ao carregar perfil da empresa.');
            } finally {
                setIsLoadingData(false); // Finaliza o carregamento dos dados
            }
        };

        fetchEmpresaData();
    }, [authToken, navigate, logout]); // Dependências: re-executa se token, navegação ou logout mudarem

    // Função de logout (chama a função do contexto)
    const handleLogout = () => {
        logout(); // Limpa o estado de autenticação no contexto e no localStorage
        navigate('/login'); // Redireciona para a página de login
    };

    // Renderização condicional durante o carregamento inicial dos dados
    if (isLoadingData) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando dashboard da empresa...</p>
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
                    <FontAwesomeIcon icon={faBuilding} size="3x" className="profile-icon" />
                    <h3>{empresaNome}</h3>
                    <p>{userEmail}</p>
                    <p>CNPJ: {empresaCnpj}</p>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            {/* Link para o próprio dashboard, marcado como ativo */}
                            <Link to="/empresa/dashboard" className="nav-item active">
                                <FontAwesomeIcon icon={faChartBar} className="nav-icon" /> Dashboard
                            </Link>
                        </li>
                        <li>
                            {/* Link para a lista de vagas da empresa */}
                            <Link to="/empresa/vagas" className="nav-item">
                                <FontAwesomeIcon icon={faClipboardList} className="nav-icon" /> Minhas Vagas
                            </Link>
                        </li>
                        <li>
                            {/* Link para criar uma nova vaga */}
                            <Link to="/empresa/vagas/nova" className="nav-item">
                                <FontAwesomeIcon icon={faPlusCircle} className="nav-icon" /> Criar Nova Vaga
                            </Link>
                        </li>
                        <li>
                            {/* Link para visualizar candidatos que se aplicaram */}
                            <Link to="/empresa/candidatos-aplicados" className="nav-item">
                                <FontAwesomeIcon icon={faUsers} className="nav-icon" /> Candidatos Aplicados
                            </Link>
                        </li>
                        <li>
                            {/* Link para configurações do perfil da empresa */}
                            <Link to="/empresa/configuracoes" className="nav-item">
                                <FontAwesomeIcon icon={faCog} className="nav-icon" /> Configurações
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
                    <h1>Visão Geral da Empresa</h1>
                </header>

                <section className="dashboard-summary">
                    {/* Card de Vagas Ativas (dados viriam da API) */}
                    <div className="summary-card">
                        <h3>Vagas Ativas</h3>
                        <FontAwesomeIcon icon={faBriefcase} size="2x" color="#1a5276" className="summary-icon" />
                        <p>{vagasAtivas}</p>
                        <Link to="/empresa/vagas">Ver minhas vagas</Link>
                    </div>
                    {/* Card de Novas Candidaturas (dados viriam da API) */}
                    <div className="summary-card">
                        <h3>Novas Candidaturas</h3>
                        <FontAwesomeIcon icon={faUsers} size="2x" color="#16a085" className="summary-icon" />
                        <p>Últimos 7 dias: 12</p>
                        <Link to="/empresa/candidatos-aplicados">Ver candidaturas</Link>
                    </div>
                    {/* Card de Candidatos Visualizados (dados viriam da API) */}
                    <div className="summary-card">
                        <h3>Candidatos Visualizados</h3>
                        <FontAwesomeIcon icon={faEye} size="2x" color="#f39c12" className="summary-icon" />
                        <p>Total: 50</p>
                        <Link to="/empresa/candidatos-aplicados">Explorar talentos</Link>
                    </div>
                </section>

                <section className="recent-activity">
                    <h2>Últimas Atividades</h2>
                    {/* Estes dados viriam de uma API específica para atividades da empresa */}
                    <ul>
                        <li>Vaga "Desenvolvedor Backend" recebeu 3 novas candidaturas. (Hoje)</li>
                        <li>Você criou a vaga "Analista de Marketing Digital". (Há 1 dia)</li>
                        <li>Vaga "Designer UX/UI" expirou. (Há 3 dias)</li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default DashboardEmpresa;