import { useState } from "react";

const CadastrarCurriculo = ({onNovoCurriculo}) =>{
     const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resumo, setResumo] = useState('');
  const [arquivoCurriculo, setArquivoCurriculo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !email || !resumo) {
      alert('Por favor, preencha nome, email e resumo.');
      return;
    }
    const novoCurriculo = {
      id: Date.now(),
      nome,
      email,
      telefone,
      linkedin,
      resumo,
      nomeArquivo: arquivoCurriculo ? arquivoCurriculo.name : 'N/A',
      dataEnvio: new Date().toLocaleDateString('pt-BR')
    };
    onNovoCurriculo(novoCurriculo);
    setNome('');
    setEmail('');
    setTelefone('');
    setLinkedin('');
    setResumo('');
    setArquivoCurriculo(null);
    if (document.getElementById('arquivoCurriculo')) {
        document.getElementById('arquivoCurriculo').value = '';
    }
    alert('Currículo cadastrado com sucesso!');
  };

  const handleFileChange = (e) => {
    setArquivoCurriculo(e.target.files[0]);
  };

  return (
    <div className="card p-3 p-md-4 shadow-sm mx-auto" style={{ maxWidth: '700px' }}>
      <div className="card-body">
        <h2 className="card-title h3 mb-4">Cadastrar Currículo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome Completo*</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email*</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="telefone" className="form-label">Telefone (opcional)</label>
            <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" className="form-control" />
          </div>
           <div className="mb-3">
            <label htmlFor="linkedin" className="form-label">Perfil LinkedIn (opcional)</label>
            <input type="url" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/seu-perfil" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="resumo" className="form-label">Resumo Profissional / Carta de Apresentação*</label>
            <textarea id="resumo" value={resumo} onChange={(e) => setResumo(e.target.value)} rows="5" required className="form-control"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="arquivoCurriculo" className="form-label">Anexar Currículo (PDF, DOC, DOCX - opcional)</label>
            <input type="file" id="arquivoCurriculo" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2">
            Enviar Currículo
          </button>
        </form>
      </div>
    </div>
  );
}
export default CadastrarCurriculo;