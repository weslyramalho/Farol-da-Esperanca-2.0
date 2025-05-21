import { useEffect, useState } from "react";
import "./oportunidades.css";
import ListarVagas from "../../components/ListarVagas";
import CadastrarCurriculo from "../../components/CadastrarCurriculo";
import CadastroVagas from "../../components/CadastroVagas";
import DetalhesVagaModal from "../../components/DetalhesVagaModal";
import {
  BriefcaseIcon,
  HomeIcon,
  ListChecksIcon,
  UserPlusIcon,
} from "../../components/icons";
import Login from "../../components/Login";


import VisualizarCurriculoModal from "../../components/VisualizarCurriculoModal";
import VagasEmpresa from "../../components/VagasEmpresa";

const Oportunidades = () => {
  const [currentPage, setCurrentPage] = useState("oportunidades");
  const [escolha, setEscolha] = useState("");
  const [vagas, setVagas] = useState(() => {
    const vagasSalvas = localStorage.getItem("vagas");
    return vagasSalvas
      ? JSON.parse(vagasSalvas)
      : [
          {
            id: 1,
            titulo: "Desenvolvedor Frontend React Pleno",
            empresa: "InovaTech Soluções",
            local: "Remoto",
            descricao:
              "Procuramos um desenvolvedor React com experiência para criar interfaces incríveis e responsivas. Necessário conhecimento em Redux/Context API, testes unitários e metodologias ágeis.",
            salario: "R$ 6.500,00",
            tipoContrato: "CLT",
            dataCadastro: "10/05/2025",
          },
          {
            id: 2,
            titulo: "Analista de Marketing Digital Sênior",
            empresa: "Conecta Marketing",
            local: "São Paulo, SP",
            descricao:
              "Responsável por planejar e executar estratégias de marketing digital, incluindo SEO, SEM, mídias sociais e email marketing. Experiência com Google Analytics e Ads é fundamental.",
            salario: "R$ 8.000,00",
            tipoContrato: "PJ",
            dataCadastro: "12/05/2025",
          },
          {
            id: 3,
            titulo: "Engenheiro de Software Backend Java",
            empresa: "TechGlobal",
            local: "Rio de Janeiro, RJ",
            descricao:
              "Desenvolvimento e manutenção de APIs RESTful em Java com Spring Boot. Experiência com bancos de dados relacionais e NoSQL, microserviços e Docker.",
            salario: "A combinar",
            tipoContrato: "CLT",
            dataCadastro: "15/05/2025",
          },
        ];
  });

  const [curriculos, setCurriculos] = useState(() => {
    const curriculosSalvos = localStorage.getItem("curriculos");
    return curriculosSalvos ? JSON.parse(curriculosSalvos) : [
      {
      id: 1,
      nome: "João Silva",
      email: "joao@exemplo.com",
      telefone: "(11) 99999-9999",
      resumo: "Desenvolvedor com 5 anos de experiência...",
      dataEnvio: "2023-05-15"
    },
    ];
  });
 const [curriculoSelecionado, setCurriculoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [loc, setLoc] = useState("");

  useEffect(() => {
    localStorage.setItem("vagas", JSON.stringify(vagas));
  }, [vagas]);

  useEffect(() => {
    localStorage.setItem("curriculos", JSON.stringify(curriculos));
  }, [curriculos]);

  const abrirModal = (curriculo) => {
    setCurriculoSelecionado(curriculo);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setCurriculoSelecionado(null);
  };

  const setarInicio = () => {
    setCurrentPage("oportunidades");
    setEscolha("");
  };
  const handleEmpresa = () => {
    setCurrentPage("login");
    setLoc("Empresa");
  };

   const handleCandidato = () => {
    setCurrentPage("login");
    setLoc("Candidato");
  };
  const liberaAcesso = () => {
    if (loc === "Empresa") {
      setCurrentPage("vagasempresa");
      setEscolha(loc);
    } else if(loc == "Candidato") {
      setCurrentPage("listarVagas");
      setEscolha("Candidato");
    }

  };
  const adicionarNovaVaga = (novaVaga) => {
    setVagas((prevVagas) => [novaVaga, ...prevVagas]);
    setCurrentPage("listarVagas");
  };

  const adicionarNovoCurriculo = (novoCurriculo) => {
    setCurriculos((prevCurriculos) => [...prevCurriculos, novoCurriculo]);
    alert("Currículo enviado com sucesso!");
  };

  const handleVerDetalhesVaga = (vaga) => {
    setVagaSelecionada(vaga);
  };

  const handleFecharModalDetalhes = () => {
    setVagaSelecionada(null);
  };

  const handleFecharModalCurriculo =() => {
    setCurriculoSelecionado(null);
  }

  const handleAplicarCurriculoParaVaga = (vaga) => {
    console.log(
      `Usuário aplicou para a vaga: ${vaga.titulo} na empresa ${vaga.empresa}`
    );
  };

  const handlePesquisaChange = (event) => {
    setTermoPesquisa(event.target.value);
  };
const handleAtualizarVaga = (vagaAtualizada) => {
  setVagas(vagas.map(v => v.id === vagaAtualizada.id ? vagaAtualizada : v));
};

const handleRemoverVaga = (id) => {
  setVagas(vagas.filter(v => v.id !== id));
};
  const vagasFiltradas = vagas.filter((vaga) => {
    const termo = termoPesquisa.toLowerCase();
    return (
      vaga.titulo.toLowerCase().includes(termo) ||
      vaga.empresa.toLowerCase().includes(termo) ||
      vaga.local.toLowerCase().includes(termo)
    );
  });

  const renderPage = () => {
    switch (currentPage) {
      case "vagasempresa":
        return (
  <div>
    <CadastroVagas onNovaVaga={adicionarNovaVaga} />
    <VagasEmpresa 
      vagas={vagas} 
      onAtualizarVaga={handleAtualizarVaga} 
      onRemoverVaga={handleRemoverVaga} 
    />
  </div>
);
      case "visualizarcurriculomodal":
        return(
          <>
           <VisualizarCurriculoModal 
        onClose={handleFecharModalCurriculo}
        curriculo={curriculoSelecionado} 
        />
         <div className="container mt-4">
      <h2>Lista de Currículos</h2>
      
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {curriculos.map(curriculo => (
            <tr key={curriculo.id}>
              <td>{curriculo.nome}</td>
              <td>{curriculo.email}</td>
              <td>
                <button 
                  className="btn btpadrao btn-sm"
                  onClick={() => abrirModal(curriculo)}
                >
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && (
        <VisualizarCurriculoModal 
          curriculo={curriculoSelecionado} 
          onClose={fecharModal} 
        />
      )}
    </div>
    </>
    );
    
      case "login":
        return <Login isLogado={liberaAcesso} />;
      case "cadastroVagas":
        return <CadastroVagas onNovaVaga={adicionarNovaVaga} />;
      case "cadastrarCurriculo":
        return <CadastrarCurriculo onNovoCurriculo={adicionarNovoCurriculo} />;
      case "listarVagas":
        return (
          <ListarVagas
            vagas={vagasFiltradas}
            onAplicar={handleVerDetalhesVaga}
            termoPesquisa={termoPesquisa}
            onPesquisaChange={handlePesquisaChange}
            totalVagasSemFiltro={vagas.length}
          />
        );
        
      case "oportunidades":
      default:
        return (
          <div className="container">
            <div
              className="card p-3 p-md-5 shadow-sm mx-auto text-center"
              style={{ maxWidth: "800px" }}
            >
              <div className="card-body">
                <h1 className="card-title display-5 text-primary mb-3">
                  Bem-vindo ao Portal de Vagas!
                </h1>
                <p className="lead mb-4">
                  Encontre as melhores oportunidades de carreira ou cadastre sua
                  vaga para encontrar o candidato ideal.
                </p>
                <div className="flex g-3">
                  <button
                    className="col-md-6  border-0 p-2 m-2"
                    onClick={handleCandidato}
                  >
                    <div className="p-4 bg-light border rounded h-100">
                      <h2 className="h4 text-primary-emphasis mb-2">
                        Para Candidatos
                      </h2>
                      <p>
                        Cadastre seu currículo e explore as vagas disponíveis.
                        Sua próxima oportunidade está aqui!
                      </p>
                    </div>
                  </button>
                  <button
                    className="col-md-6 border-0 p-2 m-2"
                    onClick={handleEmpresa}
                  >
                    <div className="p-4 bg-light border rounded h-100">
                      <h2 className="h4 text-success-emphasis mb-2">
                        Para Empresas
                      </h2>
                      <p>
                        Anuncie suas vagas gratuitamente e alcance milhares de
                        profissionais qualificados.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="cor text-white shadow-sm sticky-top">
        <nav className="cor navbar navbar-expand-sm navbar-dark">
          <div className="container">
            <span className="navbar-brand h1 mb-0 fw-bold">
              Portal de Empregos
            </span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    onClick={setarInicio}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <HomeIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">Início</span>
                  </button>
                </li>

                <li
                  className={`nav-item painel ${
                    escolha == "Candidato" ? "ativo" : "inativo"
                  }`}
                >
                  <button
                    onClick={() => setCurrentPage("listarVagas")}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <ListChecksIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">Ver Vagas</span>
                  </button>
                </li>
                <li
                  className={`nav-item painel ${
                    escolha == "Candidato" ? "ativo" : "inativo"
                  }`}
                >
                  <button
                    onClick={() => setCurrentPage("cadastrarCurriculo")}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <UserPlusIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">
                      Cadastrar Currículo
                    </span>
                  </button>
                </li>

                <li
                  className={`nav-item painel ${
                    escolha == "Empresa" ? "ativo" : "inativo"
                  }`}
                >
                  <button
                    onClick={() => setCurrentPage("vagasempresa")}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <BriefcaseIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">
                      Vagas
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentPage("visualizarcurriculomodal")}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <BriefcaseIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">
                      visualizar curriculo
                    </span>
                  </button>
                </li>

                <li
                  className={`nav-item painel ${
                    escolha == "Empresa" ? "ativo" : "inativo"
                  }`}
                >
                  <button
                    onClick={() => setCurrentPage("cadastroVagas")}
                    className="nav-link btn btn-link text-white d-flex align-items-center"
                  >
                    <BriefcaseIcon />{" "}
                    <span className="d-none d-sm-inline ms-1">
                      Cadastrar Vaga
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container flex-grow-1 py-4 py-md-5">{renderPage()}</main>

      {vagaSelecionada && (
        <DetalhesVagaModal
          vaga={vagaSelecionada}
          onClose={handleFecharModalDetalhes}
          onAplicarCurriculo={handleAplicarCurriculoParaVaga}
        />
      )}
    </div>
  );
};

export default Oportunidades;
