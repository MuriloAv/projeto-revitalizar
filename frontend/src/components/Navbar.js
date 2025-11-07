import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; 

function Navbar() {
  const navigate = useNavigate();

  // Verificamos se o token existe no localStorage
  const token = localStorage.getItem('token');

  // Função de Logout
  const handleLogout = () => {
    // Remove o token
    localStorage.removeItem('token');
    // Redireciona para a página de login
    navigate('/login');
    // Força um recarregamento da página para garantir que o Navbar atualize
    // (Existem formas mais avançadas com Context API, mas isso resolve 100%)
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Link para a Home (Galeria) */}
        <Link to="/">Projeto Revitalizar</Link>
      </div>

      <ul className="navbar-links">
        {/* 3. Lógica Condicional */}
        {token ? (
          // Se ESTIVER LOGADO (token existe)
          <>
            <li>
              <Link to="/">Galeria</Link>
            </li>
            <li>
              <Link to="/upload">Enviar Coleta</Link>
            </li>
            <li>
              {/* Usa <button> aqui pois não é um link é uma ação */}
              <button onClick={handleLogout} className="navbar-logout-btn">
                Sair
              </button>
            </li>
          </>
        ) : (
          // Se NÃO ESTIVER LOGADO (token é null)
          <>
            <li>
              <Link to="/">Galeria</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Cadastro</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;