import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente é o "Segurança"
function ProtectedRoute({ children }) {
  // 1. Verificamos se o token existe no localStorage
  const token = localStorage.getItem('token');

  // 2. Se NÃO houver token...
  if (!token) {
    // Redirecionamos o usuário para a página de login
    // 'replace' impede que ele use o botão "voltar" do navegador
    return <Navigate to="/login" replace />;
  }

  // 3. Se houver um token...
  // Deixamos ele ver a página que ele queria (os "children")
  return children;
}

export default ProtectedRoute;