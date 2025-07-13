import "./header.css";
import logo from '../../assets/img/logo.png'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth ";


const Header = () => {
  const { isAuthenticated, logout } = useAuth(); // Obtenha o estado de autenticação e a função logout
  const navigate = useNavigate(); // Obtenha a função navigate

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto AuthContext
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <nav className="navbar navbar-expand-lg head">
      <div className="container-fluid">
        <img
          className="img-fluid"
          src={logo}
          alt="Logo do Portal" // Adicione um alt text para acessibilidade
          width={337}
          height={118}
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse z-3" id="navbarNavAltMarkup">
          <div className="navbar-nav naveg">
            <Link className="nav-link opc" to="/">HOME
            </Link>
            <Link to="/vagas-em-aberto" className="nav-link opc"> {/* Ajustado para listar vagas publicas */}
              VAGAS
            </Link>
            <Link to="/oportunidades" className="nav-link opc"> {/* Se esta rota for diferente de "Vagas em Aberto" */}
              OPORTUNIDADES
            </Link>
            <Link to="/recursoseapoio" className="nav-link opc">
              RECURSOS E APOIO
            </Link>
          
            <Link to="/historiasdesucesso" className="nav-link opc ">
              HISTÓRIAS DE SUCESSO
            </Link>
            <Link to="/sobrenos" className="nav-link opc">
              SOBRE NÓS
            </Link>
            
            {/* NOVO: BOTÕES DE LOGIN E SAIR */}
            {!isAuthenticated ? ( // Se NÃO estiver autenticado, mostra o botão de Login
              <Link to="/login" className=" btn btn-primary"> {/* Use ms-md-3 para margem à esquerda em telas médias */}
                Login
              </Link>
            ) : ( // Se ESTIVER autenticado, mostra o botão de Sair
              <button onClick={handleLogout} className="btn btn-danger ms-md-3">
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
