import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe as páginas que você criou
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

// Importa o componente de segurança
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      {/* Um menu de navegação pode vir aqui (veremos depois) */}
      
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota protegida */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      {/* Um rodapé pode vir aqui */}
    </BrowserRouter>
  );
}

export default App;
