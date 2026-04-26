"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/services/api";

// O Leaflet precisa do window (browser) para funcionar
// dynamic com ssr: false garante que o mapa só renderiza no browser
// nunca no servidor — evita o erro "window is not defined"
const MapaAbrigos = dynamic(() => import("@/components/MapaAbrigos"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl">
      <p className="text-slate-500">Carregando mapa...</p>
    </div>
  ),
});

export default function Home() {
  const [abrigos, setAbrigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");

  // Busca os abrigos sempre que o filtro muda
  useEffect(() => {
    async function buscarAbrigos() {
      try {
        const params = filtroStatus ? { status: filtroStatus } : {};
        const { data } = await api.get("/abrigos", { params });
        setAbrigos(data.abrigos || []);
      } catch (erro) {
        console.error("Erro ao buscar abrigos:", erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarAbrigos();
  }, [filtroStatus]);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Mapa de Abrigos</h1>
        <p className="text-slate-500 mt-1">
          Encontre abrigos disponíveis próximos a você
        </p>
      </div>

      {/* Filtros de status — botões em formato de chips */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["", "disponivel", "lotado", "fechado"].map((status) => (
          <button
            key={status}
            onClick={() => setFiltroStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtroStatus === status
                ? "bg-blue-600 text-white"        // ativo
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400" // inativo
            }`}
          >
            {status === "" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Mapa — ocupa 500px de altura */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-md border border-slate-200">
        {carregando ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <p className="text-slate-500">Carregando abrigos...</p>
          </div>
        ) : (
          <MapaAbrigos abrigos={abrigos} />
        )}
      </div>

      {/* Legenda de cores */}
      <div className="flex gap-6 mt-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Lotado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span>Fechado</span>
        </div>
      </div>
    </div>
  );
}