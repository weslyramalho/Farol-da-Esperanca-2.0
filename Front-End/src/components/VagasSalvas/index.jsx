import { useEffect, useState } from 'react';
import './VagasSalvas.css'; // Crie este arquivo CSS
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth ';
import { faArrowLeft, faBriefcase, faEye, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalCustom, ModalBody, ModalFooter, ModalHeader} from '../Modal';
import DetalhesVagaModal from '../DetalhesVagaModal';


const VagasSalvas = () => {
    const [vagasSalvas, setVagasSalvas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Mensagens de sucesso (ex: após dessalvar)
    const [confirmationVaga, setConfirmationVaga] = useState(null); // Vaga para confirmação de dessalvar

    const navigate = useNavigate();
    const { authToken, userRoles, logout } = useAuth();

    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchVagasSalvas = async () => {
            if (!authToken) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError('');
            setMessage(''); // Limpa mensagens ao carregar

            try {
                // Endpoint para buscar vagas salvas do CANDIDATO LOGADO
                const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/candidatos/me/vagas-salvas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setVagasSalvas(data);
                } else if (response.status === 404) {
                    setVagasSalvas([]); // Nenhuma vaga salva encontrada
                } else if (response.status === 401 || response.status === 403) {
                    console.error("VagasSalvas: Não autorizado ou proibido. Redirecionando.");
                    logout();
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Erro ao buscar vagas salvas: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error('VagasSalvas: Erro na requisição:', err);
                setError('Erro de conexão ao carregar suas vagas salvas. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        // Garante que a role é de candidato antes de buscar vagas salvas (opcional, ProtectedRoute já faz)
        if (userRoles.includes('ROLE_CANDIDATO') || userRoles.includes('ROLE_ADMIN')) {
            fetchVagasSalvas();
        } else if (!isLoading) { // Se não é candidato e não está carregando, pode ter erro de role
            setError('Você não tem permissão para visualizar vagas salvas.');
            setIsLoading(false);
        }
    }, [authToken, navigate, logout, userRoles]);

    // Função para lidar com o clique em "Dessalvar" (mostra confirmação)
    const handleUnsave = (vaga) => {
        setConfirmationVaga(vaga);
    };

       // Função para abrir o modal
    const handleVisualizar = (vaga) => {
        setVagaSelecionada(vaga);
        setShowModal(true);
    };

    // Função para confirmar a remoção da vaga salva
    const confirmUnsave = async () => {
        if (!confirmationVaga) return;

        const vagaToUnsave = confirmationVaga;
        setConfirmationVaga(null); // Esconde o modal de confirmação
        setIsLoading(true); // Ativa o loading

        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }

        try {
            // Endpoint para DESSALVAR UMA VAGA
            // Você precisará criar este endpoint: DELETE /api/candidatos/me/vagas-salvas/{vagaId}
            const response = await fetch(`https://245c2fba6c85.ngrok-free.app/api/candidatos/me/vagas-salvas/${vagaToUnsave.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMessage(`Vaga "${vagaToUnsave.titulo}" removida das salvas!`);
                setVagasSalvas(vagasSalvas.filter(v => v.id !== vagaToUnsave.id)); // Remove da lista local
            } else if (response.status === 401 || response.status === 403) {
                logout();
                navigate('/login');
            } else if (response.status === 404) {
                setError('Vaga não encontrada para remover das salvas.');
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao dessalvar vaga: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('VagasSalvas: Erro ao dessalvar vaga:', err);
            setError('Erro de conexão ao dessalvar vaga. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const cancelUnsave = () => {
        setConfirmationVaga(null);
    };

    // Função para lidar com o clique em "Aplicar" (apenas placeholder por enquanto)
    const handleApply = (vagaId) => {
        // Lógica para aplicar à vaga (fazer um POST para /api/candidaturas/aplicar)
        alert(`Você se candidataria à vaga ID: ${vagaId}`);
        // Você pode redirecionar para uma página de candidatura ou disparar um modal
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando suas vagas salvas...</p>
            </div>
        );
    }

       const handleGoBackToDashboard = () => {
            navigate('/candidato/dashboard'); 
    };

    return (
        <div className="vagas-salvas-container">
               {/* NOVO BOTÃO: Voltar ao Dashboard */}
                        <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                            <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
                        </button>
            <header className="vagas-header">
                <h2>Vagas Salvas</h2>
            </header>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {vagasSalvas.length === 0 && !isLoading ? (
                <div className="no-vagas-message">
                    <p>Você ainda não salvou nenhuma vaga.</p>
                    <Link to="/candidato/listarvagas" className="btn btn-primary-custom">Buscar Vagas</Link>
                </div>
            ) : (
                <div className="vagas-list">
                    {vagasSalvas.map(vaga => (
                        <div key={vaga.id} className="vaga-card">
                            <h3>{vaga.titulo}</h3>
                            <p><strong>Empresa:</strong> {vaga.empresa ? vaga.empresa.nome : 'N/A'}</p>
                            <p><strong>Local:</strong> {vaga.local}</p>
                            <p><strong>Salário:</strong> R$ {vaga.salario ? vaga.salario.toLocaleString('pt-BR') : 'N/A'}</p>
                            <p><strong>Tipo:</strong> {vaga.tipoContrato}</p>
                            <p className="vaga-descricao">{vaga.descricao.substring(0, 100)}...</p>
                            <div className="vaga-actions">

                                 <button
                                        onClick={() => handleVisualizar(vaga)}
                                        className="btn btn-info btn-sm align-self-start mt-2"
                                    >
                                        <FontAwesomeIcon icon={faEye} /> Ver Detalhes
                                    </button>
                        
                                <button onClick={() => handleApply(vaga.id)} className="btn btn-apply">
                                    <FontAwesomeIcon icon={faBriefcase} /> Aplicar
                                </button>
                                <button onClick={() => handleUnsave(vaga)} className="btn btn-unsave">
                                    <FontAwesomeIcon icon={faTrash} /> Dessalvar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
              <ModalCustom show={showModal} onHide={() => setShowModal(false)} size="lg">
                <ModalHeader>
                    {/* Aqui, o título do ModalHeader deve ser passado como children, não como um atributo Title */}
                    <h3>Detalhes da Vaga {vagaSelecionada?.titulo}</h3> 
                </ModalHeader>
                <ModalBody>
                    {vagaSelecionada && (
                        <DetalhesVagaModal vagaSelecionada={vagaSelecionada} />
                    )}
                </ModalBody>
                <ModalFooter>
                    {/* Botões do modal */}
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </button>
                </ModalFooter>
            </ModalCustom>

            {confirmationVaga && (
                <div className="delete-confirmation-modal">
                    <div className="modal-content">
                        <p>Tem certeza que deseja remover a vaga "{confirmationVaga.titulo}" das salvas?</p>
                        <div className="modal-actions">
                            <button onClick={confirmUnsave} className="btn btn-unsave">Confirmar</button>
                            <button onClick={cancelUnsave} className="btn btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VagasSalvas;