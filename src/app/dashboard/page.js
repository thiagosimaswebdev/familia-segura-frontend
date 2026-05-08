"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

// Card principal com ícone, valor e título
function StatCard({ icone, valor, titulo, sub, cor = "white" }) {
  const cores = {
    white:  "bg-white border-slate-200",
    green:  "bg-green-50 border-green-200",
    red:    "bg-red-50 border-red-200",
    amber:  "bg-amber-50 border-amber-200",
    blue:   "bg-blue-50 border-blue-200",
    slate:  "bg-slate-50 border-slate-200",
  };
  return (
    <div className={`rounded-2xl border p-5 ${cores[cor]} flex items-center gap-4`}>
      <div className="text-3xl flex-shrink-0">{icone}</div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-tight">{valor}</p>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{titulo}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// Barra de progresso com label
function ProgressBar({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  const cores = {
    green: "bg-green-500",
    red:   "bg-red-500",
    blue:  "bg-blue-500",
    amber: "bg-amber-400",
  };
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{valor} <span className="text-slate-400">({pct}%)</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${cores[cor]} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { usuario, carregando: authCarregando } = useAuth();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (authCarregando) return;
    if (!usuario) { router.push("/login"); return; }

    api.get("/abrigos/dashboard")
      .then(({ data }) => setDados(data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [usuario, authCarregando, router]);

  if (authCarregando || carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dados) return null;

  const a = dados.abrigos;
  const f = dados.familias;

  // Porcentagem de ocupação geral
  const ocupacaoGeral = a.capacidade_total > 0
    ? Math.round(((a.capacidade_total - a.vagas_disponiveis) / a.capacidade_total) * 100)
    : 0;

  return (
    <div className="fade-in space-y-6">

      {/* ── CABEÇALHO ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Olá, <strong>{usuario?.usuario}</strong>! Dados atualizados em tempo real.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm">
            📅 {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </div>
      </div>

      {/* ── VISÃO GERAL — 3 cards grandes ── */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Visão geral</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icone="🏠" valor={a.total_abrigos}   titulo="Abrigos cadastrados"   sub={`${a.abrigos_disponiveis} disponíveis agora`} cor="white" />
          <StatCard icone="🛏️" valor={Number(a.vagas_disponiveis).toLocaleString()} titulo="Vagas disponíveis" sub={`de ${Number(a.capacidade_total).toLocaleString()} no total`} cor="green" />
          <StatCard icone="👨‍👩‍👧‍👦" valor={f.total_familias}  titulo="Famílias cadastradas"  sub={`${f.total_pessoas || 0} pessoas no total`} cor="blue" />
        </div>
      </div>

      {/* ── LINHA DIVISÓRIA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── STATUS DOS ABRIGOS ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            🏠 Status dos abrigos
          </h2>
          <ProgressBar label="Disponíveis" valor={Number(a.abrigos_disponiveis)} total={Number(a.total_abrigos)} cor="green" />
          <ProgressBar label="Lotados"     valor={Number(a.abrigos_lotados)}     total={Number(a.total_abrigos)} cor="red"   />
          <ProgressBar label="Fechados"    valor={Number(a.abrigos_fechados)}     total={Number(a.total_abrigos)} cor="amber" />

          {/* Ocupação geral */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Ocupação geral da rede</span>
              <span className={`font-bold ${ocupacaoGeral >= 80 ? "text-red-600" : ocupacaoGeral >= 60 ? "text-amber-600" : "text-green-600"}`}>
                {ocupacaoGeral}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  ocupacaoGeral >= 80 ? "bg-red-500" : ocupacaoGeral >= 60 ? "bg-amber-400" : "bg-green-500"
                }`}
                style={{ width: `${ocupacaoGeral}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── STATUS DAS FAMÍLIAS ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            👨‍👩‍👧‍👦 Status das famílias
          </h2>
          <ProgressBar label="Em abrigo"    valor={Number(f.familias_em_abrigo)}    total={Number(f.total_familias)} cor="green" />
          <ProgressBar label="Desabrigadas" valor={Number(f.familias_desabrigadas)} total={Number(f.total_familias)} cor="red"   />
          <ProgressBar label="Reassentadas" valor={Number(f.familias_reassentadas || 0)} total={Number(f.total_familias)} cor="blue"  />

          {/* Cards menores de famílias */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-700">{f.familias_em_abrigo}</p>
              <p className="text-xs text-green-600">Em abrigo</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-red-700">{f.familias_desabrigadas}</p>
              <p className="text-xs text-red-600">Desabrigadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATALHOS RÁPIDOS ── */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Atalhos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/abrigos",          icone: "🏠", label: "Ver abrigos"          },
            { href: "/familias",         icone: "👨‍👩‍👧‍👦", label: "Ver famílias"         },
            { href: "/familias/cadastro",icone: "➕", label: "Cadastrar família"    },
            ...(usuario?.role === "admin"
              ? [{ href: "/admin", icone: "⚙️", label: "Painel admin" }]
              : [{ href: "/",      icone: "🗺️", label: "Ver mapa"     }]
            ),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl">{item.icone}</span>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}