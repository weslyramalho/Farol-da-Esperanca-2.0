import './EditarVaga.css'; // Crie este arquivo CSS
import { faArrowLeft, faSave, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth ';

const EditarVaga = () => {
    // Estados para os campos do formulário de vaga
    const [titulo, setTitulo] = useState('');
    const [local, setLocal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [salario, setSalario] = useState(''); // Armazenar como string para o input
    const [tipoContrato, setTipoContrato] = useState(''); // TipoContrato é um Enum no backend

    // ID da vaga vindo da URL
    const { vagaId } = useParams();

    // Estados de UI e feedback
    const [isLoadingData, setIsLoadingData] = useState(true); // Carregamento inicial dos dados da vaga
    const [isSaving, setIsSaving] = useState(false);         // Carregamento do envio do formulário
    const [error, setError] = useState('');                  // Mensagens de erro
    const [message, setMessage] = useState('');              // Mensagens de sucesso

    const navigate = useNavigate();
    const { authToken, logout } = useAuth(); // Precisamos do token, roles e logout

    // --- useEffect para buscar os dados da vaga existente ---
    useEffect(() => {
        const fetchVagaDetails = async () => {
            if (!authToken) {
                navigate('/login'); // Redireciona se não há token
                return;
            }

            setIsLoadingData(true);
            setError('');
            setMessage('');

            try {
                // Endpoint para buscar a vaga por ID (PÚBLICO)
                const response = await fetch(`http://localhost:8080/api/vagas/${vagaId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("EditarVaga: Dados da vaga recebidos:", data);

                    // Preenche os estados do formulário com os dados da vaga
                    setTitulo(data.titulo || '');
                    setLocal(data.local || '');
                    setDescricao(data.descricao || '');
                    setSalario(data.salario !== null && data.salario !== undefined ? data.salario.toString() : ''); // Converte para string
                    setTipoContrato(data.tipoContrato || '');

                } else if (response.status === 404) {
                    setError('Vaga não encontrada para edição.');
                  //  setVaga(null); // Define como nulo se não encontrar
                } else {
                    const errorText = await response.text();
                    setError(`Erro ao carregar vaga: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error('EditarVaga: Erro de conexão ao carregar vaga:', err);
                setError('Erro de conexão ao carregar os detalhes da vaga. Tente novamente.');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (vagaId) { // Só busca se houver um ID na URL
            fetchVagaDetails();
        } else {
            setError('ID da vaga não fornecido na URL.');
            setIsLoadingData(false);
        }
    }, [vagaId, authToken, navigate, logout]); // Dependências

    // Função para lidar com o envio do formulário de atualização
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSaving(true);

        if (!authToken) {
            navigate('/login');
            return;
        }

        // Validações básicas do formulário
        if (!titulo || !local || !descricao || !salario || !tipoContrato) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            setIsSaving(false);
            return;
        }
        if (isNaN(parseFloat(salario))) {
            setError('Salário deve ser um número válido.');
            setIsSaving(false);
            return;
        }

        // Criar o objeto de dados da vaga para enviar ao backend
        const vagaData = {
            id: vagaId, // O ID é essencial para a operação PUT
            titulo: titulo,
            local: local,
            descricao: descricao,
            salario: parseFloat(salario), // Converter salário para número
            tipoContrato: tipoContrato
        };

        try {
            // Requisição PUT para o endpoint de atualização de vaga
            const response = await fetch(`http://localhost:8080/api/vagas/${vagaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Envia o token JWT
                },
                body: JSON.stringify(vagaData),
            });

            if (response.ok) { // 200 OK é o esperado para sucesso de PUT
                const responseData = await response.json(); // Backend deve retornar a vaga atualizada
                setMessage(`Vaga "${responseData.titulo}" atualizada com sucesso!`);
                // Opcional: Redirecionar para a lista de vagas da empresa após um tempo
                // setTimeout(() => navigate('/empresa/vagas'), 1500);
            } else if (response.status === 401 || response.status === 403) {
                setError('Não autorizado para editar esta vaga. Verifique suas permissões.');
                logout();
                navigate('/login');
            } else if (response.status === 404) {
                 setError('Vaga não encontrada para edição.');
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar vaga: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('EditarVaga: Erro na requisição:', err);
            setError(err.message || 'Ocorreu um erro ao atualizar a vaga. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    // Função para voltar à lista de Minhas Vagas
    const handleGoBackToList = () => {
        navigate('/empresa/vagas');
    };

    // Renderização condicional durante o carregamento inicial dos dados
    if (isLoadingData) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Carregando dados da vaga para edição...</p>
            </div>
        );
    }

    // Renderização em caso de erro ao carregar os dados iniciais
    if (error && !isLoadingData) { // Mostra erro se já terminou de carregar e deu erro
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={handleGoBackToList} className="btn btn-secondary-back">
                    <FontAwesomeIcon icon={faArrowLeft} /> Voltar para Minhas Vagas
                </button>
            </div>
        );
    }

    return (
        <div className="editar-vaga-container">
            <button onClick={handleGoBackToList} className="btn btn-secondary-back">
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar para Minhas Vagas
            </button>
            <h2>Editar Vaga</h2>
            <p className="form-subtitle">Altere os detalhes da sua vaga publicada.</p>

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

            <form onSubmit={handleSubmit} className="vaga-form">
                <div className="form-group">
                    <label htmlFor="titulo">Título da Vaga</label>
                    <input
                        type="text"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ex: Desenvolvedor Front-end Pleno"
                        disabled={isSaving}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="local">Local da Vaga</label>
                    <input
                        type="text"
                        id="local"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        placeholder="Ex: São Paulo - SP (Remoto)"
                        disabled={isSaving}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descricao">Descrição da Vaga</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Detalhe as responsabilidades, requisitos e benefícios da vaga."
                        rows="8"
                        disabled={isSaving}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="salario">Salário (R$)</label>
                    <input
                        type="number"
                        id="salario"
                        value={salario}
                        onChange={(e) => setSalario(e.target.value)}
                        placeholder="Ex: 3500.00"
                        step="0.01"
                        disabled={isSaving}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tipoContrato">Tipo de Contrato</label>
                    <select
                        id="tipoContrato"
                        value={tipoContrato}
                        onChange={(e) => setTipoContrato(e.target.value)}
                        disabled={isSaving}
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="ESTAGIO">Estágio</option>
                        <option value="FREELANCER">Freelancer</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary-custom" disabled={isSaving}>
                    <FontAwesomeIcon icon={faSave} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default EditarVaga;