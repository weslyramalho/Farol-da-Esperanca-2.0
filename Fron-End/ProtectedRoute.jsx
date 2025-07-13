import { useNavigate } from "react-router-dom";
import { useAuth } from "./src/context/useAuth ";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
    // Obtém o estado de autenticação do contexto
    const { isAuthenticated, userRoles, loading } = useAuth();
    // Hook para navegação programática
    const navigate = useNavigate();

    // useEffect para lidar com a lógica de proteção da rota
    useEffect(() => {
        // console.log("ProtectedRoute useEffect: status -> loading:", loading, "isAuthenticated:", isAuthenticated, "userRoles:", userRoles); // Log para depuração

        // Só executa a lógica de redirecionamento se o AuthContext não estiver em estado de carregamento
        // (ou seja, se a verificação inicial de autenticação já foi concluída)
        if (!loading) { 
            // 1. Verificar se o usuário está autenticado
            if (!isAuthenticated) {
                console.warn("ProtectedRoute: Usuário não autenticado. Redirecionando para /login.");
                navigate('/login'); // Redireciona para a página de login
                return; // Impede a execução posterior da lógica de role
            }

            // 2. Verificar Roles (se houver roles permitidas especificadas para esta rota)
            if (allowedRoles && allowedRoles.length > 0) {
                // Verifica se o usuário possui PELO MENOS UMA das roles permitidas
                const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

                if (!hasRequiredRole) {
                    console.warn(`ProtectedRoute: Acesso negado. Requer roles: [${allowedRoles.join(', ')}], Usuário tem: [${userRoles.join(', ')}]. Redirecionando para /acesso-negado.`);
                    navigate('/acesso-negado'); // Redireciona para uma página de acesso negado
                    // Opcional: Você pode deslogar o usuário aqui se for um caso de acesso indevido grave
                    // logout();
                    return; // Impede a renderização dos children
                }
            }
            // Se chegou aqui, o usuário está autenticado e tem a role necessária (ou nenhuma role foi exigida)
            // console.log("ProtectedRoute: Acesso permitido.");
        }
    }, [isAuthenticated, userRoles, allowedRoles, loading, navigate]); 
    // Dependências: o efeito re-executa se o estado de autenticação ou as roles mudarem.

    // Durante o carregamento inicial do contexto de autenticação, exibe um placeholder
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dados de autenticação...</div>;
    }

    // Se o usuário não estiver autenticado ou não tiver a role necessária (após o carregamento),
    // não renderiza os filhos. O useEffect já cuidou do redirecionamento.
    // A condição 'isAuthenticated' já verifica o token.
    // A condição 'userRoles.some...' verifica as roles.
    if (!isAuthenticated || (allowedRoles && allowedRoles.length > 0 && !allowedRoles.some(role => userRoles.includes(role)))) {
        return null; // Não renderiza o conteúdo protegido
    }

    // Se tudo estiver OK (autenticado e autorizado), renderiza os componentes filhos
    return children;
};

export default ProtectedRoute;