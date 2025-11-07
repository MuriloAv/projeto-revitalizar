import axios from 'axios';

// "instância" do Axios
const api = axios.create({
  // URL base do BACKEND  
  baseURL: 'http://localhost:5000' // 
});

// Isso vai "interceptar" TODA requisição antes dela sair
api.interceptors.request.use(
  (config) => {
    // 4. Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token existir...
    if (token) {
      // Adiciona o token no cabeçalho Authorization
      // O backend espera esse formato: "Bearer seu-token-gigante"
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Libera a requisição para continuar
    return config;
  },
  (error) => {
    // Em caso de erro na configuração
    return Promise.reject(error);
  }
);

// Exporta a instância configurada
export default api;