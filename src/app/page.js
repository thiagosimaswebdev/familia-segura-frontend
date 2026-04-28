"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/services/api";

const MapaAbrigos = dynamic(() => import("@/components/MapaAbrigos"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-500 text-sm">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [abrigos, setAbrigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");

  // valores seguros para evitar undefined
  const [stats, setStats] = useState({
    abrigos: {
      abrigos_disponiveis: 0,
      vagas_disponiveis: 0,
    },
    familias: {
      familias_em_abrigo: 0,
    },
  });

  useEffect(() => {
    async function buscarDados() {
      try {
        setCarregando(true);

        const params = { limit: 50 };
        if (filtroStatus) params.status = filtroStatus;

        const [abrigosRes, dashRes] = await Promise.all([
          api.get("/abrigos", { params }),
          api.get("/abrigos/dashboard").catch(() => null),
        ]);

        setAbrigos(abrigosRes.data.abrigos || []);

        // garante estrutura correta
        if (dashRes?.data) {
          setStats({
            abrigos: {
              abrigos_disponiveis:
                dashRes.data.abrigos?.abrigos_disponiveis || 0,
              vagas_disponiveis:
                dashRes.data.abrigos?.vagas_disponiveis || 0,
            },
            familias: {
              familias_em_abrigo:
                dashRes.data.familias?.familias_em_abrigo || 0,
            },
          });
        }
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, [filtroStatus]);

  const filtros = [
    { value: "", label: "Todos", cor: "bg-slate-700 text-white" },
    { value: "disponivel", label: "Disponível", cor: "bg-green-600 text-white" },
    { value: "lotado", label: "Lotado", cor: "bg-red-600 text-white" },
    { value: "fechado", label: "Fechado", cor: "bg-slate-400 text-white" },
  ];

  return (
    <div className="fade-in">
      {/* HERO */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-8 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏠</span>
            <h1 className="text-3xl font-bold text-white">Família Segura</h1>
          </div>

          <p className="text-blue-100 text-lg">
            Encontre abrigos disponíveis próximos a você em tempo real
          </p>

          {/* estatísticas seguras */}
          <div className="flex gap-6 mt-4 flex-wrap">
            {[
              {
                label: "Abrigos ativos",
                valor: stats.abrigos.abrigos_disponiveis,
              },
              {
                label: "Vagas disponíveis",
                valor: Number(
                  stats.abrigos.vagas_disponiveis
                ).toLocaleString(),
              },
              {
                label: "Famílias acolhidas",
                valor: stats.familias.familias_em_abrigo,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/20 backdrop-blur rounded-xl px-4 py-2"
              >
                <p className="text-2xl font-bold text-white">{item.valor}</p>
                <p className="text-blue-100 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filtros.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltroStatus(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
              filtroStatus === f.value
                ? f.cor + " shadow-md scale-105"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:shadow"
            }`}
          >
            {f.label}
          </button>
        ))}

        <span className="ml-auto flex items-center text-sm text-slate-500">
          {abrigos.length} abrigos
        </span>
      </div>

      {/* MAPA */}
      <div className="w-full h-[520px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
        {carregando ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500">Carregando abrigos...</p>
            </div>
          </div>
        ) : (
          <MapaAbrigos abrigos={abrigos} />
        )}
      </div>

      {/* LEGENDA */}
      <div className="flex gap-6 mt-4 text-sm text-slate-600 flex-wrap">
        {[
          { cor: "bg-green-500", label: "Disponível" },
          { cor: "bg-red-500", label: "Lotado" },
          { cor: "bg-slate-400", label: "Fechado" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.cor}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}