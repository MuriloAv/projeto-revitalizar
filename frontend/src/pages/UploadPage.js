import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Nossa instância Axios configurada (para nosso backend)
import axios from 'axios'; // O Axios puro (para o upload no S3)

function UploadPage() {
  // --- Passo 2: Estados do Formulário ---
  const [residues, setResidues] = useState([]); // Lista de tipos de resíduo
  const [selectedResidueId, setSelectedResidueId] = useState(''); // ID do resíduo escolhido
  const [selectedFile, setSelectedFile] = useState(null); // O arquivo de imagem
  const [loading, setLoading] = useState(false); // Para feedback ao usuário
  
  const navigate = useNavigate();

  // --- Passo 1: Buscar os Tipos de Resíduo ---
  useEffect(() => {
    // Função async auto-executável
    (async () => {
      try {
        //  Busca a lista de resíduos do nosso backend
        const response = await api.get('/residue-types');
        setResidues(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de resíduo:", error);
        alert("Falha ao carregar dados. Tente novamente.");
      }
    })();
  }, []); // O [] vazio faz isso rodar apenas uma vez, quando a página carrega

  // --- Passo 3: Implementar o handleSubmit ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    if (!selectedFile || !selectedResidueId) {
      alert("Por favor, selecione um tipo de resíduo E um arquivo de imagem.");
      return;
    }

    setLoading(true);

    try {
      // --- FLUXO CRÍTICO (Início) ---

      // 1. REQUISIÇÃO 1: Pedir a URL pré-assinada ao *nosso* backend
      //  Enviamos o nome e o tipo do arquivo
      const presignedUrlResponse = await api.post('/uploads/generate-presigned-url', {
        fileName: selectedFile.name,
        fileType: selectedFile.type
      });

      // 2. RESPOSTA 1: Pegamos as URLs que nosso backend retornou
      //  A 'uploadUrl' é para onde vamos enviar, a 'imageUrl' é o que vamos salvar no banco
      const { uploadUrl, imageUrl } = presignedUrlResponse.data;

      // 3. UPLOAD DIRETO: Enviar o arquivo para o *Storage* (S3/Cloudinary)
      // [cite: 80, 81] Usamos 'axios.put' (NÃO 'api.put') direto para a URL recebida.
      // Não enviamos token de Auth, mas enviamos o Content-Type correto.
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type
        }
      });

      // 4. REQUISIÇÃO 2: Salvar os dados no *nosso* banco de dados
      //  Agora que a imagem está no S3, avisamos nosso backend
      // O 'user_id' é pego automaticamente pelo backend via token [cite: 88]
      await api.post('/uploads', {
        imageUrl: imageUrl,                 // [cite: 85]
        residueTypeId: selectedResidueId    // [cite: 86]
        // Opcional: Adicionar latitude/longitude aqui
      });

      // --- FLUXO CRÍTICO (Fim) ---

      setLoading(false);
      alert("Upload realizado com sucesso!");
      navigate('/'); // Redireciona para a galeria (HomePage)

    } catch (error) {
      setLoading(false);
      console.error("Erro no processo de upload:", error.response?.data || error.message);
      alert("Ocorreu um erro no upload. Verifique o console.");
    }
  };

  return (
    <div>
      <h1>Upload de Resíduo Coletado</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Dropdown para Tipos de Resíduo */}
        <div>
          <label>Tipo de Resíduo:</label>
          <select 
            value={selectedResidueId} 
            onChange={(e) => setSelectedResidueId(e.target.value)}
            required
          >
            <option value="">Selecione um tipo</option>
            {residues.map((residue) => (
              <option key={residue.id} value={residue.id}>
                {residue.name} ({residue.category})
              </option>
            ))}
          </select>
        </div>

        {/* Input para o Arquivo de Imagem */}
        <div>
          <label>Foto do Resíduo:</label>
          <input 
            type="file" 
            accept="image/*" // Aceita apenas imagens
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Coleta'}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;