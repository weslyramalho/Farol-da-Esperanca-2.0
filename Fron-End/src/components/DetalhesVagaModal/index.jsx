import { faBuilding, faDollarSign, faFileContract, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './detalhesVagaModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DetalhesVagaModal = ({ vagaSelecionada }) => {
    // Verificação inicial robusta: Garante que vagaSelecionada não é null/undefined
    if (!vagaSelecionada) {
        return <p>Nenhum detalhe de vaga selecionado ou dados incompletos para exibição.</p>;
    }

    // --- Preparação de dados para renderização defensiva ---
    // Usando optional chaining (?.) e fallback para strings padrão
    const tituloVaga = vagaSelecionada.titulo || 'Título não disponível';
    const empresaNome = vagaSelecionada.empresa?.nome || 'Empresa não informada'; // Acesso seguro a vagaSelecionada.empresa.nome
    const localVaga = vagaSelecionada.local || 'Local não informado';
    const tipoContratoVaga = vagaSelecionada.tipoContrato || 'Tipo de Contrato não informado';
    const descricaoVaga = vagaSelecionada.descricao || 'Descrição não disponível';

    // Formatação segura do salário: verifica se não é null/undefined/0 antes de formatar
    const salarioDisplay = (vagaSelecionada.salario !== null && vagaSelecionada.salario !== undefined)
        ? `R$ ${vagaSelecionada.salario.toLocaleString('pt-BR')}`
        : 'Não informado';

    // Formatação segura da data de cadastro
    const dataCadastroDisplay = vagaSelecionada.dataCadastro
        ? new Date(vagaSelecionada.dataCadastro).toLocaleDateString() // Converte string para Date e formata
        : 'N/A';

    return (
        <div className="vaga-detalhes-modal">
            <h4 className="mb-3 text-primary">{tituloVaga}</h4>
            <p className="mb-2 text-muted fw-bold">
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                {empresaNome}
            </p>
            <p className="mb-2 small">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                {localVaga}
            </p>
            <p className="mb-2 small">
                <FontAwesomeIcon icon={faFileContract} className="me-2" />
                {tipoContratoVaga}
            </p>
            {/* Renderiza o salário apenas se for um valor válido para exibir */}
            {(vagaSelecionada.salario !== null && vagaSelecionada.salario !== undefined) && (
                <p className="mb-2 small">
                    <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                    Salário: {salarioDisplay}
                </p>
            )}
            <hr />
            <h5>Descrição da Vaga</h5>
            <p style={{ whiteSpace: 'pre-wrap' }}>{descricaoVaga}</p> {/* pre-wrap mantém quebras de linha */}
            {/* Renderiza a data de cadastro apenas se existir */}
            {vagaSelecionada.dataCadastro && (
                <p className="text-muted text-end mt-3">
                    <small>Publicada em: {dataCadastroDisplay}</small>
                </p>
            )}
        </div>
    );
};

export default DetalhesVagaModal;