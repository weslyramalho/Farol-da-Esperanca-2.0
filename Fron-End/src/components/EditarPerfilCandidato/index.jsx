import './EditarPerfilCandidato.css'; // Crie este arquivo CSS
import { faArrowLeft, faSave, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth ';
import { useNavigate } from 'react-router-dom';

const EditarPerfilCandidato = () => {
    // Estados para os campos do formulário (dados do Candidato)
    const [nomeCandidato, setNomeCandidato] = useState('');
    const [emailCandidato, setEmailCandidato] = useState(''); // O e-mail do Candidato (pode ser diferente do User.email)
    // Se você permitir editar o username ou email do User diretamente:
    const [usernameUser, setUsernameUser] = useState(''); 
    const [emailUser, setEmailUser] = useState(''); // O e-mail do User (entidade User)

    // IDs para requisições de atualização
    const [candidatoId, setCandidatoId] = useState(null);
    const [userId, setUserId] = useState(null);

    // Estados de UI e feedback
    const [isLoading, setIsLoading] = useState(true); // Carregamento inicial dos dados
    const [isSaving, setIsSaving] = useState(false); // Carregamento durante o salvamento
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { authToken, logout } = useAuth(); // Usar userRoles para redirecionamento do botão voltar

    // Função para buscar os dados do usuário e do perfil de candidato
    useEffect(() => {
        const fetchPerfilData = async () => {
            if (!authToken) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError('');
            setMessage('');

            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("EditarPerfilCandidato: Dados do usuário recebidos:", userData);

                    // Preenche os dados da entidade User
                    setUserId(userData.id);
                    setUsernameUser(userData.username || '');
                    setEmailUser(userData.email || '');

                    // Preenche os dados da entidade Candidato (perfilData)
                    if (userData.perfilTipo === 'candidato' && userData.perfilData) {
                        setCandidatoId(userData.perfilData.id);
                        setNomeCandidato(userData.perfilData.nome || '');
                        setEmailCandidato(userData.perfilData.email || ''); // E-mail do Candidato
                    } else {
                        // Se não for um candidato ou dados incompletos
                        setError('Perfil de candidato não encontrado ou dados incompletos. Redirecionando...');
                        // Opcional: redirecionar para outro dashboard ou login
                        logout();
                        navigate('/login');
                    }
                } else if (response.status === 401 || response.status === 403) {
                    logout();
                    navigate('/login');
                } else {
                    const errorText = await response.text();
                    setError(`Erro ao carregar perfil: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error('EditarPerfilCandidato: Erro de conexão:', err);
                setError('Erro de conexão ao carregar seu perfil. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPerfilData();
    }, [authToken, navigate, logout]);

    // Função para lidar com o envio do formulário de atualização
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSaving(true);

        if (!authToken || !candidatoId || !userId) {
            setError('Dados de autenticação ou ID do perfil ausentes. Recarregue a página.');
            setIsSaving(false);
            return;
        }

        // Dados para atualizar a entidade Candidato
        const candidatoDataToUpdate = {
            id: candidatoId, // O ID é necessário no body para PUT no backend
            nome: nomeCandidato,
            email: emailCandidato,
            // Outros campos da entidade Candidato se houver
        };

        // Dados para atualizar a entidade User (se você permitir isso)
        /*
        const userDataToUpdate = {
            id: userId,
            username: usernameUser,
            email: emailUser,
            // Outros campos da entidade User se houver
        };
*/
        try {
            // Requisição PUT para atualizar o perfil do Candidato
            const candidatoResponse = await fetch(`http://localhost:8080/api/candidatos/${candidatoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(candidatoDataToUpdate),
            });

            if (!candidatoResponse.ok) {
                const errorText = await candidatoResponse.text();
                throw new Error(`Falha ao atualizar perfil de candidato: ${candidatoResponse.status} - ${errorText}`);
            }

            // Opcional: Requisição PUT para atualizar a entidade User (se houver UserController.updateUser)
            // if (usernameUser !== (originalUsername ou emailUser !== originalEmail)) {
            //     const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`, {
            //         method: 'PUT',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${authToken}`
            //         },
            //         body: JSON.stringify(userDataToUpdate),
            //     });
            //     if (!userResponse.ok) {
            //         const errorText = await userResponse.text();
            //         throw new Error(`Falha ao atualizar dados de usuário: ${userResponse.status} - ${errorText}`);
            //     }
            // }

            setMessage('Perfil atualizado com sucesso!');
            // Opcional: Redirecionar ou recarregar os dados após o sucesso
            // navigate('/candidato/dashboard');
        } catch (err) {
            console.error('Erro ao salvar perfil:', err);
            setError(err.message || 'Ocorreu um erro ao salvar o perfil.');
        } finally {
            setIsSaving(false);
        }
    };

    // Função para voltar ao dashboard do candidato
    const handleGoBackToDashboard = () => {
        navigate('/candidato/dashboard'); // Redireciona para o dashboard do candidato
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando seu perfil...</p>
            </div>
        );
    }

    if (error && !isLoading) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                    <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="editar-perfil-candidato-container">
            <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
            </button>
            <h2>Editar Perfil</h2>
            <p className="form-subtitle">Atualize suas informações pessoais e de contato.</p>

            {error && (
                <div className="error-message">
                    {error}
                    <FontAwesomeIcon icon={faTimesCircle} className="close-icon" onClick={() => setError('')} />
                </div>
            )}
            {message && (
                <div className="success-message">
                    {message}
                    <FontAwesomeIcon icon={faTimesCircle} className="close-icon" onClick={() => setMessage('')} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="perfil-form">
                {/* Campos da Entidade User (se você permitir edição) */}
                <div className="form-group">
                    <label htmlFor="usernameUser">Nome de Usuário (Login)</label>
                    <input
                        type="text"
                        id="usernameUser"
                        value={usernameUser}
                        onChange={(e) => setUsernameUser(e.target.value)}
                        placeholder="Nome de usuário para login"
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="emailUser">Email de Usuário (Login)</label>
                    <input
                        type="email"
                        id="emailUser"
                        value={emailUser}
                        onChange={(e) => setEmailUser(e.target.value)}
                        placeholder="Email de login"
                        disabled={isSaving}
                        required
                    />
                </div>
                <hr /> {/* Divisor entre dados de User e Candidato */}

                {/* Campos da Entidade Candidato */}
                <div className="form-group">
                    <label htmlFor="nomeCandidato">Nome Completo</label>
                    <input
                        type="text"
                        id="nomeCandidato"
                        value={nomeCandidato}
                        onChange={(e) => setNomeCandidato(e.target.value)}
                        placeholder="Seu nome completo"
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="emailCandidato">Email para Contato</label>
                    <input
                        type="email"
                        id="emailCandidato"
                        value={emailCandidato}
                        onChange={(e) => setEmailCandidato(e.target.value)}
                        placeholder="Seu email principal para contato"
                        disabled={isSaving}
                        required
                    />
                </div>
                {/* Adicione outros campos da entidade Candidato aqui (ex: telefone, endereço) */}

                <button type="submit" className="btn btn-primary-custom" disabled={isSaving}>
                    <FontAwesomeIcon icon={faSave} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default EditarPerfilCandidato;