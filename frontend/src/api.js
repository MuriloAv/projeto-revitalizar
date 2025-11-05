import axios from 'axios';

// 1. Crie uma "instância" do Axios
const api = axios.create({
  // 2. Defina a URL base do seu BACKEND
  // (Troque pela porta correta do seu backend!)
  baseURL: 'http://localhost:5000' // ou 4000, etc.
});

// 3. Crie um "Interceptor" - Mágico!
// Isso vai "interceptar" TODA requisição antes dela sair
api.interceptors.request.use(
  (config) => {
    // 4. Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // 5. Se o token existir...
    if (token) {
      // 6. Adiciona o token no cabeçalho Authorization
      // O backend espera esse formato: "Bearer seu-token-gigante"
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 7. Libera a requisição para continuar
    return config;
  },
  (error) => {
    // Em caso de erro na configuração
    return Promise.reject(error);
  }
);

// 8. Exporta a instância configurada
export default api;