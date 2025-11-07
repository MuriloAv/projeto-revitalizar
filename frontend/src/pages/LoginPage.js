import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Importa o CSS 
import './Form.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      
      console.log('Login bem-sucedido!', response.data);
      alert('Login efetuado! Você será redirecionado.');
      navigate('/upload');

    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      alert('Email ou senha inválidos.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Página de Login</h1>
      
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input" 
          />
        </div>
        
        <button type="submit" className="form-button">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;