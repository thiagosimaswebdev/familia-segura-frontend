import axios from "axios";

// Instância do axios com a URL base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// Interceptor de requisição
// Adiciona o token JWT automaticamente se existir
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // Só adiciona Authorization se existir token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const token = localStorage.getItem("token");
      const path = window.location.pathname;

      // =========================
      // ROTAS PÚBLICAS
      // =========================
      const rotasPublicas = [
        "/",
        "/abrigos",
        "/familias", // ← ADICIONADO
        "/login",
        "/cadastro",
      ];

      const ehRotaPublica =
        rotasPublicas.some((r) => path === r) ||
        path.startsWith("/abrigos/") ||
        path.startsWith("/familias"); // ← ADICIONADO

      // =========================
      // Só redireciona se:
      // - tinha token
      // - NÃO é rota pública
      // =========================
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