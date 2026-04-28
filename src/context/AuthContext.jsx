"use client";

// Context API permite compartilhar dados globalmente sem passar props
// Aqui gerenciamos: usuário logado, token, login e logout
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

// Cria o contexto vazio
const AuthContext = createContext({});

// Provider — envolve a aplicação e disponibiliza os dados de auth
export function AuthProvider({ children }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);     // dados do usuário logado
  const [carregando, setCarregando] = useState(true); // true enquanto verifica sessão

  // Ao iniciar, verifica se há sessão salva no localStorage
  // Isso mantém o usuário logado ao recarregar a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const nomeUsuario = localStorage.getItem("usuario");
    if (token && nomeUsuario) {
      setUsuario({ usuario: nomeUsuario, token });
    }
    setCarregando(false); // terminou de verificar — libera a renderização
  }, []);

  // Função de login: chama a API, salva o token e atualiza o estado
  async function login(credenciais) {
    const { data } = await api.post("/login", credenciais);
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", credenciais.usuario);
    setUsuario({ usuario: credenciais.usuario, token: data.token });
    router.push("/dashboard");
  }

  // Função de logout: limpa tudo e vai para o login
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
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