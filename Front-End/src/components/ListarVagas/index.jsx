import { useEffect, useState } from "react";
import {
  ButtonCustom,
  ModalBody,
  ModalCustom,
  ModalFooter,
  ModalHeader,
} from "../Modal";
import DetalhesVagaModal from "../DetalhesVagaModal";
import { useAuth } from "../../context/useAuth ";
import { faBriefcase, faHeart, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListarVagas = () => {
    // Estados para as vagas e pesquisa
    const [vagas, setVagas] = useState([]);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [totalVagasSemFiltro, setTotalVagasSemFiltro] = useState(0);

    // Estados de UI e feedback para a lista principal
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para o modal de detalhes da vaga
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Estados específicos para a ação de Aplicar/Salvar no modal
    const [isApplying, setIsApplying] = useState(false); // Indica que a aplicação está em andamento
    const [actionMessage, setActionMessage] = useState(''); // Mensagem de sucesso da ação
    const [actionError, setActionError] = useState('');     // Mensagem de erro da ação

    // Contexto de autenticação
    const { authToken, isAuthenticated, userRoles } = useAuth(); // Precisa saber se está autenticado e qual a role

    // --- FUNÇÃO PARA BUSCAR VAGAS (COM OU SEM TERMO DE PESQUISA) ---
    const fetchVagas = async (termo = '') => {
        setIsLoading(true);
        setError('');

        try {
            const url = termo.trim() === '' 
                ? 'https://245c2fba6c85.ngrok-free.app/api/vagas'
                : `https://245c2fba6c85.ngrok-free.app/api/vagas/search?termo=${encodeURIComponent(termo)}`;
            
            const headers = {
                'Content-Type': 'application/json',
            };
            // Se o usuário está logado, enviamos o token para o backend poder dizer
            // se a vaga já foi salva ou aplicada (se o backend tiver essa lógica e a resposta)
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setVagas(data);
                if (termo.trim() === '') {
                    setTotalVagasSemFiltro(data.length);
                }
            } else {
                const errorText = await response.text();
                setError(`Erro ao carregar vagas: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('ListarVagas: Erro na requisição:', err);
            setError('Erro de conexão ao carregar vagas. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para carregar as vagas, com debounce para a pesquisa.
    // Isso evita fazer uma requisição a cada tecla digitada.
    useEffect(() => {
        // Define um timer para atrasar a chamada da API.
        const timerId = setTimeout(() => {
            // A chamada inicial com termo vazio vai acontecer, bem como as buscas.
            fetchVagas(termoPesquisa);
        }, 500); // Atraso de 500ms após o usuário parar de digitar.

        // Função de limpeza: será executada antes do próximo useEffect.
        // Isso cancela o timer anterior se o usuário continuar digitando.
        return () => {
            clearTimeout(timerId);
        };
    }, [termoPesquisa, authToken]); // O efeito é re-executado quando o termo de pesquisa ou o token mudam.

    // Função para lidar com a mudança na barra de pesquisa (apenas atualiza o estado)
    const handlePesquisaChange = (e) => {
        setTermoPesquisa(e.target.value);
    };

    // Função para exibir o modal de detalhes da vaga
    const handleVisualizar = (vaga) => {
        setVagaSelecionada(vaga);
        setShowModal(true);
        setActionMessage(''); // Limpa mensagens de ação ao abrir o modal
        setActionError('');   // Limpa erros de ação
    };

    // --- LÓGICA COMPLETA: Função para APLICAR PARA A VAGA ---
    const handleAplicarVaga = async (vagaId) => {
        // Validação no frontend: só permite aplicar se for Candidato e estiver autenticado
        if (!isAuthenticated || !userRoles.includes('ROLE_CANDIDATO')) {
            setActionError('Você precisa estar logado como Candidato para se candidatar.');
            return;
        }

        setIsApplying(true); // Ativa o estado de carregamento do botão
        setActionMessage(''); // Limpa mensagens anteriores
        setActionError('');   // Limpa erros anteriores

        try {
            // Requisição POST para o endpoint de aplicação de candidatura
            const response = await fetch(`https://245c2fba6c85.ngrok-free.app/api/candidaturas/aplicar/${vagaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Envia o token JWT
                },
            });

            if (response.ok || response.status === 201) { // 201 Created é o esperado para sucesso
                setActionMessage('Candidatura realizada com sucesso!');
                // Opcional: Atualizar o estado da vaga na lista para refletir que foi aplicada
                // (Se a API retornar o status de candidatura da vaga na lista de todas as vagas,
                // ou recarregar a lista: fetchVagas(termoPesquisa); )
                setTimeout(() => setShowModal(false), 1500); // Fecha o modal após 1.5 segundos
            } else if (response.status === 409) { // 409 Conflict: Já se candidatou
                const errorText = await response.text();
                setActionError(errorText || 'Você já se candidatou a esta vaga.');
            } else if (response.status === 401 || response.status === 403) {
                // Se o token for inválido/expirado ou acesso proibido, o usuário precisa relogar
                setActionError('Não autorizado para se candidatar. Faça login novamente.');
                // logout(); // Pode deslogar e redirecionar aqui
                // navigate('/login');
            } else {
                const errorText = await response.text();
                throw new Error(`Falha ao aplicar: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('ListarVagas: Erro ao aplicar para vaga:', err);
            setActionError(err.message || 'Ocorreu um erro ao aplicar para a vaga.');
        } finally {
            setIsApplying(false); // Finaliza o estado de carregamento
        }
    };

    // --- Lógica para SALVAR UMA VAGA ---
    const handleSalvarVaga = async (vagaId) => {
        // Validação no frontend: só permite salvar se for Candidato e estiver autenticado
        if (!isAuthenticated || !userRoles.includes('ROLE_CANDIDATO')) {
            setActionError('Você precisa estar logado como Candidato para salvar vagas.');
            return;
        }

        setActionMessage('');
        setActionError('');

        try {
            const response = await fetch(`https://245c2fba6c85.ngrok-free.app/api/vagas/${vagaId}/salvar`, { // Endpoint de salvar vaga
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });

            if (response.ok || response.status === 201) {
                setActionMessage('Vaga salva com sucesso!');
            } else if (response.status === 409) {
                const errorText = await response.text();
                setActionError(errorText || 'Vaga já estava salva.');
            } else if (response.status === 401 || response.status === 403) {
                setActionError('Não autorizado para salvar vaga. Faça login novamente.');
            } else {
                const errorText = await response.text();
                throw new Error(`Falha ao salvar vaga: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('ListarVagas: Erro ao salvar vaga:', err);
            setActionError(err.message || 'Ocorreu um erro ao salvar a vaga. Tente novamente.');
        }
    };

    // Renderização do componente
    return (
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
            <h2 className="h3 mb-4 text-center text-md-start">Vagas em Aberto</h2>

            {/* Barra de Pesquisa */}
            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar por título, empresa ou local..."
                        aria-label="Pesquisar vagas"
                        value={termoPesquisa}
                        onChange={handlePesquisaChange}
                    />
                </div>
            </div>

            {/* Mensagens de feedback da lista principal */}
            {isLoading ? (
                <div className="text-center mt-5">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    <p>Carregando vagas...</p>
                </div>
            ) : error ? (
                <div className="text-center text-danger mt-5">
                    <p>{error}</p>
                </div>
            ) : vagas.length === 0 ? (
                <div className="text-center text-muted mt-5">
                    {termoPesquisa ? (
                        <p>Nenhuma vaga encontrada com os critérios de pesquisa "{termoPesquisa}".</p>
                    ) : totalVagasSemFiltro === 0 ? (
                        <p>Nenhuma vaga cadastrada no momento.</p>
                    ) : (
                        <p>
                            Todas as vagas foram filtradas. Limpe a pesquisa para ver mais.
                        </p>
                    )}
                </div>
            ) : null}

            {/* Lista de Vagas */}
            {!isLoading && !error && vagas.length > 0 && (
                <div className="row row-cols-1 row-cols-md-1 g-4">
                    {vagas.map((vaga) => (
                        <div key={vaga.id} className="col">
                            <div className="card h-100 shadow-sm hover-effect">
                                <div className="card-body d-flex flex-column">
                                    <h3 className="card-title h5 text-primary">{vaga.titulo}</h3>
                                    <p className="card-subtitle mb-2 text-muted fw-bold">
                                        {vaga.empresa ? vaga.empresa.nome : 'Empresa não informada'}
                                    </p>
                                    <p className="card-text small mb-1">
                                        {vaga.local} - {vaga.tipoContrato}
                                    </p>
                                    <p
                                        className="card-text small text-truncate"
                                        style={{ WebkitLineClamp: 3 }}
                                    >
                                        {vaga.descricao}
                                    </p>
                                    {vaga.salario !== null && vaga.salario !== undefined && ( // Verificação mais robusta
                                        <p className="card-text small">
                                            <strong>Salário:</strong> R$ {vaga.salario.toLocaleString('pt-BR')}
                                        </p>
                                    )}
                                    <p className="card-text mt-auto pt-2">
                                        <small className="text-muted">
                                            Cadastrada em: {new Date(vaga.dataCadastro).toLocaleDateString()}
                                        </small>
                                    </p>
                                    <button
                                        onClick={() => handleVisualizar(vaga)}
                                        className="btn btn-info btn-sm align-self-start mt-2"
                                    >
                                        Ver Detalhes / Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Detalhes da Vaga */}
            <ModalCustom
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setActionMessage(''); // Limpa mensagem ao fechar
                    setActionError('');   // Limpa erro ao fechar
                }}
                size="lg"
            >
                <ModalHeader>
                    <h3>Detalhes da Vaga {vagaSelecionada?.titulo}</h3>
                </ModalHeader>
                <ModalBody>
                    <DetalhesVagaModal 
                        vagaSelecionada={vagaSelecionada}
                    />
                </ModalBody>
                <ModalFooter>
                    {/* Mensagens de feedback da ação */}
                    {actionMessage && <p className="text-success" style={{marginRight: 'auto'}}>{actionMessage}</p>}
                    {actionError && <p className="text-danger" style={{marginRight: 'auto'}}>{actionError}</p>}

                    {/* Botões de Ação no Modal */}
                    <>
                        {/* Botão Aplicar para Vaga (visível apenas para Candidatos autenticados) */}
                        {isAuthenticated && userRoles.includes('ROLE_CANDIDATO') && (
                            <ButtonCustom 
                                variant="primary" 
                                onClick={() => handleAplicarVaga(vagaSelecionada.id)} 
                                disabled={isApplying} // Desabilita enquanto aplica
                            >
                                <FontAwesomeIcon icon={faBriefcase} /> {isApplying ? 'Aplicando...' : 'Aplicar para Vaga'}
                            </ButtonCustom>
                        )}
                        {/* Botão Salvar Vaga (visível apenas para Candidatos autenticados) */}
                        {isAuthenticated && userRoles.includes('ROLE_CANDIDATO') && (
                            <ButtonCustom 
                                variant="info" 
                                onClick={() => handleSalvarVaga(vagaSelecionada.id)}
                            >
                                <FontAwesomeIcon icon={faHeart} /> Salvar Vaga
                            </ButtonCustom>
                        )}
                        <ButtonCustom variant="secondary" onClick={() => setShowModal(false)}>
                            Fechar
                        </ButtonCustom>
                    </>
                </ModalFooter>
            </ModalCustom>

            {/* Estilos */}
            <style jsx>{`
                .hover-effect:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default ListarVagas;