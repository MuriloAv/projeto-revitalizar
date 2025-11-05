import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe as páginas que você criou
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <BrowserRouter>
      {/* Um menu de navegação pode vir aqui (veremos depois) */}
      
      <Routes>
        {/* A rota principal '/' vai mostrar a HomePage  */}
        <Route path="/" element={<HomePage />} />
        
        {/* A rota '/login' vai mostrar a LoginPage  */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* A rota '/register' vai mostrar a RegisterPage  */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* A rota '/upload' vai mostrar a UploadPage  */}
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
      
      {/* Um rodapé pode vir aqui */}
    </BrowserRouter>
  );
}

export default App;
