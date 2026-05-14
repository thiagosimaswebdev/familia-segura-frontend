"use client";

// Context API permite compartilhar dados globalmente sem passar props
// Aqui gerenciamos: usuário logado, token, login e logout
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/services/api";

// Cria o contexto vazio
const AuthContext = createContext({});

// Provider — envolve a aplicação e disponibiliza os dados de auth
export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [usuario, setUsuario] = useState(null);     
  const [carregando, setCarregando] = useState(true);

  // Rotas protegidas (precisam de login)
  const rotasProtegidas = ["/familias/cadastro", "/usuarios"];

  // Ao iniciar, verifica se há sessão salva no localStorage
  // Isso mantém o usuário logado ao recarregar a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const nomeUsuario = localStorage.getItem("usuario");
    const role = localStorage.getItem("role");

    if (token && nomeUsuario) {
      setUsuario({ usuario: nomeUsuario, token, role });
    }

    setCarregando(false);
  }, []);

  // 🔐 Proteção de rotas
  useEffect(() => {
    if (carregando) return;

    const token = localStorage.getItem("token");

    // Se tentar acessar rota protegida sem login → manda pro login
    if (!token && rotasProtegidas.includes(pathname)) {
      router.push("/login");
    }

    // Se tentar acessar /usuarios sem ser admin → bloqueia
    if (
      pathname === "/usuarios" &&
      usuario &&
      usuario.role !== "admin"
    ) {
      router.push("/");
    }

  }, [pathname, usuario, carregando]);

  // Função de login: chama a API, salva o token e atualiza o estado
  async function login(credenciais) {
    const { data } = await api.post("/login", credenciais);

    // Salva no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", credenciais.usuario);

    // 🔥 IMPORTANTE: pegar role do token (ou backend)
    // como você já envia role no token, salvamos manualmente
    const payload = JSON.parse(atob(data.token.split(".")[1]));
    localStorage.setItem("role", payload.role);

    setUsuario({
      usuario: credenciais.usuario,
      token: data.token,
      role: payload.role,
    });

    // 🔁 Redirecionamento inteligente
    router.push("/familias");
  }

  // Função de logout: limpa tudo e vai para o login
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");

    setUsuario(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o contexto facilmente
export function useAuth() {
  return useContext(AuthContext);
}