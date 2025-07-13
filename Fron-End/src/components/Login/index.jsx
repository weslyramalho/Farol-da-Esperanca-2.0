import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";

import logo from "../../assets/img/logo.png";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/useAuth ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login =()=>{

    // Estados locais para o formulário
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Usado como 'username' para o backend
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento local para o botão
  const [localError, setLocalError] = useState(""); // Erros de validação do formulário

  // Hooks do React Router
  const navigate = useNavigate();

  // Hooks do AuthContext (para login e erros da API)
  const { login, error: authContextError, loading: authContextLoading } = useAuth(); // 'loading' do contexto para desabilitar inputs

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Funções para lidar com a mudança nos campos de input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setLocalError(""); // Limpa erro local ao digitar
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLocalError(""); // Limpa erro local ao digitar
  };

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento da página
    setLocalError(""); // Limpa erros locais antes de um novo envio
    
    // Inicia o carregamento local
    setIsLoading(true); 

    // Validações básicas do formulário (executadas antes da chamada à API)
    if (!email) {
      setLocalError("Por favor, insira seu Username/Email.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setLocalError("Por favor, insira sua senha.");
      setIsLoading(false);
      return;
    }

    try {
      // Chama a função login do contexto. Esta função é assíncrona e faz a requisição à API.
      // Ela retorna `true` para sucesso ou `false` para falha.
      const success = await login(email, password);

      if (success) {
        // Se a função login do contexto retornar true, o login foi bem-sucedido.
        // O redirecionamento para o dashboard correto (candidato/empresa/admin)
        // é tratado DENTRO do AuthProvider (no useEffect que observa userRoles)
        // e no App.js.
        alert("Login bem-sucedido! Redirecionando...");
        // Não é necessário um 'navigate' explícito aqui, pois o AuthProvider/App.js cuidará disso.
      } else {
        // Se a função login do contexto retornar false, houve uma falha.
        // A mensagem de erro da API já estará disponível em 'authContextError'.
        setLocalError(authContextError || "Nome de usuário ou senha inválidos.");
      }
    } catch (err) {
      // Este catch captura erros de rede ou outros erros inesperados que não foram
      // tratados dentro da função 'login' do AuthContext.
      console.error("Erro na requisição de login:", err);
      setLocalError("Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.");
    } finally {
      // Finaliza o estado de carregamento local, independentemente do sucesso ou falha
      setIsLoading(false);
    }
  };

  // Função para lidar com o clique no botão "Cadastre-se"
  const handleRegisterClick = () => {
    navigate("/usuario/cadastro"); // Redireciona para a rota de cadastro definida em App.js
  };

  // Controla o estado de desabilitação dos inputs e botão de submit
  // Se 'isLoading' (local) ou 'authContextLoading' (do contexto) estiverem ativos, o formulário é desabilitado.
  const isFormDisabled = isLoading || authContextLoading;
  return (
    <div className="containerr">
      <div className="log-container">
        <div className="login-form-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2 className="form-title">
            Olá, Bem-vindo(a) ao Portal de oportunidades
          </h2>
          <p className="form-subtitle">
            Digite suas informações para fazer login em sua conta
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Username/Email
              </label>
              <div className="input-group">
                <input
                  type="text" // Tipo texto para aceitar tanto username quanto email
                  className="form-control"
                  id="email" // ID pode permanecer 'email' para fins de auto-preenchimento
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Seu username ou email"
                  disabled={isFormDisabled}
                  required // Campo obrigatório
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"} // Alterna visibilidade da senha
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  disabled={isFormDisabled}
                  required // Campo obrigatório
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    className="password-icon"
                  />
                </span>
              </div>
              <a
                href="/solicitar-senha" // Link para a página de recuperação de senha
                className={`forgot-password-link ${
                  isFormDisabled ? "disabled" : ""
                }`}
              >
                Esqueceu sua senha?
              </a>
            </div>

            {/* Exibe mensagens de erro (locais ou vindas da API via contexto) */}
            {(localError || authContextError) && <p className="error-message">{localError || authContextError}</p>}

            <button
              type="submit"
              className="btn btn-primary-custom mb-3"
              disabled={isFormDisabled || !email || !password} // Botão desabilitado se carregando ou campos vazios
            >
              {isFormDisabled ? ( // Exibe spinner e texto de carregamento
                <>
                  Acessando
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="spinner-icon"
                    spin
                  />
                </>
              ) : (
                "Acessar" // Texto padrão do botão
              )}
            </button>
          </form>

          <p className="visitor-text">
            Se não tem login e senha clique no botão abaixo{" "}
          </p>
          <button
            type="button"
            className="btn btn-outline-secondary-custom"
            onClick={handleRegisterClick} // Botão para ir para a página de cadastro
            disabled={isFormDisabled}
          >
            Cadastre-se
          </button>
        </div>
      </div>
      </div>
    
  )
}

export default Login