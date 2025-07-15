import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './RecuperarSenha.css';
import logo from '../../assets/img/logo.png';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SolicitarRedefinicaoSenha = () => {
    // Estados locais para o formulário
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento para o botão
    const [error, setError] = useState('');         // Mensagens de erro da API
    const [successMessage, setSuccessMessage] = useState(''); // Mensagens de sucesso

    // Hook de navegação
    //const navigate = useNavigate();

    // Função para lidar com o envio do formulário de solicitação de redefinição
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        setError('');          // Limpa erros anteriores
        setSuccessMessage(''); // Limpa mensagens de sucesso anteriores
        setIsLoading(true);    // Inicia o carregamento

        // Validação básica do e-mail
        if (!email) {
            setError('Por favor, insira seu e-mail.');
            setIsLoading(false);
            return;
        }

        try {
            // Requisição POST para o endpoint do backend que solicita o token de redefinição
            const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/password-reset/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }), // Envia o e-mail no corpo da requisição
            });

            if (response.ok) {
                // Se a resposta for 2xx (sucesso)
                const message = await response.text(); // O backend retorna uma string de sucesso
                setSuccessMessage(message || 'Link de redefinição de senha enviado para o seu e-mail!');
                // Opcional: Você pode limpar o campo de e-mail aqui: setEmail('');
            } else {
                // Se a resposta não for 2xx (ex: 400 Bad Request, 500 Internal Server Error)
                const errorText = await response.text(); // Pega a mensagem de erro do backend
                setError(errorText || 'Ocorreu um erro ao solicitar a redefinição de senha.');
            }
        } catch (err) {
            // Captura erros de rede (ex: servidor offline)
            console.error('Erro na requisição de solicitação de redefinição:', err);
            setError('Erro de conexão. Tente novamente mais tarde.');
        } finally {
            // Finaliza o carregamento, independentemente do sucesso ou falha
            setIsLoading(false);
        }
    };

    return (
        <div className="containerr">
            <div className="auth-form-container"> {/* Pode reutilizar classes de estilo de login/cadastro */}
                <div className="logo"><img src={logo} alt="Logo" /></div>
                <h2 className="form-title">Redefinir Senha</h2>
                <p className="form-subtitle">Digite seu e-mail para receber o link de redefinição.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            disabled={isLoading}
                            required // Campo obrigatório
                        />
                    </div>

                    {/* Exibe mensagens de erro ou sucesso */}
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <button type="submit" className="btn btn-primary-custom" disabled={isLoading || !email}>
                        {isLoading ? ( // Exibe spinner e texto de carregamento
                            <>
                                Enviando...
                                <FontAwesomeIcon icon={faSpinner} className="spinner-icon" spin />
                            </>
                        ) : (
                            'Enviar Link de Redefinição' // Texto padrão do botão
                        )}
                    </button>
                </form>

                <p className="visitor-text">Lembrou da senha? <a href="/login">Faça login aqui</a></p>
            </div>
        </div>
    );
};

export default SolicitarRedefinicaoSenha;