import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from "../../assets/img/logo.png"
import "./login.css"
import {  faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";


// Simulação de uma função de API
const fakeApiLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Lógica de validação SIMULADA
      // Em um cenário real, você faria uma chamada fetch/axios para seu backend
      if (email === 'candidato@email.com' && password === 'senha123') { // email
        resolve({ success: true, message: 'Login bem-sucedido!', token: 'fake-jwt-token-12345' });
      } else if (email === 'empresa@email.com' && password === 'senha123') { // Outro usuário válido
        resolve({ success: true, message: 'Login bem-sucedido para empresa!', token: 'fake-jwt-token-empresa' });
      }
      else {
        reject({ success: false, message: 'Email ou senha inválidos.' });
      }
    }, 1500); // Simula delay da rede
  });
};

const Login = ({isLogado}) => {
const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Valor inicial email
  const [password, setPassword] = useState(""); // Valor inicial da senha
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

 // const [isEmailValid, setIsEmailValid] = useState(false); // Para o ícone de check do email
  const [isPasswordEntered, setIsPasswordEntered] = useState(false); // Para o ícone de check da senha


 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
   
    setError(''); // Limpa erro ao digitar
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordEntered(value.length > 0); // Mostra check se algo foi digitado
    setError(''); // Limpa erro ao digitar
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento da página
    setError(''); // Limpa erros anteriores
    setIsLoading(true);
    isLogado(isLoading);

    if (!email) {
        setError('Por favor, insira um Email valido.');
        setIsLoading(false);
        return;
    }
    if (!password) {
        setError('Por favor, insira sua senha.');
        setIsLoading(false);
        return;
    }

    try {
      // Chamada à API (simulada)
      const response = await fakeApiLogin(email, password);
      console.log('Login bem-sucedido:', response);
      alert(`Login bem-sucedido! Token: ${response.token}`); // Exemplo de feedback
      // Aqui você redirecionaria o usuário ou armazenaria o token:
      // localStorage.setItem('authToken', response.token);
      // window.location.href = '/dashboard'; // Ou usando React Router

    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Ocorreu um erro ao tentar fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="log-container">
        <div className="login-form-container">
          {/* Se você tiver um arquivo de imagem para o logo, substitua o div abaixo */}
          <div className="logo"><img src={logo} ></img></div>
          <h2 className="form-title">Olá, Bem-vindo(a) ao Portal de oportunidades</h2>
          <p className="form-subtitle">Digite suas informações para fazer login em sua conta</p>

          <form  onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="fulanodetal@meuemal.com"
                  disabled={isLoading}
                />
                {/* O ícone de check verde no input do email */}

                <span className="input-group-text">
                {/* <FontAwesomeIcon icon={faCheckCircle} className="valid-icon" /> */}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password Strength" className="form-label">Senha</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${isPasswordEntered && password.length > 0 ? 'is-valid' : ''}`} // Adiciona classe is-valid se algo foi digitado
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  disabled={isLoading}
                />
                {/* Ícone de olho e check verde no input da senha */}
                <span className="input-group-text">
                    
                   
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    className="password-icon"
                  />
                  
                </span>
              </div>
              <a href="#" className={`forgot-password-link ${isLoading ? 'disabled' : ''}`}>Esqueceu sua senha?</a>
            </div>

             {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn btn-primary-custom mb-3"  disabled={isLoading || !email || !password}>
                 {isLoading ? (
                <>
                  Acessando
                  <FontAwesomeIcon icon={faSpinner} className="spinner-icon" spin />
                </>
              ) : (
                'Acessar'
              )}
            </button>
          </form>

          <p className="visitor-text">Se não tem login e senha clique no botão abaixo </p>
          <button type="button" className="btn btn-outline-secondary-custom" disabled={isLoading}>
            Cadastre-se
          </button>
        </div>
      </div>

      </div>
    
  );
};

export default Login;