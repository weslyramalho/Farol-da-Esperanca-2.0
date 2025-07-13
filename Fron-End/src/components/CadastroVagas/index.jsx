import { useState } from "react";

const CadastroVagas = ({ onNovaVaga })=> {
    const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salario, setSalario] = useState('');
  const [tipoContrato, setTipoContrato] = useState('CLT');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !empresa || !local || !descricao) {
      // Idealmente, usar um componente de alerta do Bootstrap
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

     const novaVaga = {
      id: Date.now(),
      titulo,
      empresa,
      local,
      descricao,
      salario: salario || 'A combinar',
      tipoContrato,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };
    onNovaVaga(novaVaga);
    setTitulo('');
    setEmpresa('');
    setLocal('');
    setDescricao('');
    setSalario('');
    setTipoContrato('CLT');
    alert('Vaga cadastrada com sucesso!'); 
  };

  return (
    <div className="card p-3 p-md-4 shadow-sm mx-auto" style={{ maxWidth: '700px' }}>
      <div className="card-body">
        <h2 className="card-title h3 mb-4">Cadastrar Nova Vaga</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">Título da Vaga*</label>
            <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required
                   className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="empresa" className="form-label">Empresa*</label>
            <input type="text" id="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required
                   className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="local" className="form-label">Local* (Ex: São Paulo, SP ou Remoto)</label>
            <input type="text" id="local" value={local} onChange={(e) => setLocal(e.target.value)} required
                   className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">Descrição da Vaga*</label>
            <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4" required
                      className="form-control"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="salario" className="form-label">Salário (opcional)</label>
            <input type="text" id="salario" value={salario} onChange={(e) => setSalario(e.target.value)}
                   placeholder="Ex: R$ 3.000,00 ou A combinar"
                   className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="tipoContrato" className="form-label">Tipo de Contrato</label>
            <select id="tipoContrato" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)}
                    className="form-select">
              <option value="CLT">CLT</option>
              <option value="PJ">PJ</option>
              <option value="Estágio">Estágio</option>
              <option value="Temporário">Temporário</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Cadastrar Vaga
          </button>
        </form>
      </div>
    </div>
  );

}

export default CadastroVagas;