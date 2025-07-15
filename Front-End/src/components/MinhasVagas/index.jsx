import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faEdit, faTrash,  faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './MinhasVagas.css'; // Crie este arquivo CSS
import { useAuth } from '../../context/useAuth ';
import { ModalCustom, ModalBody, ModalFooter, ModalHeader, ButtonCustom } from '../Modal';
import DetalhesVagaModal from '../DetalhesVagaModal';


const MinhasVagas = () => {
    const [vagas, setVagas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Mensagens de sucesso (ex: após exclusão)
    const [deleteConfirmation, setDeleteConfirmation] = useState(null); // Armazena a vaga para confirmação de exclusão

    const navigate = useNavigate();
    const { authToken, logout } = useAuth(); // Precisamos do token e das roles para o BE

     // Novos estados para o modal
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchVagas = async () => {
            if (!authToken) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                // Endpoint para buscar vagas da EMPRESA LOGADA
                // Você precisará criar este endpoint no backend.
                // Exemplo: GET /api/vagas/by-empresa/me ou /api/empresas/me/vagas
                const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/vagas/by-empresa/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setVagas(data);
                } else if (response.status === 404) {
                    setVagas([]); // Nenhuma vaga encontrada
                } else if (response.status === 401 || response.status === 403) {
                    console.error("MinhasVagas: Não autorizado ou proibido. Redirecionando.");
                    logout();
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Erro ao buscar vagas: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error('MinhasVagas: Erro na requisição:', err);
                setError('Erro de conexão ao carregar suas vagas. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVagas();
    }, [authToken, navigate, logout]);

    const handleEdit = (vagaId) => {
        navigate(`/empresa/vagas/editar/${vagaId}`); // Navega para a tela de edição de vaga
    };

    const handleDelete = (vaga) => {
        setDeleteConfirmation(vaga); // Seta a vaga para confirmação
    };


    // Nova função para abrir o modal
    const handleVisualizar = (vaga) => {
        setVagaSelecionada(vaga);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;

        const vagaToDelete = deleteConfirmation;
        setDeleteConfirmation(null); // Esconde a confirmação
        setIsLoading(true); // Re-ativa o loading geral ou um loading específico para a deleção

        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }

        try {
            const response = await fetch(`https://245c2fba6c85.ngrok-free.app/api/vagas/${vagaToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMessage('Vaga excluída com sucesso!');
                setVagas(vagas.filter(v => v.id !== vagaToDelete.id)); // Remove a vaga da lista local
            } else if (response.status === 401 || response.status === 403) {
                logout();
                navigate('/login');
            } else if (response.status === 404) {
                setError('Vaga não encontrada para exclusão.');
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir vaga: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('MinhasVagas: Erro ao excluir vaga:', err);
            setError('Erro de conexão ao excluir vaga. Tente novamente.');
        } finally {
            setIsLoading(false); // Finaliza o loading
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando suas vagas...</p>
            </div>
        );
    }
     const handleGoBackToDashboard = () => {
            navigate('/empresa/dashboard'); 
    };

    return (
        <div className="minhas-vagas-container">
             {/* NOVO BOTÃO: Voltar ao Dashboard */}
            <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
            </button>
            <header className="vagas-header">
                <h2>Minhas Vagas</h2>
                <Link to="/empresa/vagas/nova" className="btn btn-primary-custom">
                    <FontAwesomeIcon icon={faPlus} /> Criar Nova Vaga
                </Link>
            </header>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {vagas.length === 0 && !isLoading ? (
                <div className="no-vagas-message">
                    <p>Você ainda não publicou nenhuma vaga.</p>
                    <Link to="/empresa/vagas/nova" className="btn btn-primary-custom">Publicar Primeira Vaga</Link>
                </div>
            ) : (
                <div className="vagas-list">
                    {vagas.map(vaga => (
                        <div key={vaga.id} className="vaga-card">
                            <h3>{vaga.titulo}</h3>
                            <p><strong>Local:</strong> {vaga.local}</p>
                            <p><strong>Salário:</strong> R$ {vaga.salario.toLocaleString('pt-BR')}</p>
                            <p><strong>Tipo de Contrato:</strong> {vaga.tipoContrato}</p>
                            <p className="vaga-descricao">{vaga.descricao.substring(0, 100)}...</p>
                            <div className="vaga-actions">
                               {/* Botão para abrir o modal */}
                                <button
                                    onClick={() => handleVisualizar(vaga)}
                                    className="btn btn-info btn-sm"
                                >
                                    Ver Detalhes
                                </button>
                                <button onClick={() => handleEdit(vaga.id)} className="btn btn-edit">
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                </button>
                                <button onClick={() => handleDelete(vaga)} className="btn btn-delete">
                                    <FontAwesomeIcon icon={faTrash} /> Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                    
                </div>
            )}

            {/* Modal para exibir os detalhes da vaga */}
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

            {deleteConfirmation && (
                <div className="delete-confirmation-modal">
                    <div className="modal-content">
                        <p>Tem certeza que deseja excluir a vaga "{deleteConfirmation.titulo}"?</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete} className="btn btn-delete">Confirmar</button>
                            <button onClick={cancelDelete} className="btn btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

             
        </div>
    
    );
};

export default MinhasVagas;