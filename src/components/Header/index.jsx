import "./header.css";
import logo from '../../assets/img/logo.png'
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg  head">
      <div className="container-fluid">
        <img
          className="img-fluid"
          src={logo}
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
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav naveg">
            <Link to="/">
            <a className="nav-link opc">
              HOME
            </a>
            </Link>
            <Link to="/oportunidades">
            <a className="nav-link opc">
              OPORTUNIDADES
            </a>
            </Link>
           <Link to="/recursoseapoio">
           <a className="nav-link opc">
              RECURSOS E APOIO
            </a>
           </Link>
           <Link to="/historiasdesucesso">
           <a className="nav-link opc ">
              HISTÓRIAS DE SUCESSO
            </a>
           </Link>
            <Link to="/sobrenos">
            <a className="nav-link opc">
              SOBRE NÓS
            </a>
           </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
