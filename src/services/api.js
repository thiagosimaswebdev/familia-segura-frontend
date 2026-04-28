import axios from "axios";

// Instância do axios com a URL base da API
// NEXT_PUBLIC_ significa que a variável é acessível no browser
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Interceptor de requisição: adiciona o token JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta: se receber 401, limpa a sessão e vai para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Só redireciona se não estiver já na página de login ou cadastro
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/cadastro") {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;