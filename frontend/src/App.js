import React, { useEffect } from 'react'; // 1. IMPORTAMOS O 'useEffect'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import backgroundImage from './background.jpg'; 

function App() {

  // usa 'useEffect' PARA MUDAR O BODY
  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;    
    
    // Trocamos 'cover' (zoom) por 'contain' (mostrar tudo)
    document.body.style.backgroundSize = 'contain';     

    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center center';
    
    // Limpa o estilo quando o componente morre 
    return () => {
      document.body.style.backgroundImage = null;
      document.body.style.backgroundSize = null;
      document.body.style.backgroundRepeat = null;
      document.body.style.backgroundAttachment = null;
      document.body.style.backgroundPosition = null;
    };
  }, []); //

 
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