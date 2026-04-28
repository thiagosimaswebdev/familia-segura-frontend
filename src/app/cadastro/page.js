"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

export default function CadastroUsuario() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
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
    setSucesso("");

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await api.post("/usuarios", {
        nome: form.nome,
        usuario: form.usuario,
        senha: form.senha,
      });

      setSucesso("Usuário cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setErro(
        err.response?.data?.erro ||
        "Erro ao cadastrar usuário."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-md fade-in">

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-3xl">👤</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Criar Conta
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Cadastre um usuário para acessar o sistema
          </p>
        </div>

        {/* Alertas */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            ❌ {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
            ✅ {sucesso}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome completo
            </label>

            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Digite seu nome"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirmar senha
            </label>

            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              required
              placeholder="Repita sua senha"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Já possui conta?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}