import { useEffect, useState } from "react";
import "./CandidatosAplicados.css"; // Crie este arquivo CSS para estilização
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth ";
import {
  faArrowLeft,
  faBriefcase,
  faBuilding,
  faCalendarAlt,
  faEye,
  faSpinner,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CandidatosAplicados = () => {
  // Estado para armazenar a lista de candidaturas
  const [aplicacoes, setAplicacoes] = useState([]);

  // Estados de UI e feedback
  const [isLoading, setIsLoading] = useState(true); // Indica se os dados estão sendo carregados
  const [error, setError] = useState(""); // Mensagem de erro, se houver
  const [message, setMessage] = useState(""); // Mensagens de sucesso (ex: após atualização de status)

  // Hooks de navegação e autenticação
  const navigate = useNavigate();
  const { authToken, userRoles, logout } = useAuth(); // Obtém o token e as roles do contexto

  // useEffect para buscar as candidaturas quando o componente é montado
  useEffect(() => {
    const fetchAplicacoes = async () => {
      // Verifica se o token de autenticação existe
      if (!authToken) {
        console.log(
          "CandidatosAplicados: Token não encontrado, redirecionando para login."
        );
        navigate("/login");
        return;
      }

      setIsLoading(true); // Inicia o carregamento dos dados
      setError(""); // Limpa erros anteriores
      setMessage(""); // Limpa mensagens de sucesso

      try {
        // Endpoint para buscar candidaturas para a EMPRESA LOGADA
        // Este endpoint deve ser criado no backend: GET /api/candidaturas/by-empresa/me
        const response = await fetch(
          "http://localhost:8080/api/candidaturas/by-empresa/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Envia o token JWT
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAplicacoes(data); // Define a lista de candidaturas
        } else if (response.status === 404) {
          setAplicacoes([]); // Nenhuma candidatura encontrada
        } else if (response.status === 401 || response.status === 403) {
          // Se o token for inválido/expirado ou acesso proibido, desloga
          console.error(
            "CandidatosAplicados: Não autorizado ou proibido. Redirecionando."
          );
          logout();
          navigate("/login");
        } else {
          const errorText = await response.text();
          throw new Error(
            `Erro ao buscar candidaturas: ${response.status} - ${errorText}`
          );
        }
      } catch (err) {
        // Captura erros de rede
        console.error("CandidatosAplicados: Erro na requisição:", err);
        setError("Erro de conexão ao carregar candidaturas. Tente novamente.");
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    // Garante que o usuário tem a role de empresa ou admin antes de buscar candidaturas
    // (Isso é um fallback, pois o ProtectedRoute já faria essa checagem)
    if (
      userRoles.includes("ROLE_EMPRESA") ||
      userRoles.includes("ROLE_ADMIN")
    ) {
      fetchAplicacoes();
    } else if (!isLoading) {
      // Se não tem a role e não está carregando, pode ser um erro de permissão
      setError("Você não tem permissão para visualizar candidaturas.");
      setIsLoading(false); // Garante que o loading para
    }
  }, [authToken, navigate, logout, userRoles]); // Dependências do useEffect

  // Função para visualizar o currículo de um candidato
  const handleViewCurriculum = (candidatoId) => {
    // Redireciona para a página de visualização de currículo, passando o ID do candidato
    // Você precisará ter uma rota configurada em AppContent.jsx que aceite este ID.
    navigate(`/candidato/visualizar-curriculo/${candidatoId}`);
  };

  // Função para atualizar o status de uma candidatura (placeholder por enquanto)
  const handleUpdateStatus = (candidaturaId, newStatus) => {
    alert(`Atualizando candidatura ${candidaturaId} para status: ${newStatus}`);
    // Aqui você faria um PUT/PATCH para /api/candidaturas/{candidaturaId}/status no backend
  };

  // Renderização condicional durante o carregamento dos dados
  if (isLoading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Carregando candidaturas...</p>
      </div>
    );
  }

  const handleGoBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  // Renderização principal do componente
  return (
    <div className="candidatos-aplicados-container">
      {/* NOVO BOTÃO: Voltar ao Dashboard */}
      <button
        onClick={handleGoBackToDashboard}
        className="btn btn-secondary-back"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
      </button>
      <header className="page-header">
        <h2>Candidatos Aplicados</h2>
      </header>

      {/* Mensagens de Erro e Sucesso */}
      {error && (
        <p className="error-message">
          {error}
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="close-icon"
            onClick={() => setError("")}
          />
        </p>
      )}
      {message && (
        <p className="success-message">
          {message}
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="close-icon"
            onClick={() => setMessage("")}
          />
        </p>
      )}

      {/* Conteúdo principal: Lista de candidaturas ou mensagem de "nenhum" */}
      {aplicacoes.length === 0 && !isLoading ? ( // Se não há aplicações e não está carregando
        <div className="no-aplicacoes-message">
          <p>Nenhum candidato se aplicou às suas vagas ainda.</p>
          <Link to="/empresa/vagas/nova" className="btn btn-primary-custom">
            Criar Primeira Vaga
          </Link>
        </div>
      ) : (
        <div className="aplicacoes-list">
          {aplicacoes.map((aplicacao) => (
            <div key={aplicacao.id} className="aplicacao-card">
              <div className="card-header">
                <h3 className="card-title">
                  {aplicacao.candidato?.nome || "Candidato Desconhecido"}
                </h3>
                <span
                  className={`status-badge status-${aplicacao.status
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {aplicacao.status || "N/A"}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                  Vaga: {aplicacao.vaga?.titulo || "Vaga Desconhecida"}
                </p>
                <p className="card-text">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Data de Aplicação:{" "}
                  {aplicacao.dataCandidatura
                    ? new Date(aplicacao.dataCandidatura).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="card-text">
                  <FontAwesomeIcon icon={faBuilding} className="me-2" />
                  Empresa: {aplicacao.vaga?.empresa?.nome || "N/A"}
                </p>
                <p className="card-text">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Resumo do Candidato:{" "}
                  {aplicacao.candidato?.curriculo?.resumo?.substring(0, 150) ||
                    "N/A"}
                  ...
                </p>
              </div>
              <div className="card-actions">
                <button
                  onClick={() => handleViewCurriculum(aplicacao.candidato?.id)}
                  className="btn btn-view-curriculo"
                >
                  <FontAwesomeIcon icon={faEye} /> Ver Currículo Completo
                </button>
                {/* Exemplo de botão de ação para status (pode ser um dropdown ou modal para atualização) */}
                <button
                  onClick={() => handleUpdateStatus(aplicacao.id, "Em Análise")}
                  className="btn btn-update-status"
                >
                  Atualizar Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatosAplicados;
