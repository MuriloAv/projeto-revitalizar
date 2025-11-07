import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente é o "Segurança"
function ProtectedRoute({ children }) {
  //  Verifica se o token existe no localStorage
  const token = localStorage.getItem('token');

  //  Se NÃO houver token...
  if (!token) {
    // Redireciona o usuário para a página de login
    // 'replace' impede que ele use o botão "voltar" do navegador
    return <Navigate to="/login" replace />;
  }

  //  Se houver um token...
  // Deixa ele ver a página que ele queria
  return children;
}

export default ProtectedRoute;