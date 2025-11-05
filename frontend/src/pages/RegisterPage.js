import React, { useState } from 'react';
// 1. Importe o 'api' que configuramos (em vez do axios puro)
import api from '../api'; 
// 2. Importe o hook 'useNavigate' para podermos redirecionar o usuário
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // Cria estados para guardar o email e a senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Inicializa o hook de navegação
  const navigate = useNavigate();

  // Função que será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o navegador de recarregar a página

    try {
      // 4. USAMOS O 'api' (em vez de 'axios')
      //    Note que usamos apenas '/register'. A URL base (http://localhost:5000)
      //    já está configurada dentro do arquivo 'api.js'.
      const response = await api.post('/register', {
        email: email,
        password: password
      });

      console.log('Usuário registrado!', response.data);
      alert('Usuário cadastrado com sucesso! Você será redirecionado para o login.');
      
      // 5. Redireciona o usuário para a página de login
      navigate('/login');

    } catch (error) {
      // A resposta de erro agora vem de 'error.response'
      console.error('Erro no registro:', error.response?.data || error.message);
      alert('Erro ao cadastrar usuário. Verifique o console.');
    }
  };

  return (
    <div>
      <h1>Página de Cadastro</h1>
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default RegisterPage;