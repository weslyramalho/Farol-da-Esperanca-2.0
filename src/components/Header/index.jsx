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
        <div className="collapse navbar-collapse z-3" id="navbarNavAltMarkup">
          <div className="navbar-nav naveg">
            <Link className="nav-link opc" to="/">HOME
            </Link>
            <Link to="/oportunidades" className="nav-link opc">
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
            
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
