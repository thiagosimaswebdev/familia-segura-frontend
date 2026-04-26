"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function Login() {
  const router = useRouter();

  // Estado do formulário — campos usuario e senha
  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Atualiza o campo correto do form quando o usuário digita
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Envia as credenciais para a API
  // Se ok → salva o token no localStorage e redireciona para o dashboard
  // Se erro → exibe a mensagem de erro
  async function handleSubmit(e) {
    e.preventDefault(); // evita o comportamento padrão do form (reload da página)
    setErro("");
    setCarregando(true);

    try {
      const { data } = await api.post("/login", form);

      // Salva o token JWT para usar nas próximas requisições
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", form.usuario);

      router.push("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 w-full max-w-md">

        {/* Ícone e título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Família Segura</h1>
          <p className="text-slate-500 text-sm mt-1">Acesse o painel de controle</p>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {erro}
          </div>
        )}

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}