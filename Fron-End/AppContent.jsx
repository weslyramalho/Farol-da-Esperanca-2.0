import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

// --- Imports de Contexto ---
// Se AuthContext.jsx está em src/context/AuthContext.jsx

// --- Imports de Páginas (diretamente em src/pages) ---
import Home from "./src/pages/Home";
import HistoriasDeSucesso from "./src/pages/HistoriasDeSucesso";
import Oportunidades from "./src/pages/Oportunidades";
import RecursosEApoio from "./src/pages/RecursosEApoio";
import SobreNos from "./src/pages/SobreNos";

// --- Imports de Componentes (diretamente em src/components) ---
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";

// --- Imports de Componentes Específicos dentro de src/components/Login/ etc. ---
import Login from "./src/components/Login"; // <<<< Caminho CORRIGIDO
import Cadastro from "./src/components/Cadastro"; // <<<< Caminho CORRIGIDO
import SolicitarRedefinicaoSenha from "./src/components/SolicitarRedefinicaoSenha"; // <<<< Caminho CORRIGIDO
import RedefinirSenha from "./src/components/RedefinirSenha"; // <<<< Caminho CORRIGIDO
import DashboardCandidato from "./src/components/DashboardCandidato"; // <<<< Caminho CORRIGIDO
import MeuCurriculo from "./src/components/MeuCurriculo"; // <<<< Caminho CORRIGIDO
import VisualizarCurriculo from "./src/components/VisualizarCurriculo"; // <<<< Caminho CORRIGIDO
import DashboardEmpresa from "./src/components/DashboardEmpresa"; // <<<< Caminho CORRIGIDO
import VagasSalvas from "./src/components/VagasSalvas";

// --- Imports de Componentes de Vagas (dentro de src/components/Vagas) ---
import CriarVaga from "./src/components/CriarVaga"; // <<<< Caminho CORRIGIDO
import MinhasVagas from "./src/components/MinhasVagas"; // <<<< Caminho CORRIGIDO

