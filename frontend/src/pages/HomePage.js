import React, { useState, useEffect } from 'react';
import api from '../api'; 
import UploadCard from '../components/UploadCard'; 

// CSS básico para a galeria 
const galleryStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '20px'
};

// CSS para os botões de paginação
const paginationStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px'
};

const buttonStyles = {
  padding: '10px 15px',
  margin: '0 10px',
  backgroundColor: '#2c3e50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const disabledButtonStyles = {
  ...buttonStyles,
  backgroundColor: '#95a5a6',
  cursor: 'not-allowed'
};

function HomePage() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  //  NOVOS ESTADOS PARA PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    //  Agora ele depende de 'currentPage'.
  //  Sempre que 'currentPage' mudar, o useEffect roda de novo.
  useEffect(() => {
    
    const fetchUploads = async () => {
      try {
        setLoading(true);
        
        // Busca os dados da rota paginada (ex: /uploads?page=1&limit=9)
        const response = await api.get(`/uploads?page=${currentPage}&limit=9`);
        
        // Salva os dados do novo objeto de resposta
        setUploads(response.data.uploads);
        setTotalPages(response.data.totalPages);
        
      } catch (error) {
        console.error("Erro ao buscar uploads:", error);
        alert("Falha ao carregar a galeria.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads(); 
  }, [currentPage]); // Roda de novo quando currentPage mudar

  // Funções para os botões ---
  const handleNextPage = () => {
    // Apenas atualiza o estado. O useEffect faz o resto.
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    // Apenas atualiza o estado.
    setCurrentPage((prevPage) => prevPage - 1);
  };


  // Feedback de carregamento
  if (loading) {
    return <h1 style={{ textAlign: 'center' }}>Carregando galeria...</h1>;
  }

  // Feedback se não houver uploads
  if (uploads.length === 0) {
    return <h1 style={{ textAlign: 'center' }}>Ainda não há nenhuma coleta registrada. Seja o primeiro!</h1>;
  }

  // Renderiza a galeria E os botões
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Galeria de Coletas</h1>
      <div style={galleryStyles}>
        {uploads.map(upload => (
          <UploadCard key={upload.id} upload={upload} />
        ))}
      </div>

      {/* CONTROLES DE PAGINAÇÃO  */}
      <div style={paginationStyles}>
        <button
          style={currentPage <= 1 ? disabledButtonStyles : buttonStyles}
          onClick={handlePrevPage}
          disabled={currentPage <= 1} // Desabilita o botão na página 1
        >
          Anterior
        </button>
        
        <span>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          style={currentPage >= totalPages ? disabledButtonStyles : buttonStyles}
          onClick={handleNextPage}
          disabled={currentPage >= totalPages} // Desabilita na última página
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default HomePage;