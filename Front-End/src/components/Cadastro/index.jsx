import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from '../../assets/img/logo.png';

const Cadastro = () => {
    // Estados locais para os campos do formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_CANDIDATO'); // Estado para a role, com default Candidato
    const [isLoadingLocal, setIsLoadingLocal] = useState(false); // Estado de carregamento local para o botão
    const [localError, setLocalError] = useState(''); // Erros de validação do formulário
    const [successMessage, setSuccessMessage] = useState(''); // Mensagens de sucesso

    // Hooks de navegação e do AuthContext
    const navigate = useNavigate();
    const { register, error: authContextError, loading: authContextLoading } = useAuth(); // Use o hook useAuth

    // Função para lidar com o envio do formulário de cadastro
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        setLocalError(''); // Limpa erros locais anteriores
        setSuccessMessage(''); // Limpa mensagens de sucesso anteriores
        setIsLoadingLocal(true); // Inicia o carregamento local

        // Validações básicas do formulário antes de chamar a API
        if (!username || !email || !password || !role) {
            setLocalError('Por favor, preencha todos os campos e selecione o tipo de conta.');
            setIsLoadingLocal(false);
            return;
        }

        try {
            // Chama a função 'register' do AuthContext. Esta função já faz a requisição à API.
            // Ela retorna um objeto { success: boolean, message: string }.
            const result = await register(username, email, password, role);

            if (result.success) {
                setSuccessMessage(result.message || 'Usuário cadastrado com sucesso! Você pode fazer login agora.');
                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                navigate('/login'); // Redireciona para a página de login após o sucesso
            } else {
                // Se o registro no contexto falhar, a mensagem de erro já estará no 'result.message'.
                setLocalError(result.message || 'Ocorreu um erro no cadastro.');
            }
        } catch (err) {
            // Este catch captura erros de rede ou outros erros inesperados que não foram
            // tratados dentro da função 'register' do AuthContext.
            console.error('Erro na requisição de cadastro:', err);
            setLocalError('Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.');
        } finally {
            // Finaliza o estado de carregamento local, independentemente do sucesso ou falha
            setIsLoadingLocal(false);
        }
    };

    // Controla o estado de desabilitação dos inputs e botão de submit
    // Se 'isLoadingLocal' (local) ou 'authContextLoading' (do contexto) estiverem ativos, o formulário é desabilitado.
    const isFormDisabled = isLoadingLocal || authContextLoading;

    return (
        <div className="containerr">
            <div className="log-container"> {/* Reutilizando a classe log-container do login */}
                <div className="login-form-container"> {/* Reutilizando a classe login-form-container */}
                    <div className="logo"><img src={logo} alt="Logo" /></div>
                    <h2 className="form-title">Crie sua Conta</h2> {/* Título mais genérico */}
                    <p className="form-subtitle">Preencha os campos para se cadastrar</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Nome de Usuário</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Seu nome de usuário"
                                disabled={isFormDisabled}
                                required // Campo obrigatório
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                disabled={isFormDisabled}
                                required // Campo obrigatório
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                disabled={isFormDisabled}
                                required // Campo obrigatório
                            />
                        </div>

                        {/* Campo para selecionar o Tipo de Conta (Role) */}
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Tipo de Conta</label>
                            <select
                                id="role"
                                className="form-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                disabled={isFormDisabled}
                                required // Campo obrigatório
                            >
                                <option value="ROLE_CANDIDATO">Candidato</option>
                                <option value="ROLE_EMPRESA">Empresa</option>
                            </select>
                        </div>

                        {/* Exibe mensagens de erro (locais ou vindas da API via contexto) */}
                        {(localError || authContextError) && <p className="error-message">{localError || authContextError}</p>}
                        {/* Exibe mensagens de sucesso */}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        <button type="submit" className="btn btn-primary-custom mb-3" disabled={isFormDisabled || !username || !email || !password || !role}>
                            {isFormDisabled ? ( // Exibe spinner e texto de carregamento
                                <>
                                    Cadastrando
                                    <FontAwesomeIcon icon={faSpinner} className="spinner-icon" spin />
                                </>
                            ) : (
                                'Cadastrar' // Texto padrão do botão
                            )}
                        </button>
                    </form>

                    <p className="visitor-text">Já tem uma conta? <a href="/login">Faça login aqui</a></p>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;