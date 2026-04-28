"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import CardDashboard from "@/components/CardDashboard";

// useAuth permite acessar o estado de autenticação global
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const router = useRouter();

  // Pega o usuário logado do contexto global
  const { usuario, carregando: authCarregando } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Aguarda o AuthContext terminar de verificar a sessão
    // Isso evita redirecionar antes de saber se o usuário está logado
    if (authCarregando) return;

    // Se não há usuário logado, redireciona para o login
    if (!usuario) {
      router.push("/login");
      return;
    }

    async function buscarDashboard() {
      try {
        // O interceptor do api.js já adiciona o token automaticamente
        const { data } = await api.get("/abrigos/dashboard");
        setDados(data);
      } catch (err) {
        setErro("Erro ao carregar dados do dashboard");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    buscarDashboard();
  }, [usuario, authCarregando, router]); // roda quando o estado de auth muda

  // Mostra spinner enquanto verifica autenticação
  if (authCarregando || carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">

      {/* ── CABEÇALHO ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Olá, <strong>{usuario?.usuario}</strong>! Visão geral em tempo real.
            </p>
          </div>
          {/* Data e hora atual */}
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm">
            📅 {new Date().toLocaleDateString("pt-BR", {
              weekday: "long", day: "2-digit", month: "long",
            })}
          </div>
        </div>
      </div>

      {/* ── SEÇÃO DE ABRIGOS ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏠</span>
          <h2 className="text-lg font-bold text-slate-700">Abrigos</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <CardDashboard titulo="Total"       valor={dados.abrigos.total_abrigos}                                      cor="blue"  icone="🏠" />
          <CardDashboard titulo="Capacidade"  valor={Number(dados.abrigos.capacidade_total).toLocaleString()}           cor="slate" icone="👥" />
          <CardDashboard titulo="Vagas"       valor={Number(dados.abrigos.vagas_disponiveis).toLocaleString()}          cor="green" icone="✅" />
          <CardDashboard titulo="Disponíveis" valor={dados.abrigos.abrigos_disponiveis}                                 cor="green" icone="🟢" />
          <CardDashboard titulo="Lotados"     valor={dados.abrigos.abrigos_lotados}                                     cor="red"   icone="🔴" />
          <CardDashboard titulo="Fechados"    valor={dados.abrigos.abrigos_fechados}                                    cor="gray"  icone="⚫" />
        </div>
      </div>

      {/* ── SEÇÃO DE FAMÍLIAS ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">👨‍👩‍👧‍👦</span>
          <h2 className="text-lg font-bold text-slate-700">Famílias</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <CardDashboard titulo="Total de famílias"  valor={dados.familias.total_familias}         cor="blue"  icone="👨‍👩‍👧‍👦" />
          <CardDashboard titulo="Total de pessoas"   valor={dados.familias.total_pessoas || 0}     cor="slate" icone="👤" />
          <CardDashboard titulo="Desabrigadas"       valor={dados.familias.familias_desabrigadas}  cor="red"   icone="🆘" />
          <CardDashboard titulo="Em abrigo"          valor={dados.familias.familias_em_abrigo}     cor="green" icone="🏡" />
        </div>
      </div>
    </div>
  );
}