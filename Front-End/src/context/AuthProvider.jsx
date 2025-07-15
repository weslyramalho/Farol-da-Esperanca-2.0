import {useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }) => {
    // Estados que armazenam as informações de autenticação
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // O token JWT
    // userRoles será um array de strings (ex: ['ROLE_CANDIDATO', 'ROLE_ADMIN'])
    const [userRoles, setUserRoles] = useState(() => {
        try {
            const storedRoles = localStorage.getItem('userRoles');
            return storedRoles ? JSON.parse(storedRoles) : [];
        } catch (error) {
            console.error("Erro ao parsear userRoles do localStorage:", error);
            return [];
        }
    });
    const [userId, setUserId] = useState(() => {
        const storedUserId = localStorage.getItem('userId');
        return storedUserId ? parseInt(storedUserId) : null;
    });

    // Estados para controle de UI (carregamento e erros)
    const [loading, setLoading] = useState(false); // Indica se alguma operação de autenticação está em andamento
    const [error, setError] = useState(null);     // Armazena mensagens de erro da API de autenticação

    // --- EFEITO: Carregar dados do usuário (roles, userId) após o authToken ser definido ---
    // Este useEffect é crucial se o endpoint de login não retornar todas as roles e o ID do usuário diretamente.
    // Ele fará uma chamada a /api/users/me para obter esses detalhes.
    useEffect(() => {
        const fetchUserDataAfterLogin = async () => {
            // Se houver um token, mas o userId ou as userRoles ainda não foram preenchidos
            // OU se houver uma inconsistência entre o estado e o localStorage (force re-fetch)
            if (authToken && (!userId || userRoles.length === 0 || localStorage.getItem('userId') !== String(userId))) {
                setLoading(true); // Inicia o estado de carregamento
                setError(null);   // Limpa erros anteriores
                try {
                    //const response = await fetch('http://localhost:8080/api/users/me', {
                    const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/users/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}` // Envia o token JWT
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        console.log("AuthContext: Dados do usuário logado recebidos de /api/users/me:", userData);
                        
                        // Mapeia o objeto de roles para um array de strings (nomes das roles)
                        const fetchedRoles = userData.roles.map(roleObj => roleObj.name);
                        
                        // Atualiza os estados do contexto
                        setUserId(userData.id);
                        setUserRoles(fetchedRoles);

                        // Persiste no localStorage para manter a sessão após recarregar a página
                        localStorage.setItem('userId', userData.id);
                        localStorage.setItem('userRoles', JSON.stringify(fetchedRoles)); // Armazenar como string JSON
                        
                        // Opcional: Armazenar username e email para exibição em Dashboards
                        localStorage.setItem('username', userData.username);
                        localStorage.setItem('email', userData.email);

                    } else {
                        // Se a chamada a /api/users/me falhar (ex: token inválido/expirado, 401/403)
                        console.error("AuthContext: Falha ao obter dados do usuário após login. Status:", response.status);
                        // Limpa a sessão para forçar um novo login
                        logout(); 
                    }
                } catch (err) {
                    // Captura erros de rede
                    console.error("AuthContext: Erro de rede ao obter dados do usuário após login:", err);
                    logout(); // Desloga em caso de erro de rede
                } finally {
                    setLoading(false); // Finaliza o carregamento
                }
            } else if (!authToken && (userId || userRoles.length > 0)) {
                // Cenário: Token removido, mas userId/roles ainda estão no estado. Limpa.
                console.log("AuthContext: Token removido, limpando estados residuais.");
                setUserRoles([]);
                setUserId(null);
                localStorage.removeItem('username');
                localStorage.removeItem('email');
            }
        };
        fetchUserDataAfterLogin();
    }, [authToken]); // Dependências: este efeito re-executa quando 'authToken' muda.

    // --- FUNÇÃO DE LOGIN ---
    const login = async (username, password) => {
        setLoading(true); // Inicia o carregamento
        setError(null);   // Limpa erros anteriores
        try {
            const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Se a resposta não for 2xx, lança um erro com a mensagem do backend
                const errorData = await response.text();
                throw new Error(errorData || 'Falha no login');
            }

            const data = await response.json(); // Espera um JSON, ex: { accessToken: "...", tokenType: "Bearer" }
            
            // Verifica se o token de acesso foi recebido
            if (!data.accessToken) {
                throw new Error("Token de acesso não recebido na resposta do login.");
            }

            // Atualiza o estado do token e o localStorage
            setAuthToken(data.accessToken);
            localStorage.setItem('authToken', data.accessToken);

            // Importante: Se o endpoint /api/auth/login já retornar user.id e user.roles,
            // você pode setar setUserId e setUserRoles AQUI diretamente para um redirecionamento mais rápido.
            // Ex: if (data.userId && data.roles) { setUserId(data.userId); setUserRoles(data.roles.map(r => r.name)); }
            // Caso contrário, o useEffect acima fará a chamada a /api/users/me para preencher esses dados.

            return true; // Indica sucesso
        } catch (err) {
            setError(err.message); // Define a mensagem de erro para o contexto
            return false; // Indica falha
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    // --- FUNÇÃO DE REGISTRO ---
    const register = async (username, email, password, role) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://245c2fba6c85.ngrok-free.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Falha no registro');
            }

            const data = await response.text(); // O backend de registro retorna uma string de sucesso
            return { success: true, message: data }; // Retorna um objeto de resultado
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // --- FUNÇÃO DE LOGOUT ---
    const logout = () => {
        // Limpa todos os estados relacionados à autenticação
        setAuthToken(null);
        setUserRoles([]);
        setUserId(null);
        setError(null); // Limpa qualquer erro pendente
        
        // Remove os itens do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        
        // Não define isLoading aqui, pois o logout é instantâneo no frontend
    };

    // Objeto de valor que será fornecido pelo contexto a todos os consumidores
    const contextValue = { 
        authToken,              // Token JWT
        userRoles,              // Array de roles do usuário (ex: ['ROLE_CANDIDATO'])
        userId,                 // ID do usuário
        isAuthenticated: !!authToken, // Booleano: true se houver token, false caso contrário
        loading,                // Booleano: true se uma operação de auth estiver em andamento
        error,                  // String: Mensagem de erro da última operação de auth
        login,                  // Função para fazer login
        register,               // Função para registrar novo usuário
        logout                  // Função para fazer logout
    };

    return (
        // Fornece o objeto 'contextValue' para todos os componentes filhos
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;
