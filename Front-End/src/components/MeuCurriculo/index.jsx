
import { useEffect, useState } from 'react';
import './MeuCurriculo.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth ';
import { faArrowLeft, faSave, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const MeuCurriculo = () => {
    // Estados para os campos do formulário
    const [resumo, setResumo] = useState('');
    const [linkedin, setLinkedin] = useState('');

    // Estado para armazenar o ID do currículo (se existente)
    const [curriculoId, setCurriculoId] = useState(null); 
    // NOVO ESTADO: Controla se o formulário de edição/criação deve ser mostrado
    const [showForm, setShowForm] = useState(false); 

    console.log("MeuCurriculo.jsx: COMPONENTE RENDERIZADO.");

    // Estados de UI e feedback
    const [isLoadingData, setIsLoadingData] = useState(true); // Carregamento inicial (fetch)
    const [isSaving, setIsSaving] = useState(false);         // Carregamento durante o salvamento
    const [error, setError] = useState('');                   // Mensagens de erro
    const [message, setMessage] = useState('');               // Mensagens de sucesso

    // Hooks de navegação e autenticação
    const navigate = useNavigate();
    const { authToken, logout, userRoles } = useAuth();

    // Função para buscar os dados do currículo do candidato logado
    const fetchCurriculoData = async () => {
        if (!authToken) {
            console.log("MeuCurriculo: Token não encontrado, redirecionando para login.");
            navigate('/login');
            return;
        }

        setIsLoadingData(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/curriculos/by-candidate/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const curriculoData = await response.json();
                console.log("MeuCurriculo: Dados do currículo recebidos:", curriculoData);
                setResumo(curriculoData.resumo || '');
                setLinkedin(curriculoData.linkedin || '');
                setCurriculoId(curriculoData.id);
                setShowForm(true); // Se o currículo foi encontrado, mostra o formulário para edição
            } else if (response.status === 404) {
                // Se o currículo não for encontrado, informa e esconde o formulário inicialmente
                console.log("MeuCurriculo: Currículo não encontrado para este candidato. Exibindo opção de novo cadastro.");
                setResumo('');
                setLinkedin('');
                setCurriculoId(null);
                setShowForm(false); // Esconde o formulário, mostra a mensagem "não cadastrado"
            } else if (response.status === 401 || response.status === 403) {
                console.error("MeuCurriculo: Não autorizado ou proibido, redirecionando para login.");
                logout();
                navigate('/login');
            } else {
                const errorText = await response.text();
                setError(`Erro ao carregar currículo: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('MeuCurriculo: Erro de conexão ao carregar currículo:', err);
            setError('Erro de conexão ao carregar seu currículo. Tente novamente.');
        } finally {
            setIsLoadingData(false); // Finaliza o carregamento dos dados
        }
    };

    useEffect(() => {
        fetchCurriculoData();
    }, [authToken, navigate, logout]);
/*
    // Função para lidar com o clique no botão "Editar" (apenas exibe o formulário)
    const handleEdit = () => {
        setShowForm(true); // Força a exibição do formulário
        setMessage(''); // Limpa mensagens anteriores
        setError(''); // Limpa erros anteriores
    };
*/
    // NOVA FUNÇÃO: Lidar com o clique no botão "Cadastrar Currículo" (exibe o formulário)
    const handleCreateNewClick = () => {
        setResumo(''); // Limpa os campos para um novo cadastro
        setLinkedin('');
        setCurriculoId(null); // Garante que não é uma edição
        setShowForm(true); // Exibe o formulário
        setMessage(''); // Limpa mensagens
        setError(''); // Limpa erros
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSaving(true);

        if (!authToken) {
            navigate('/login');
            return;
        }

        const curriculoData = {
            resumo: resumo,
            linkedin: linkedin
        };

        let url = 'http://localhost:8080/api/curriculos';
        let method = 'POST';

        if (curriculoId) {
            url = `http://localhost:8080/api/curriculos/${curriculoId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(curriculoData),
            });

            if (response.ok) {
                const responseData = await response.json();
                setCurriculoId(responseData.id);
                setMessage('Currículo salvo com sucesso!');
                setResumo(responseData.resumo || '');
                setLinkedin(responseData.linkedin || '');
                setShowForm(true); // Garante que o formulário continua visível em modo de edição
            } else if (response.status === 409) {
                const errorText = await response.text();
                setError(errorText || 'Você já possui um currículo. Use a opção de editar.');
                setShowForm(false); // Em caso de conflito, esconde o formulário e mostra a mensagem
            } else if (response.status === 401 || response.status === 403) {
                console.error("MeuCurriculo: Não autorizado ou proibido ao salvar, redirecionando para login.");
                logout();
                navigate('/login');
            } else {
                const errorText = await response.text();
                throw new Error(`Falha ao salvar currículo: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('MeuCurriculo: Erro ao salvar currículo:', err);
            setError(err.message || 'Ocorreu um erro ao salvar o currículo.');
        } finally {
            setIsSaving(false);
        }
    };

    // Renderização condicional durante o carregamento inicial dos dados
    if (isLoadingData) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando seu currículo...</p>
            </div>
        );
    }

     const handleGoBackToDashboard = () => {
        // Redireciona com base na role do usuário
        if (userRoles.includes('ROLE_CANDIDATO')) {
            navigate('/candidato/dashboard');
        } else if (userRoles.includes('ROLE_EMPRESA')) {
            navigate('/empresa/dashboard');
        } else if (userRoles.includes('ROLE_ADMIN')) {
            navigate('/admin/dashboard'); // Ou um dashboard admin genérico, se tiver
        } else {
            navigate('/'); // Fallback para a página inicial se a role não for reconhecida
        }
    };

    // Renderização principal: se showForm é true, mostra o formulário; senão, mostra a mensagem de "não cadastrado"
    return (
        <div className="meu-curriculo-container">
            <button onClick={handleGoBackToDashboard} className="btn btn-secondary-back">
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
            </button>
            <h2>Meu Currículo</h2>
            <p className="form-subtitle">Gerencie suas informações profissionais</p>

            {/* Mensagens de Erro e Sucesso */}
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

            {showForm ? ( // Condição para exibir o formulário ou a mensagem
                <form onSubmit={handleSubmit} className="curriculo-form">
                    <div className="form-group">
                        <label htmlFor="resumo">Resumo Profissional</label>
                        <textarea
                            id="resumo"
                            value={resumo}
                            onChange={(e) => setResumo(e.target.value)}
                            placeholder="Escreva um breve resumo sobre suas qualificações e experiências."
                            rows="6"
                            disabled={isSaving}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="linkedin">Link do LinkedIn</label>
                        <input
                            type="url"
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://www.linkedin.com/in/seuperfil"
                            disabled={isSaving}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary-custom" disabled={isSaving || !resumo}>
                        <FontAwesomeIcon icon={faSave} /> {isSaving ? 'Salvando...' : 'Salvar Currículo'}
                    </button>
                </form>
            ) : (
                // Conteúdo para quando o currículo não está cadastrado
                <div>
                    <p>Você ainda não cadastrou seu currículo.</p>
                    <button onClick={handleCreateNewClick} className="btn btn-primary-custom" disabled={isSaving}>
                        Cadastrar Currículo
                    </button>
                </div>
            )}
        </div>
    );
};

export default MeuCurriculo;