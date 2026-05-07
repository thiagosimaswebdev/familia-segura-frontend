import axios from "axios";

// Instância do axios com a URL base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// Interceptor de requisição: adiciona o token JWT automaticamente se existir
// Rotas públicas funcionam sem token — o backend já trata isso
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta: só redireciona para login se:
// 1. Receber 401
// 2. O usuário TINHA um token (sessão expirada)
// 3. Não estiver em rota pública
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const path = window.location.pathname;

      // Rotas públicas — nunca redireciona para login
      const rotasPublicas = ["/", "/abrigos", "/login", "/cadastro"];
      const ehRotaPublica =
        rotasPublicas.some((r) => path === r) ||
        path.startsWith("/abrigos/");

      // Só limpa a sessão e redireciona se tinha token E não é rota pública
      if (token && !ehRotaPublica) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;