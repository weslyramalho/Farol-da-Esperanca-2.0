import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import "./CriarVaga.css";
import { useAuth } from "../../context/useAuth ";

const CriarVaga = () => {
  // Estados para os campos do formulário de vaga

  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [salario, setSalario] = useState(""); // Armazenar como string para o input
  const [tipoContrato, setTipoContrato] = useState(""); // TipoContrato é um Enum no backend

  console.log("CriarVaga.jsx: COMPONENTE CRIARVAGA RENDERIZADO.");

  // Estados de UI e feedback
  const [isLoading, setIsLoading] = useState(false); // Carregamento do envio do formulário
  const [error, setError] = useState(""); // Mensagens de erro da API ou validação
  const [message, setMessage] = useState(""); // Mensagens de sucesso

  const navigate = useNavigate();
  const { authToken, userRoles } = useAuth(); // Precisamos do token e podemos usar roles para validação extra

  // Validação para garantir que apenas empresas criem vagas (extra no frontend)
  useEffect(() => {
    if (
      !userRoles.includes("ROLE_EMPRESA") &&
      !userRoles.includes("ROLE_ADMIN")
    ) {
      setError(
        "Você não tem permissão para criar vagas. Apenas empresas ou administradores."
      );
      // Opcional: Redirecionar imediatamente
      // navigate('/empresa/dashboard');
    }
  }, [userRoles, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!authToken) {
      navigate("/login");
      return;
    }

    // Validações básicas do formulário
    if (!titulo || !local || !descricao || !salario || !tipoContrato) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }
    if (isNaN(parseFloat(salario))) {
      setError("Salário deve ser um número válido.");
      setIsLoading(false);
      return;
    }

    // Criar o objeto de dados da vaga para enviar ao backend
    const vagaData = {
      titulo: titulo,
      local: local,
      descricao: descricao,
      salario: parseFloat(salario), // Converter salário para número
      tipoContrato: tipoContrato, // Enviar o valor do Enum como String
    };

    try {
      const response = await fetch("http://localhost:8080/api/vagas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Envia o token JWT
        },
        body: JSON.stringify(vagaData),
      });

      if (response.ok) {
        const responseData = await response.json(); // Backend deve retornar a vaga criada
        setMessage(`Vaga "${responseData.titulo}" criada com sucesso!`);
        // Limpar o formulário após o sucesso
        setTitulo("");
        setLocal("");
        setDescricao("");
        setSalario("");
        setTipoContrato("");
        // Opcional: Redirecionar para a lista de vagas da empresa
        navigate("/empresa/vagas");
      } else if (response.status === 401 || response.status === 403) {
        setError("Não autorizado para criar vaga. Verifique suas permissões.");
        // Força logout se o token for inválido/expirado ou role não permitida
        navigate("/login"); // Redireciona para login
      } else {
        const errorText = await response.text();
        throw new Error(
          `Erro ao criar vaga: ${response.status} - ${errorText}`
        );
      }
    } catch (err) {
      console.error("CriarVaga: Erro na requisição:", err);
      setError(
        err.message || "Ocorreu um erro ao criar a vaga. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="criar-vaga-container">
      {/* NOVO BOTÃO: Voltar ao Dashboard */}
      <button
        onClick={handleGoBackToDashboard}
        className="btn btn-secondary-back"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao Dashboard
      </button>
      <h2>Criar Nova Vaga</h2>

      <p className="form-subtitle">
        Preencha os detalhes da vaga que deseja publicar.
      </p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit} className="vaga-form">
        <div className="form-group">
          <label htmlFor="titulo">Título da Vaga</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Desenvolvedor Front-end Pleno"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="local">Local da Vaga</label>
          <input
            type="text"
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex: São Paulo - SP (Remoto)"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição da Vaga</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhe as responsabilidades, requisitos e benefícios da vaga."
            rows="8"
            disabled={isLoading}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="salario">Salário (R$)</label>
          <input
            type="number" // Tipo number para o input, mas o estado é string
            id="salario"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            placeholder="Ex: 3500.00"
            step="0.01" // Permite valores decimais
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoContrato">Tipo de Contrato</label>
          <select
            id="tipoContrato"
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="">Selecione...</option>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="ESTAGIO">Estágio</option>
            <option value="FREELANCER">Freelancer</option>
            {/* Adicione outras opções conforme seu enum TipoContrato no backend */}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary-custom"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSave} />{" "}
          {isLoading ? "Publicando..." : "Publicar Vaga"}
        </button>
      </form>
    </div>
  );
};

export default CriarVaga;
