import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe as páginas que você criou
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

// Importa os componentes
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // 1. IMPORTAMOS O NAVBAR

function App() {
  return (
    <BrowserRouter>
      
      {/* 2. ADICIONAMOS O NAVBAR AQUI */}
      {/* Ele fica fora do <Routes> para aparecer em todas as páginas */}
      <Navbar />

      {/* 3. (Opcional) Usamos <main> para organizar o conteúdo da página */}
      <main>
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
      </main>
      
    </BrowserRouter>
  );
}

export default App;