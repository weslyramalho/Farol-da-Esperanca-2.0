import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/img/logo.png'; // Certifique-se de que o caminho para o logo está correto
import './RecuperarSenha.css'; // Estilos CSS para os componentes de recuperação de senha
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RedefinirSenha = () => {
    // Estados locais para os campos do formulário
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estado para armazenar o token obtido da URL
    const [token, setToken] = useState('');

    // Estados de UI e feedback
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento para o botão
    const [error, setError] = useState('');         // Mensagens de erro
    const [successMessage, setSuccessMessage] = useState(''); // Mensagens de sucesso

    // Hooks de navegação e para acessar parâmetros da URL
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Efeito para obter o token da URL quando o componente é montado
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token'); // Tenta pegar o parâmetro 'token' da URL
        if (tokenFromUrl) {
            setToken(tokenFromUrl); // Seta o token no estado local
            setError('');           // Limpa qualquer erro prévio
        } else {
            setError('Token de redefinição de senha não encontrado na URL.'); // Exibe erro se o token estiver ausente
        }
    }, [searchParams]); // Dependência: re-executa se os parâmetros da URL mudarem

    // Função para lidar com o envio do formulário de redefinição de senha
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        setError('');          // Limpa erros anteriores
        setSuccessMessage(''); // Limpa mensagens de sucesso anteriores
        setIsLoading(true);    // Inicia o carregamento

        // Validações básicas do formulário
        if (!token) {
            setError('Token de redefinição de senha inválido ou ausente.');
            setIsLoading(false);
            return;
        }
        if (!password || !confirmPassword) {
            setError('Por favor, preencha a nova senha e a confirmação.');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) { // Exemplo de validação mínima de tamanho de senha
            setError('A senha deve ter pelo menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        try {
            // Requisição POST para o endpoint do backend que redefine a senha
            const response = await fetch('http://localhost:8080/api/password-reset/reset', {
                method: 'POST', // CRÍTICO: Deve ser POST, pois envia dados no corpo
                headers: {
                    'Content-Type': 'application/json',
                },
                // Envia o token e a nova senha no corpo da requisição
                body: JSON.stringify({ token: token, newPassword: password }),
            });

            if (response.ok) {
                // Se a resposta for 2xx (sucesso)
                const message = await response.text(); // O backend retorna uma string de sucesso
                setSuccessMessage(message || 'Senha redefinida com sucesso! Redirecionando para o login...');
                // Redireciona para a página de login após um pequeno atraso
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // 3 segundos antes de redirecionar
            } else {
                // Se a resposta não for 2xx (ex: 400 Bad Request, 500 Internal Server Error)
                const errorText = await response.text(); // Pega a mensagem de erro do backend
                setError(errorText || 'Ocorreu um erro ao redefinir a senha. O token pode ser inválido ou ter expirado.');
            }
        } catch (err) {
            // Captura erros de rede (ex: servidor offline)
            console.error('Erro na requisição de redefinição de senha:', err);
            setError('Erro de conexão. Tente novamente mais tarde.');
        } finally {
            // Finaliza o carregamento, independentemente do sucesso ou falha
            setIsLoading(false);
        }
    };

    // Renderização do componente
    return (
        <div className="containerr">
            <div className="auth-form-container"> {/* Reutiliza classes de estilo comuns */}
                <div className="logo"><img src={logo} alt="Logo" /></div>
                <h2 className="form-title">Definir Nova Senha</h2>
                <p className="form-subtitle">Digite sua nova senha.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Nova Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            disabled={isLoading}
                            required // Campo obrigatório
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            disabled={isLoading}
                            required // Campo obrigatório
                        />
                    </div>

                    {/* Exibe mensagens de erro ou sucesso */}
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <button type="submit" className="btn btn-primary-custom" disabled={isLoading || !password || !confirmPassword || !token}>
                        {isLoading ? ( // Exibe spinner e texto de carregamento
                            <>
                                Redefinindo...
                                <FontAwesomeIcon icon={faSpinner} className="spinner-icon" spin />
                            </>
                        ) : (
                            'Redefinir Senha' // Texto padrão do botão
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RedefinirSenha;