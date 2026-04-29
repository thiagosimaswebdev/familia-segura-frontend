"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    usuario: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      await login(form);

      // remove foco do input no mobile
      if (document.activeElement) {
        document.activeElement.blur();
      }

    } catch (err) {
      setErro(
        err.response?.data?.erro ||
        "Usuário ou senha inválidos"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-md fade-in">

        {/* topo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-3xl">🏠</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Bem-vindo de volta
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Acesse o painel do sistema
          </p>
        </div>

        {/* erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            ❌ {erro}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Usuário
            </label>

            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              required
              placeholder="Digite seu usuário"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="text-blue-600 hover:underline font-medium"
          >
            Criar conta
          </Link>
        </p>

      </div>
    </div>
  );
}