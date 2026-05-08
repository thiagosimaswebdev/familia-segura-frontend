"use client";

// useState → gerencia estados locais do componente
// (formulário, erro, loading)
import { useState } from "react";
import Link from "next/link";

// useAuth → hook do AuthContext que dá acesso à função login
// e ao estado global de autenticação
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  // Pega a função login do contexto global
  // Quando chamada, faz a requisição ao backend e redireciona
  const { login } = useAuth();

  // Estado do formulário — objeto com os dois campos
  const [form, setForm] = useState({ usuario: "", senha: "" });

  // Mensagem de erro exibida abaixo do formulário
  const [erro, setErro] = useState("");

  // true enquanto a requisição de login está em andamento
  const [carregando, setCarregando] = useState(false);

  // Atualiza o campo correto do form dinamicamente
  // [e.target.name] usa o atributo name do input como chave
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    // Previne o comportamento padrão do form (reload da página)
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // Chama o login do AuthContext
      // Se der erro, o catch captura o status HTTP e exibe mensagem
      await login(form);

    } catch (err) {
      // 403 = conta existe mas ainda não foi aprovada pelo admin
      if (err.response?.status === 403) {
        setErro("Conta aguardando aprovação do administrador");
      // 401 = usuário ou senha incorretos
      } else if (err.response?.status === 401) {
        setErro("Usuário ou senha inválidos");
      } else {
        setErro("Erro ao tentar fazer login");
      }
    } finally {
      // Sempre desativa o loading ao terminar (sucesso ou erro)
      setCarregando(false);
    }
  }

  return (
    // min-h-[80vh] → ocupa pelo menos 80% da altura da tela
    // flex items-center justify-center → centraliza o card
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 w-full max-w-md fade-in">

        {/* ── TOPO — ícone e título ── */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm mt-1">Acesse o painel do sistema</p>
        </div>

        {/* ── MENSAGEM DE ERRO ── */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            ❌ {erro}
          </div>
        )}

        {/* ── FORMULÁRIO ── */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Usuário
            </label>
            {/* 
              Nota: font-size nos inputs é forçado para 16px no globals.css
              para evitar o zoom automático no iOS Safari
            */}
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              required
              placeholder="Digite seu usuário"
              autoComplete="username"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
              autoComplete="current-password"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* 
            disabled={carregando} → desativa o botão durante a requisição
            para evitar cliques duplos
          */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {carregando ? (
              <>
                {/* Spinner animado enquanto carrega */}
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : "Entrar"}
          </button>
        </form>

        {/* ── LINK PARA CADASTRO ── */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-blue-600 hover:underline font-medium">
            Criar conta
          </Link>
        </p>

      </div>
    </div>
  );
}