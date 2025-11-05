import React, { useState } from 'react';
// 1. Importe o 'api' que configuramos (em vez do axios puro)
import api from '../api';
// 2. Importe o hook 'useNavigate' para podermos redirecionar o usuário
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Inicializa o hook de navegação
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 4. USAMOS O 'api' (em vez de 'axios')
      //    Note que usamos apenas '/login'. A URL base (http://localhost:5000)
      //    já está configurada dentro do arquivo 'api.js'.
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      // ---- ESTA É A PARTE MAIS IMPORTANTE ----
      // Pega o token que o backend enviou
      const token = response.data.token;
      
      // Salva o token no localStorage do navegador
      localStorage.setItem('token', token);
      
      // ------------------------------------------

      console.log('Login bem-sucedido!', response.data);
      alert('Login efetuado! Você será redirecionado.');

      // 5. Redireciona o usuário para a página de upload (ou '/')
      navigate('/upload');

    } catch (error) {
      // A resposta de erro agora vem de 'error.response'
      console.error('Erro no login:', error.response?.data || error.message);
      alert('Email ou senha inválidos.');
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;