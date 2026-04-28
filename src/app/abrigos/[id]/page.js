"use client";

import { useEffect, useState } from "react";

// useParams pega os parâmetros da URL dinâmica
// Ex: /abrigos/3 → useParams() retorna { id: "3" }
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

// Mapa carregado de forma lazy (apenas no browser)
const MapaAbrigos = dynamic(() => import("@/components/MapaAbrigos"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
      <p className="text-slate-400 text-sm">Carregando mapa...</p>
    </div>
  ),
});

export default function DetalheAbrigo() {
  // id vem da URL dinâmica — [id] no nome da pasta
  const { id } = useParams();
  const router = useRouter();
  const [abrigo, setAbrigo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarAbrigo() {
      try {
        const { data } = await api.get(`/abrigos/${id}`);
        setAbrigo(data);
      } catch (erro) {
        console.error("Erro ao buscar abrigo:", erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarAbrigo();
  }, [id]); // roda de novo se o id mudar (ex: usuário navega entre abrigos)

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!abrigo) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl mb-4 block">🔍</span>
        <p className="text-slate-500 text-lg">Abrigo não encontrado</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm mt-2">
          ← Voltar
        </button>
      </div>
    );
  }

  // Calcula a porcentagem de ocupação
  // Ex: capacidade 200, vagas 50 → ocupação 75%
  const ocupacao = Math.round(
    ((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100
  );

  // Cor da barra baseada na ocupação
  const corBarra =
    ocupacao >= 100 ? "from-red-500 to-red-600" :
    ocupacao >= 80  ? "from-amber-400 to-orange-500" :
                      "from-green-400 to-emerald-500";

  return (
    <div className="fade-in">

      {/* ── BOTÃO VOLTAR ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Voltar para abrigos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── INFORMAÇÕES ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          {/* Cabeçalho do card */}
          <div className="flex items-start justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">{abrigo.nome}</h1>
              <p className="text-slate-500 text-sm mt-1">{abrigo.bairro} · {abrigo.cidade}</p>
            </div>
            <StatusBadge status={abrigo.status} />
          </div>

          {/* Detalhes em lista */}
          <div className="space-y-3 mb-6">
            {[
              { label: "📍 Endereço",    valor: abrigo.endereco    },
              { label: "📞 Telefone",    valor: abrigo.telefone    },
              { label: "👤 Responsável", valor: abrigo.responsavel },
            ]
              .filter((item) => item.valor) // remove itens sem valor
              .map((item) => (
                <div key={item.label} className="flex gap-3 text-sm">
                  <span className="text-slate-500 min-w-28">{item.label}</span>
                  <span className="text-slate-800 font-medium">{item.valor}</span>
                </div>
              ))}
          </div>

          {/* ── BARRA DE OCUPAÇÃO ── */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700">Ocupação atual</span>
              <span className={`text-lg font-bold ${
                ocupacao >= 100 ? "text-red-600" :
                ocupacao >= 80  ? "text-amber-600" : "text-green-600"
              }`}>
                {ocupacao}%
              </span>
            </div>

            {/* Barra de progresso com gradiente */}
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full bg-gradient-to-r ${corBarra} transition-all duration-500`}
                style={{ width: `${Math.min(ocupacao, 100)}%` }}
              />
            </div>

            {/* Detalhes de vagas */}
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span className="font-medium text-green-600">
                {abrigo.vagas_disponiveis} vagas disponíveis
              </span>
              <span>Capacidade total: {abrigo.capacidade_total}</span>
            </div>
          </div>
        </div>

        {/* ── MINI MAPA ── */}
        <div className="h-80 lg:h-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-64">
          <MapaAbrigos abrigos={[abrigo]} zoom={15} />
        </div>
      </div>
    </div>
  );
}