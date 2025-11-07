import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // axios
import './Form.css'; // Reutiliza o CSS do formulário

function UploadPage() {
  // Estados do formulário 
  const [residues, setResidues] = useState([]); 
  const [selectedResidueId, setSelectedResidueId] = useState(''); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [riverName, setRiverName] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  // Busca os tipos de resíduo 
  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/residue-types');
        setResidues(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de resíduo:", error);
      }
    })();
  }, []); 

  // O NOVO handleSubmit (FLUXO SIMPLES COM MULTER)
  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!selectedFile || !selectedResidueId) {
      alert("Por favor, selecione um tipo de resíduo E um arquivo de imagem.");
      return;
    }
    setLoading(true);

    try {
      // Cria o FormData
      const formData = new FormData();
      
      // Adiciona arquivo de imagem
      // O nome 'imageFile' TEM que ser o mesmo do upload.single('imageFile') no backend
      formData.append('imageFile', selectedFile); 
      
      // Adicionamos TODOS os outros dados do formulário
      formData.append('residueTypeId', selectedResidueId);
      formData.append('city', city);
      formData.append('river_name', riverName);
      formData.append('notes', notes);
      
      // Envia TUDO de uma vez para o backend ---
      await api.post('/uploads', formData, {
        headers: {
          // Precisa avisar o 'api.js' para não enviar JSON, mas sim 'multipart'
          'Content-Type': 'multipart/form-data',
        }
      });

      setLoading(false);
      alert("Upload realizado com sucesso!");
      navigate('/'); // Vai para a galeria (HomePage)

    } catch (error) {
      setLoading(false);
      console.error("Erro no processo de upload:", error.response?.data || error.message);
      alert("Ocorreu um erro no upload. Verifique o console.");
    }
  };

  // O JSX (HTML) do formulário não muda 
  return (
    <div className="form-container"> 
      <h1 className="form-title">Upload de Resíduo Coletado</h1>
      
      <form onSubmit={handleSubmit}>
        
        {/* Tipo de Resíduo (Dropdown) */}
        <div className="form-group">
          <label className="form-label">Tipo de Resíduo:</label>
          <select 
            value={selectedResidueId} 
            onChange={(e) => setSelectedResidueId(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Selecione um tipo</option>
            {residues.map((residue) => (
              <option key={residue.id} value={residue.id}>
                {residue.name} ({residue.category})
              </option>
            ))}
          </select>
        </div>

        {/* Foto do Resíduo (Input File) */}
        <div className="form-group">
          <label className="form-label">Foto do Resíduo:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required 
            className="form-input"
          />
        </div>
        
        {/* Cidade */}
        <div className="form-group">
          <label className="form-label">Cidade:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input"
            placeholder="Ex: São Paulo"
          />
        </div>
        
        {/* Nome do Rio */}
        <div className="form-group">
          <label className="form-label">Nome do Rio:</label>
          <input
            type="text"
            value={riverName}
            onChange={(e) => setRiverName(e.target.value)}
            className="form-input"
            placeholder="Ex: Rio Tietê"
          />
        </div>

        {/* Observações (A "caixa") */}
        <div className="form-group">
          <label className="form-label">Observações:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            placeholder="Descreva o local ou detalhes da coleta..."
            rows="4"
          ></textarea>
        </div>
        
        {/* Botão de Envio */}
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Coleta'}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;