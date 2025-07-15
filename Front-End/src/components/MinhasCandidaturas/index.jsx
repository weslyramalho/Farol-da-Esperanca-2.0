import './MinhasCandidaturas.css'; // Crie este arquivo CSS
import { faBriefcase, faBuilding, faCalendarAlt, faEye, faSpinner, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate,  Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth ';

const MinhasCandidaturas = () => {
    const [candidaturas, setCandidaturas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Mensagens de sucesso (ex: após retirar)
    // Novo estado: candidatura para confirmação de retirada
    const [confirmationCandidatura, setConfirmationCandidatura] = useState(null); 
    const [isWithdrawing, setIsWithdrawing] = useState(false); // Indica que a retirada está em andamento

    const navigate = useNavigate();
    const { authToken, userRoles, logout } = useAuth();

    useEffect(() => {
        const fetchCandidaturas = async () => {
            if (!authToken) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError('');
            setMessage(''); // Limpa mensagens ao carregar

            try {
                const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/candidaturas/by-candidato/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCandidaturas(data);
                } else if (response.status === 404) {
                    setCandidaturas([]);
                } else if (response.status === 401 || response.status === 403) {
                    console.error("MinhasCandidaturas: Não autorizado ou proibido. Redirecionando.");
                    logout();
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Erro ao buscar candidaturas: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error('MinhasCandidaturas: Erro na requisição:', err);
                setError('Erro de conexão ao carregar suas candidaturas. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        if (userRoles.includes('ROLE_CANDIDATO') || userRoles.includes('ROLE_ADMIN')) {
            fetchCandidaturas();
        } else if (!isLoading) {
            setError('Você não tem permissão para visualizar candidaturas.');
            setIsLoading(false);
        }
    }, [authToken, navigate, logout, userRoles]);

    // Função para visualizar detalhes da vaga
    const handleViewDetails = (vagaId) => {
        navigate(`/vaga/${vagaId}`);
    };

    // --- NOVA LÓGICA: Função para lidar com o clique em "Retirar Candidatura" (mostra confirmação) ---
    const handleWithdrawClick = (candidatura) => {
        setConfirmationCandidatura(candidatura); // Seta a candidatura para confirmação
    };

    // --- NOVA LÓGICA: Função para cancelar a retirada ---
    const cancelWithdraw = () => {
        setConfirmationCandidatura(null);
        setError(''); // Limpa erros se houver
    };

    // --- NOVA LÓGICA: Função para confirmar e executar a retirada via API ---
    const confirmWithdraw = async () => {
        if (!confirmationCandidatura) return;

        const candidaturaToWithdraw = confirmationCandidatura;
        setConfirmationCandidatura(null); // Esconde o modal de confirmação
        setIsWithdrawing(true);           // Ativa o estado de carregamento de retirada
        setError('');                     // Limpa erros anteriores
        setMessage('');                   // Limpa mensagens anteriores

        const token = localStorage.getItem('authToken'); // Pega o token diretamente do localStorage
        if (!token) { navigate('/login'); return; }

        try {
            // Requisição DELETE para o endpoint de exclusão de candidatura
            const response = await fetch(`https://245c2fba6c85.ngrok-free.app/api/candidaturas/${candidaturaToWithdraw.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }, // Envia o token JWT
            });

            if (response.ok || response.status === 204) { // 204 No Content para DELETE bem-sucedido
                setMessage(`Candidatura para "${candidaturaToWithdraw.vaga?.titulo}" retirada com sucesso!`);
                // Remove a candidatura da lista local (filtra pelo ID)
                setCandidaturas(candidaturas.filter(c => c.id !== candidaturaToWithdraw.id));
            } else if (response.status === 401 || response.status === 403) {
                console.error("MinhasCandidaturas: Não autorizado ou proibido ao retirar, redirecionando para login.");
                logout();
                navigate('/login');
            } else if (response.status === 404) {
                setError('Candidatura não encontrada para retirar.');
            } else {
                const errorText = await response.text();
                throw new Error(`Falha ao retirar candidatura: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('MinhasCandidaturas: Erro ao retirar candidatura:', err);
            setError(err.message || 'Ocorreu um erro ao retirar a candidatura. Tente novamente.');
        } finally {
            setIsWithdrawing(false); // Finaliza o carregamento
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando suas candidaturas...</p>
            </div>
        );
    }

    if (error && !isLoading) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary-custom">Recarregar</button>
            </div>
        );
    }

    return (
        <div className="minhas-candidaturas-container">
            <header className="page-header">
                <h2>Minhas Candidaturas</h2>
            </header>

            {/* Mensagens de Erro e Sucesso */}
            {error && (
                <p className="error-message">
                    {error}
                    <FontAwesomeIcon icon={faTimesCircle} className="close-icon" onClick={() => setError('')} />
                </p>
            )}
            {message && (
                <p className="success-message">
                    {message}
                    <FontAwesomeIcon icon={faTimesCircle} className="close-icon" onClick={() => setMessage('')} />
                </p>
            )}

            {candidaturas.length === 0 && !isLoading ? (
                <div className="no-candidaturas-message">
                    <p>Você ainda não se candidatou a nenhuma vaga.</p>
                    <Link to="/vagas-em-aberto" className="btn btn-primary-custom">Buscar Vagas para Aplicar</Link>
                </div>
            ) : (
                <div className="candidaturas-list">
                    {candidaturas.map(candidatura => (
                        <div key={candidatura.id} className="candidatura-card">
                            <div className="card-header">
                                <h3 className="card-title">{candidatura.vaga?.titulo || 'Vaga Desconhecida'}</h3>
                                <span className={`status-badge status-${candidatura.status?.toLowerCase().replace(' ', '-')}`}>
                                    {candidatura.status || 'N/A'}
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="card-text">
                                    <FontAwesomeIcon icon={faBuilding} className="me-2" />
                                    Empresa: {candidatura.vaga?.empresa?.nome || 'N/A'}
                                </p>
                                <p className="card-text">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                    Data de Aplicação: {candidatura.dataCandidatura ? new Date(candidatura.dataCandidatura).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="card-text">
                                    <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                                    Local da Vaga: {candidatura.vaga?.local || 'N/A'}
                                </p>
                            </div>
                            <div className="card-actions">
                                <button onClick={() => handleViewDetails(candidatura.vaga?.id)} className="btn btn-view-details">
                                    <FontAwesomeIcon icon={faEye} /> Ver Detalhes da Vaga
                                </button>
                                {/* Botão para retirar candidatura */}
                                <button onClick={() => handleWithdrawClick(candidatura)} className="btn btn-withdraw" disabled={isWithdrawing}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> {isWithdrawing ? 'Retirando...' : 'Retirar Candidatura'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Confirmação de Retirada de Candidatura */}
            {confirmationCandidatura && (
                <div className="delete-confirmation-modal">
                    <div className="modal-content">
                        <p>Tem certeza que deseja retirar sua candidatura para a vaga "{confirmationCandidatura.vaga?.titulo || 'selecionada'}"?</p>
                        <div className="modal-actions">
                            <button onClick={confirmWithdraw} className="btn btn-delete-confirm" disabled={isWithdrawing}>
                                {isWithdrawing ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Confirmar Retirada'}
                            </button>
                            <button onClick={cancelWithdraw} className="btn btn-secondary" disabled={isWithdrawing}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinhasCandidaturas;