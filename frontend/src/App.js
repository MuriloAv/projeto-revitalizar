import React, { useEffect } from 'react'; // 1. IMPORTAMOS O 'useEffect'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe as páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

// Importe os componentes
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// 2. IMPORTAMOS A IMAGEM COMO UMA VARIÁVEL
// (Troque 'background.jpg' pelo nome exato do seu arquivo)
import backgroundImage from './background.jpg'; 

function App() {

  // 3. USAMOS O 'useEffect' PARA MUDAR O BODY
  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    
    // --- MUDANÇA AQUI ---
    // Trocamos 'cover' (zoom) por 'contain' (mostrar tudo)
    document.body.style.backgroundSize = 'contain'; 
    // --------------------

    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center center';
    
    // Limpa o estilo quando o componente "morrer" (boa prática)
    // Refatorei para limpar TODOS os estilos que adicionamos
    return () => {
      document.body.style.backgroundImage = null;
      document.body.style.backgroundSize = null;
      document.body.style.backgroundRepeat = null;
      document.body.style.backgroundAttachment = null;
      document.body.style.backgroundPosition = null;
    };
  }, []); // O [] vazio faz isso rodar só uma vez

  // O resto do seu código, sem mudanças
  return (
    <BrowserRouter>
      <Navbar /> 
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;