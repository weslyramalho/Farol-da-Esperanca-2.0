import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faSpinner,
  faTimesCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./VisualizarCurriculo.css"; // Estilos CSS para este componente
import { useAuth } from "../../context/useAuth ";

const VisualizarCurriculo = () => {
  // Estados para armazenar os dados do currículo
  const [curriculo, setCurriculo] = useState(null);

  // Estados de UI e feedback
  const [isLoadingData, setIsLoadingData] = useState(true); // Indica se os dados iniciais estão sendo carregados
  const [error, setError] = useState(""); // Mensagens de erro da API
  const [message, setMessage] = useState(""); // Mensagens de sucesso (ex: após exclusão)

  // Estados para a confirmação de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // Controla visibilidade da confirmação
  const [isDeleting, setIsDeleting] = useState(false); // Indica que a exclusão está em andamento

  // Hooks de navegação e autenticação (do contexto)
  const navigate = useNavigate();
  const { authToken, userRoles, logout, userId } = useAuth(); // Obtém o token, roles e ID do usuário logado
  const { candidatoId: urlCandidatoId } = useParams(); // Pega o ID do candidato da URL (se existir)

  // --- Lógica para determinar o contexto da visualização ---
  // isMyCurriculum: True se o usuário logado está vendo o PRÓPRIO currículo
  // (Ou não há ID na URL, significando a rota 'by-candidate/me', ou o ID da URL é o do usuário logado)
  const isMyCurriculum = !urlCandidatoId || urlCandidatoId === String(userId);

  // Roles do usuário logado para controle de permissões de UI
  const isLoggedAsCandidato = userRoles.includes("ROLE_CANDIDATO");
  const isLoggedAsEmpresa = userRoles.includes("ROLE_EMPRESA");
  const isLoggedAsAdmin = userRoles.includes("ROLE_ADMIN");

  // Função assíncrona para buscar os dados do currículo do backend
  const fetchCurriculoData = async () => {
    // Verifica se o token de autenticação existe
    if (!authToken) {
      console.log(
        "VisualizarCurriculo: Token não encontrado, redirecionando para login."
      );
      navigate("/login"); // Redireciona se não há token
      return;
    }

    setIsLoadingData(true); // Inicia o carregamento
    setError(""); // Limpa erros anteriores
    setMessage(""); // Limpa mensagens de sucesso

    try {
      let url = "";
      // Constrói a URL da API:
      // Se um ID de candidato está presente na URL (visualizando currículo de OUTRO), usa esse ID.
      // Caso contrário (se não houver ID na URL), usa o endpoint 'by-candidate/me' para o próprio currículo.
      if (urlCandidatoId) {
        url = `https://245c2fba6c85.ngrok-free.app/api/curriculos/by-candidate/${urlCandidatoId}`;
      } else {
        url = "https://245c2fba6c85.ngrok-free.app/api/curriculos/by-candidate/me";
      }

      console.log("VisualizarCurriculo: Buscando currículo da URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Envia o token JWT no cabeçalho Authorization
        },
      });

      if (response.ok) {
        const data = await response.json(); // Pega os dados do currículo
        console.log("VisualizarCurriculo: Dados do currículo recebidos:", data);
        setCurriculo(data); // Define os dados no estado
      } else if (response.status === 404) {
        // Se o currículo não for encontrado (404 Not Found)
        setCurriculo(null); // Define como nulo para indicar que não existe
        if (isMyCurriculum) {
          setError("Seu currículo ainda não foi cadastrado.");
        } else {
          setError("Currículo deste candidato não foi encontrado.");
        }
      } else if (response.status === 401 || response.status === 403) {
        // Se o token for inválido/expirado ou acesso proibido, desloga
        console.error(
          "VisualizarCurriculo: Não autorizado ou proibido, redirecionando para login."
        );
        logout(); // Desloga o usuário
        navigate("/login");
      } else {
        // Captura outros erros HTTP
        const errorText = await response.text();
        setError(`Erro ao buscar currículo: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      // Captura erros de rede ou outros erros inesperados no fetch
      console.error(
        "VisualizarCurriculo: Erro de conexão ao buscar currículo:",
        err
      );
      setError("Erro de conexão ao buscar seu currículo. Tente novamente.");
    } finally {
      setIsLoadingData(false); // Finaliza o carregamento dos dados
    }
  };

  // useEffect para disparar a busca de dados quando o componente é montado ou dependências mudam
  useEffect(() => {
    fetchCurriculoData();
  }, [authToken, navigate, logout, urlCandidatoId, userId]); // Dependências: re-executa se token, navegação, ID da URL ou ID do usuário logado mudarem.

  // Função para lidar com o clique no botão "Editar" (redireciona para a página de edição)
  const handleEdit = () => {
    navigate("/candidato/curriculo"); // Redireciona para a página de edição do próprio currículo
  };

  // Função para exibir a confirmação de exclusão
  const handleDelete = () => {
    setDeleteConfirmation(true); // Ativa a exibição da caixa de confirmação
  };

  // Função para confirmar e executar a exclusão do currículo via API
  const confirmDelete = async () => {
    if (!curriculo || !curriculo.id) {
      console.error("ID do currículo inválido para exclusão.");
      setError("Não foi possível excluir: Currículo ou ID inválido.");
      setDeleteConfirmation(false);
      return;
    }

    setIsDeleting(true); // Ativa o estado de exclusão
    setError(""); // Limpa erros anteriores
    setMessage(""); // Limpa mensagens anteriores
    setDeleteConfirmation(false); // Esconde a confirmação enquanto exclui

    const token = localStorage.getItem("authToken"); // Pega o token diretamente do localStorage
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Requisição DELETE para o endpoint do backend
      const response = await fetch(
        `https://245c2fba6c85.ngrok-free.app/api/curriculos/${curriculo.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }, // Envia o token JWT
        }
      );

      if (response.ok) {
        setMessage("Currículo excluído com sucesso!");
        setCurriculo(null); // Limpa o estado do currículo para que a mensagem "não cadastrado" apareça
        // Opcional: Redirecionar para o dashboard após a exclusão
        // navigate('/candidato/dashboard');
      } else if (response.status === 401 || response.status === 403) {
        console.error(
          "VisualizarCurriculo: Não autorizado ou proibido ao excluir, redirecionando para login."
        );
        logout();
        navigate("/login");
      } else if (response.status === 404) {
        setError("Currículo não encontrado para exclusão.");
      } else {
        const errorText = await response.text();
        throw new Error(
          `Falha ao excluir currículo: ${response.status} - ${errorText}`
        );
      }
    } catch (err) {
      // Captura erros de rede
      console.error("VisualizarCurriculo: Erro ao excluir currículo:", err);
      setError("Erro de conexão ao excluir currículo. Tente novamente.");
    } finally {
      setIsDeleting(false); // Finaliza o estado de exclusão
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setDeleteConfirmation(false); // Esconde a confirmação
  };

  // Renderização condicional durante o carregamento inicial dos dados
  if (isLoadingData) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Carregando currículo...</p>
      </div>
    );
  }

  // --- NOVA LÓGICA: Função para Voltar ao Dashboard ---
  const handleGoBackToDashboard = () => {
    // Redireciona com base na role do usuário
    if (userRoles.includes("ROLE_CANDIDATO")) {
      navigate("/candidato/dashboard");
    } else if (userRoles.includes("ROLE_EMPRESA")) {
      navigate("/empresa/dashboard");
    } else if (userRoles.includes("ROLE_ADMIN")) {
      navigate("/admin/dashboard"); // Ou um dashboard admin genérico, se tiver
    } else {
      navigate("/"); // Fallback para a página inicial se a role não for reconhecida
    }
  };

  // Renderização principal do componente
  return (
    <div className="visualizar-curriculo-container">
      {/* Título dinâmico: "Meu Currículo" ou "Currículo de [Nome do Candidato]" */}
      <h2>
        {isMyCurriculum
          ? "Meu Currículo"
          : isLoggedAsEmpresa || isLoggedAsAdmin
          ? `Currículo de ${curriculo?.candidato?.nome || "Candidato"}`
          : "Currículo do Candidato"}
      </h2>

      {/* Mensagens de Erro e Sucesso */}
      {error && (
        <div className="error-message">
          {error}
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="close-icon"
            onClick={() => setError("")}
          />
        </div>
      )}
      {message && (
        <div className="success-message">
          {message}
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="close-icon"
            onClick={() => setMessage("")}
          />
        </div>
      )}

      {/* Conteúdo principal: Detalhes do currículo ou mensagem de "não cadastrado" */}
      {curriculo ? (
        <div className="curriculo-details">
          {/* NOVO BOTÃO: Voltar ao Dashboard */}
          <button
            onClick={handleGoBackToDashboard}
            className="btn btn-secondary-back"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
          </button>
          <div className="detail-item">
            <h3>Resumo Profissional</h3>
            <p>{curriculo.resumo || "Nenhum resumo cadastrado."}</p>
          </div>
          <div className="detail-item">
            <h3>LinkedIn</h3>
            <p>
              {curriculo.linkedin ? (
                <a
                  href={curriculo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {curriculo.linkedin}
                </a>
              ) : (
                "Nenhum link cadastrado."
              )}
            </p>
          </div>

          <div className="actions">
            {/* Botões Editar e Excluir: Visíveis apenas se for o PRÓPRIO currículo do CANDIDATO logado */}
            {isMyCurriculum && isLoggedAsCandidato && (
              <>
                <button
                  onClick={handleEdit}
                  className="btn btn-edit"
                  disabled={isDeleting}
                >
                  <FontAwesomeIcon icon={faPencilAlt} /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-delete"
                  disabled={isDeleting}
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Excluir
                </button>
              </>
            )}
            {/* Outras ações para EMPRESA/ADMIN visualizando currículo de OUTRO candidato (opcional) */}
            {(isLoggedAsEmpresa || isLoggedAsAdmin) &&
              !isMyCurriculum &&
              // <button onClick={() => alert('Ações da Empresa para este currículo')} className="btn btn-primary-custom">
              //     <FontAwesomeIcon icon={faUserCircle} /> Ações da Empresa
              // </button>
              null // Deixado como null por enquanto, adicione botões de ação específicos se necessário
            }
          </div>

          {/* Modal de Confirmação de Exclusão */}
          {deleteConfirmation && (
            <div className="delete-confirmation-modal">
              <div className="modal-content">
                <p>Tem certeza que deseja excluir seu currículo?</p>
                <div className="modal-actions">
                  <button
                    onClick={confirmDelete}
                    className="btn btn-delete-confirm"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      "Confirmar Exclusão"
                    )}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="btn btn-secondary"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Mensagem e botão se o currículo não estiver cadastrado
        <div>
          <p>
            {isMyCurriculum
              ? "Você ainda não cadastrou seu currículo."
              : "O currículo deste candidato não foi cadastrado."}
          </p>
          {/* Botão "Cadastrar Currículo" visível apenas se for o PRÓPRIO currículo do usuário logado */}
          {isMyCurriculum && isLoggedAsCandidato && (
            <button
              onClick={handleEdit}
              className="btn btn-primary-custom"
              disabled={isDeleting}
            >
              Cadastrar Currículo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VisualizarCurriculo;