// --- Import do ProtectedRoute ---
// Se ProtectedRoute.jsx estiver diretamente em src/
import ProtectedRoute from "./ProtectedRoute"; // <<<< Caminho CORRIGIDO
import { useAuth } from "./src/context/useAuth ";
import ListarVagas from "./src/components/ListarVagas";
import CandidatosAplicados from "./src/components/CandidatosAplicados";
import EditarPerfilCandidato from "./src/components/EditarPerfilCandidato";
import ConfiguracoesEmpresa from "./src/components/ConfiguracoesEmpresa";
import MinhasCandidaturas from "./src/components/MinhasCandidaturas";
import EditarVaga from "./src/components/EditarVaga";
// OU, se ProtectedRoute.jsx estiver em src/components/ProtectedRoute/
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const AppContent = () => {
  const {
    isAuthenticated,
    userRoles,
    loading: authLoading,
  
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  /*
  // Redirecionamento inteligente baseado na role após o login
  useEffect(() => {
    // Ignora se ainda está carregando ou não autenticado
    if (authLoading || !isAuthenticated) return;

    // Calcula o caminho do dashboard padrão para a role do usuário
    let userDashboardPath = "/"; // Padrão se não houver role específica
    if (userRoles.includes("ROLE_ADMIN")) {
      userDashboardPath = "/admin/dashboard";
    } else if (userRoles.includes("ROLE_EMPRESA")) {
      userDashboardPath = "/empresa/dashboard";
    } else if (userRoles.includes("ROLE_CANDIDATO")) {
      userDashboardPath = "/candidato/dashboard";
    }

    // --- Lógica de redirecionamento ---
    // 1. Se o usuário estiver na página de login, registro ou redefinição de senha,
    //    redireciona para o dashboard padrão de sua role.
    const authRelatedPaths = [
      "/login",
      "/registro",
      "/usuario/cadastro",
      "/solicitar-senha",
      "/redefinir-senha",
      "/forgot-password",
      "/reset-password",
    ];
    const isAuthRelatedPath = authRelatedPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    if (isAuthRelatedPath) {
      // Se está em uma rota de autenticação, redireciona para o dashboard correto
      if (location.pathname !== userDashboardPath) {
        // Evita redirecionar para a mesma página se já estiver lá
        console.log(
          `AppContent: Redirecionando de rota auth para dashboard (${userDashboardPath}).`
        );
        navigate(userDashboardPath, { replace: true });
      }
      return; // Já tratou o redirecionamento
    }

    // 2. Se o usuário NÃO está em uma rota de autenticação E NÃO está no seu dashboard padrão,
    //    MAS está em uma sub-rota DENTRO do seu domínio de dashboard (ex: /candidato/curriculo),
    //    NÃO REDIRECIONA. Permanece na sub-rota.
    if (
      (userRoles.includes("ROLE_CANDIDATO") &&
        location.pathname.startsWith("/candidato/")) ||
      (userRoles.includes("ROLE_EMPRESA") &&
        location.pathname.startsWith("/empresa/")) ||
      (userRoles.includes("ROLE_ADMIN") &&
        location.pathname.startsWith("/admin/"))
    ) {
      console.log(
        `AppContent: Usuário na sub-rota correta (${location.pathname}). Sem redirecionamento.`
      );
      return; // Permanece na sub-rota específica
    }

    // 3. Caso contrário (logado, mas não em rota auth nem em sub-rota do dashboard),
    //    redireciona para o dashboard padrão da role.
    if (location.pathname !== userDashboardPath) {
      console.log(
        `AppContent: Redirecionando para dashboard padrão (${userDashboardPath}).`
      );
      navigate(userDashboardPath, { replace: true });
    }
  }, [isAuthenticated, userRoles, authLoading, navigate, location.pathname]);

  */

  // Redirecionamento inteligente baseado na role após o login
  useEffect(() => {
    // Ignora se ainda está carregando ou não autenticado
    if (authLoading || !isAuthenticated) return;

    // Calcula o caminho do dashboard padrão para a role do usuário
    let userDashboardPath = "/";
    if (userRoles.includes("ROLE_ADMIN")) {
      userDashboardPath = "/admin/dashboard";
    } else if (userRoles.includes("ROLE_EMPRESA")) {
      userDashboardPath = "/empresa/dashboard";
    } else if (userRoles.includes("ROLE_CANDIDATO")) {
      userDashboardPath = "/candidato/dashboard";
    }

    // --- Lógica de redirecionamento ---

    // Condições de rotas que são consideradas "neutras" ou de autenticação
    const authRelatedPaths = [
      "/login",
      "/registro",
      "/usuario/cadastro",
      "/solicitar-senha",
      "/redefinir-senha",
      "/forgot-password",
      "/reset-password",
      "/acesso-negado",
      "vagas-em-aberto",
      "oportunidades",
      "recursoseapoio",
      "historiasdesucesso",
      "sobrenos",
      "empresa",  // Adicione esta linha
    ];
    const isAuthRelatedPath = authRelatedPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    // Condições para rotas específicas permitidas PARA CERTAS ROLES (mesmo que não sejam seus dashboards principais)
    const isCandidatoDomainPath =
      userRoles.includes("ROLE_CANDIDATO") &&
      location.pathname.startsWith("/candidato/");
    const isEmpresaDomainPath =
      userRoles.includes("ROLE_EMPRESA") &&
      location.pathname.startsWith("/empresa/");
    const isAdminDomainPath =
      userRoles.includes("ROLE_ADMIN") &&
      location.pathname.startsWith("/admin/");

    // Regra específica: EMPRESA ou ADMIN pode ver currículos de CANDIDATO
    const isEmpresaOrAdminViewingCandidateResume =
      (userRoles.includes("ROLE_EMPRESA") ||
        userRoles.includes("ROLE_ADMIN")) &&
      location.pathname.startsWith("/candidato/visualizar-curriculo/");

    // --- INÍCIO DA LÓGICA DE DECISÃO ---

    // 1. Se o usuário está em uma rota de autenticação/neutra
    if (isAuthRelatedPath) {
      if (location.pathname !== userDashboardPath) {
        console.log(
          `AppContent: Redirecionando de rota auth para dashboard (${userDashboardPath}).`
        );
        navigate(userDashboardPath, { replace: true });
      }
      return; // Já tratou, sai do useEffect
    }

    // 2. Se o usuário está em uma rota de domínio que pertence à sua role (ex: /candidato/* para candidato)
    // OU se ele é EMPRESA/ADMIN e está vendo currículo de candidato (que é um /candidato/*)
    if (
      isCandidatoDomainPath ||
      isEmpresaDomainPath ||
      isAdminDomainPath ||
      isEmpresaOrAdminViewingCandidateResume
    ) {
      console.log(
        `AppContent: Usuário em rota permitida para sua role/ação (${location.pathname}). Sem redirecionamento.`
      );
      return; // Permite a navegação para essa rota específica
    }

    // 3. Caso contrário (usuário autenticado, não em rota neutra, e não em rota de domínio/ação permitida),
    //    redireciona para o dashboard padrão da role.
    if (location.pathname !== userDashboardPath) {
      console.log(
        `AppContent: Redirecionando para dashboard padrão (${userDashboardPath}).`
      );
      navigate(userDashboardPath, { replace: true });
    }
  }, [isAuthenticated, userRoles, authLoading, navigate, location.pathname]);

  // Função para lidar com o clique no botão de Sair (Logout)

  /*
  const handleLogoutClick = () => {
    logout(); // Chama a função de logout do contexto AuthContext
    navigate("/login", { replace: true }); // Redireciona para a página de login após o logout
  };
*/
  // Renderização principal do AppContent
  return (
    // Removi o div.container daqui. Ele deve estar apenas no App.jsx.
    <div>
      {/* Cabeçalho condicional de logout (visível apenas quando autenticado) */}
     

      {/* Componente de Cabeçalho Fixo (Header que aparece em todas as páginas) */}
      <Header />

      {/* As Rotas da sua aplicação */}
      <Routes>
        {/* ROTAS PÚBLICAS GERAIS */}
        <Route path="/" element={<Home />} />
        <Route path="/historiasdesucesso" element={<HistoriasDeSucesso />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/recursoseapoio" element={<RecursosEApoio />} />
        <Route path="/sobrenos" element={<SobreNos />} />
        <Route path="/empresa" element={<SobreNos />} />
        {/* ROTAS DE AUTENTICAÇÃO (Login e Registro) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Cadastro />} />
        <Route path="/usuario/cadastro" element={<Cadastro />} />{" "}
        {/* Rota alternativa para cadastro, se precisar */}
        {/* ROTAS DE RECUPERAÇÃO DE SENHA */}
        <Route
          path="/solicitar-senha"
          element={<SolicitarRedefinicaoSenha />}
        />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        {/* Rotas antigas de recuperação de senha (remova se não usadas) */}
        <Route
          path="/forgot-password"
          element={<div>Página de Esqueceu Senha antiga (remover)</div>}
        />
        <Route path="/reset-password" element={<RedefinirSenha />} />{" "}
        {/* Use apenas uma rota para redefinir-senha */}
        {/* ROTAS PROTEGIDAS PARA CANDIDATOS */}
        <Route
          path="/candidato/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <DashboardCandidato />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidato/perfil"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <EditarPerfilCandidato />
            </ProtectedRoute>
          }
        />{" "}
        {/* <<< NOVA ROTA */}
        <Route
          path="/candidato/curriculo"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <MeuCurriculo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidato/visualizar-curriculo/:candidatoId?"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN", "ROLE_EMPRESA"]}
            >
              <VisualizarCurriculo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidato/vagas-salvas"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <VagasSalvas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidato/minhas-candidaturas"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <MinhasCandidaturas />
            </ProtectedRoute>
          }
        />{" "}
        {/* <<< NOVA ROTA */}
        <Route
          path="/candidato/listarvagas"
          element={
            <ProtectedRoute allowedRoles={["ROLE_CANDIDATO", "ROLE_ADMIN"]}>
              <ListarVagas />
            </ProtectedRoute>
          }
        />
        <Route path="/vagas-em-aberto" element={<ListarVagas />} />
        {/* ROTAS PROTEGIDAS PARA EMPRESAS */}
        <Route
          path="/empresa/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <DashboardEmpresa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresa/vagas/editar/:vagaId"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <EditarVaga />
            </ProtectedRoute>
          }
        />{" "}
        {/* <<< NOVA ROTA */}
        <Route
          path="/empresa/configuracoes"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <ConfiguracoesEmpresa />
            </ProtectedRoute>
          }
        />{" "}
        {/* <<< NOVA ROTA */}
        <Route
          path="/empresa/vagas"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <MinhasVagas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresa/vagas/nova"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <CriarVaga />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresa/candidatos-aplicados"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <CandidatosAplicados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresa/configuracoes"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPRESA", "ROLE_ADMIN"]}>
              <div>Página de Configurações da Empresa (a ser criada)</div>
            </ProtectedRoute>
          }
        />
        {/* ROTAS PROTEGIDAS PARA ADMINISTRADORES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <div>Dashboard do Administrador</div>
            </ProtectedRoute>
          }
        />
        {/* ROTA PARA ACESSO NEGADO */}
        <Route
          path="/acesso-negado"
          element={
            <div>
              <h1>Acesso Negado</h1>
              <p>Você não tem permissão para acessar esta página.</p>
              <Link to="/login">Voltar ao Login</Link>
            </div>
          }
        />
        {/* ROTA DE FALLBACK (para URLs não mapeadas) */}
        <Route
          path="*"
          element={
            <div>
              <h1>Página Não Encontrada!</h1>
              <p>A URL que você tentou acessar não existe.</p>
              <Link to="/">Voltar à Página Inicial</Link>
            </div>
          }
        />
      </Routes>

      {/* Componente de Rodapé Fixo */}
      <Footer />
    </div>
  );
};

export default AppContent;
