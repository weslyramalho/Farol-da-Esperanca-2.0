import './ConfiguracoesEmpresa.css'; // Crie este arquivo CSS

import { faArrowLeft, faSave, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth ';

const ConfiguracoesEmpresa = () => {
    // Estados para os campos do formulário (dados da Empresa)
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [emailEmpresa, setEmailEmpresa] = useState(''); // E-mail da Empresa (pode ser diferente do User.email)
    const [cnpj, setCnpj] = useState(''); 
    
    // Se você permitir editar o username ou email do User diretamente:
    const [usernameUser, setUsernameUser] = useState(''); 
    const [emailUser, setEmailUser] = useState(''); // E-mail do User (entidade User)

    // IDs para requisições de atualização
    const [empresaId, setEmpresaId] = useState(null);
    const [userId, setUserId] = useState(null);

    // Estados de UI e feedback
    const [isLoading, setIsLoading] = useState(true); // Carregamento inicial dos dados
    const [isSaving, setIsSaving] = useState(false); // Carregamento durante o salvamento
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { authToken, logout } = useAuth(); // Usar userRoles para redirecionamento do botão voltar

    // Função para buscar os dados do usuário e do perfil de empresa
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
                    console.log("ConfiguracoesEmpresa: Dados do usuário recebidos:", userData);

                    // Preenche os dados da entidade User
                    setUserId(userData.id);
                    setUsernameUser(userData.username || '');
                    setEmailUser(userData.email || '');

                    // Preenche os dados da entidade Empresa (perfilData)
                    if (userData.perfilTipo === 'empresa' && userData.perfilData) {
                        setEmpresaId(userData.perfilData.id);
                        setNomeEmpresa(userData.perfilData.nome || '');
                        setEmailEmpresa(userData.perfilData.email || ''); // E-mail da Empresa
                        setCnpj(userData.perfilData.cnpj || ''); // CNPJ da Empresa
                    } else {
                        // Se não for uma empresa ou dados incompletos
                        setError('Perfil de empresa não encontrado ou dados incompletos. Redirecionando...');
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
                console.error('ConfiguracoesEmpresa: Erro de conexão:', err);
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

        if (!authToken || !empresaId || !userId) {
            setError('Dados de autenticação ou ID do perfil ausentes. Recarregue a página.');
            setIsSaving(false);
            return;
        }

        // Validações básicas do formulário
        if (!nomeEmpresa || !emailEmpresa || !cnpj) {
            setError('Por favor, preencha todos os campos obrigatórios da empresa.');
            setIsSaving(false);
            return;
        }
        // Adicione validação de CNPJ se necessário (ex: formato, tamanho)

        // Dados para atualizar a entidade Empresa
        const empresaDataToUpdate = {
            id: empresaId, // O ID é necessário no body para PUT no backend
            nome: nomeEmpresa,
            email: emailEmpresa,
            cnpj: cnpj,
            // Outros campos da entidade Empresa se houver
        };

        // Dados para atualizar a entidade User (se você permitir isso no backend)
        /*
        const userDataToUpdate = {
            id: userId,
            username: usernameUser,
            email: emailUser,
            // Outros campos da entidade User se houver
        };
*/
        try {
            // Requisição PUT para atualizar o perfil da Empresa
            const empresaResponse = await fetch(`http://localhost:8080/api/empresas/${empresaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(empresaDataToUpdate),
            });

            if (!empresaResponse.ok) {
                const errorText = await empresaResponse.text();
                throw new Error(`Falha ao atualizar perfil da empresa: ${empresaResponse.status} - ${errorText}`);
            }

            // Opcional: Requisição PUT para atualizar a entidade User (se houver UserController.updateUser)
            // Se você quiser que o nome de usuário/email de login possa ser alterado aqui
            /*
            if (usernameUser !== originalUsernameUser || emailUser !== originalEmailUser) { // Compare com valores originais
                 const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`, {
                     method: 'PUT',
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${authToken}`
                     },
                     body: JSON.stringify(userDataToUpdate),
                 });
                 if (!userResponse.ok) {
                     const errorText = await userResponse.text();
                     throw new Error(`Falha ao atualizar dados de usuário: ${userResponse.status} - ${errorText}`);
                 }
            }
            */

            setMessage('Perfil da empresa atualizado com sucesso!');
            // Opcional: Redirecionar ou recarregar os dados após o sucesso
            // navigate('/empresa/dashboard');
        } catch (err) {
            console.error('Erro ao salvar perfil da empresa:', err);
            setError(err.message || 'Ocorreu um erro ao salvar o perfil da empresa.');
        } finally {
            setIsSaving(false);
        }
    };

    // Função para voltar ao dashboard da empresa
    const handleGoBackToDashboard = () => {
        navigate('/empresa/dashboard'); // Redireciona para o dashboard da empresa
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando configurações da empresa...</p>
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
        <div className="configuracoes-empresa-container">
            <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
            </button>
            <h2>Configurações da Empresa</h2>
            <p className="form-subtitle">Atualize as informações da sua empresa.</p>

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
                <hr /> {/* Divisor entre dados de User e Empresa */}

                {/* Campos da Entidade Empresa */}
                <div className="form-group">
                    <label htmlFor="nomeEmpresa">Nome da Empresa</label>
                    <input
                        type="text"
                        id="nomeEmpresa"
                        value={nomeEmpresa}
                        onChange={(e) => setNomeEmpresa(e.target.value)}
                        placeholder="Nome fantasia ou razão social"
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="emailEmpresa">Email da Empresa</label>
                    <input
                        type="email"
                        id="emailEmpresa"
                        value={emailEmpresa}
                        onChange={(e) => setEmailEmpresa(e.target.value)}
                        placeholder="Email de contato da empresa"
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                        type="text"
                        id="cnpj"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="XX.XXX.XXX/YYYY-ZZ"
                        disabled={isSaving}
                        required
                    />
                </div>
                {/* Adicione outros campos da entidade Empresa aqui (ex: telefone, endereço) */}

                <button type="submit" className="btn btn-primary-custom" disabled={isSaving}>
                    <FontAwesomeIcon icon={faSave} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default ConfiguracoesEmpresa;