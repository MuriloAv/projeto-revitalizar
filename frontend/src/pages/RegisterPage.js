import React, { useState } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';

// 1. Importa o CSS (Isso está certo)
import './Form.css'; 

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      await api.post('/register', {
        email: email,
        password: password
      });

      console.log('Usuário registrado!');
      alert('Usuário cadastrado com sucesso! Você será redirecionado para o login.');
      
      navigate('/login');

    } catch (error) {
      console.error('Erro no registro:', error.response?.data || error.message);
      alert('Erro ao cadastrar usuário. Verifique o console.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Página de Cadastro</h1>
      
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input" /* O comentário quebrado foi removido */
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input" /* O comentário quebrado foi removido */
          />
        </div>
        
        <button type="submit" className="form-button">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;