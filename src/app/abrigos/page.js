"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import CardAbrigo from "@/components/CardAbrigo";

export default function Abrigos() {
  const [abrigos, setAbrigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroBairro, setFiltroBairro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  // Rebusca os abrigos sempre que filtro ou página muda
  useEffect(() => {
    async function buscarAbrigos() {
      setCarregando(true);
      try {
        const params = { page: pagina, limit: 9 };
        if (filtroStatus) params.status = filtroStatus;
        if (filtroBairro) params.bairro = filtroBairro;

        const { data } = await api.get("/abrigos", { params });
        setAbrigos(data.abrigos || []);
        setTotalPaginas(data.total_paginas);
        setTotal(data.total);
      } catch (erro) {
        console.error("Erro ao buscar abrigos:", erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarAbrigos();
  }, [filtroStatus, filtroBairro, pagina]);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Abrigos</h1>
          <p className="text-slate-500 mt-1">{total} abrigos encontrados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex gap-4 flex-wrap">
        <select
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="disponivel">Disponível</option>
          <option value="lotado">Lotado</option>
          <option value="fechado">Fechado</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por bairro..."
          value={filtroBairro}
          onChange={(e) => { setFiltroBairro(e.target.value); setPagina(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid de cards */}
      {carregando ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-slate-500">Carregando...</p>
        </div>
      ) : abrigos.length === 0 ? (
        <div className="text-center py-16 text-slate-400">Nenhum abrigo encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {abrigos.map((abrigo) => (
            <CardAbrigo key={abrigo.id} abrigo={abrigo} />
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-slate-600">{pagina} / {totalPaginas}</span>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}