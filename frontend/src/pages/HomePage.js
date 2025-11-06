import React, { useState, useEffect } from 'react';
import api from '../api'; // Nossa instância Axios
import UploadCard from '../components/UploadCard'; // O card que criamos no passo anterior

// CSS básico para a galeria (pode ser movido para um arquivo .css)
const galleryStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '20px'
};

function HomePage() {
  // Estados para guardar a lista de uploads e o status de carregamento
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect é usado para buscar dados assim que o componente carregar
  useEffect(() => {
    // Criamos uma função async aqui dentro para poder usar 'await'
    const fetchUploads = async () => {
      try {
        setLoading(true);
        // 1. Busca os dados do endpoint GET /uploads do seu backend
        const response = await api.get('/uploads');
        
        // 2. Salva os dados no estado 'uploads'
        setUploads(response.data);
      } catch (error) {
        console.error("Erro ao buscar uploads:", error);
        alert("Falha ao carregar a galeria.");
      } finally {
        // 3. Independentemente de sucesso ou falha, para de carregar
        setLoading(false);
      }
    };

    fetchUploads(); // Executa a função
  }, []); // O [] vazio garante que isso rode apenas UMA VEZ

  // ---------------- RENDERIZAÇÃO ----------------

  // Se estiver carregando, mostra uma mensagem
  if (loading) {
    return <h1 style={{ textAlign: 'center' }}>Carregando galeria...</h1>;
  }

  // Se não estiver carregando E não houver uploads, mostra outra mensagem
  if (uploads.length === 0) {
    return <h1 style={{ textAlign: 'center' }}>Ainda não há nenhuma coleta registrada. Seja o primeiro!</h1>;
  }

  // Se tiver dados, renderiza a galeria
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Galeria de Coletas</h1>
      <div style={galleryStyles}>
        {/* 4. Mapeia (faz um loop) o array de 'uploads'
             e renderiza um componente 'UploadCard' para cada item.
        */}
        {uploads.map(upload => (
          <UploadCard key={upload.id} upload={upload} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;