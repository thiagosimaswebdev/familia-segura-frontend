import axios from "axios";

// Cria uma instância do axios com a URL base da API
// A URL vem do arquivo .env.local — NEXT_PUBLIC_ significa que é acessível no browser
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Interceptor de requisição
// Roda automaticamente antes de TODA requisição
// Adiciona o token JWT no header Authorization se ele existir no localStorage
api.interceptors.request.use((config) => {
  // Verifica se está no browser (localStorage não existe no servidor)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta
// Roda automaticamente depois de TODA resposta
// Se a API retornar 401 (não autorizado), limpa o token e redireciona para o login
api.interceptors.response.use(
  (response) => response, // se deu certo, retorna normalmente
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;