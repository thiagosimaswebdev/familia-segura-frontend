"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import CardAbrigo from "@/components/CardAbrigo";

export default function Abrigos() {
  // Lista de abrigos retornada pela API
  const [abrigos, setAbrigos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados dos filtros — quando mudam, a busca é refeita
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroBairro, setFiltroBairro] = useState("");

  // Controle de paginação
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  // useEffect com array de dependências — roda sempre que uma delas muda
  // Isso é como um "watch" — monitora os valores e rebusca quando mudam
  useEffect(() => {
    async function buscarAbrigos() {
      setCarregando(true);
      try {
        // Monta os parâmetros de query dinâmicamente
        const params = { page: pagina, limit: 9 };
        if (filtroStatus) params.status = filtroStatus;
        if (filtroBairro) params.bairro = filtroBairro;

        const { data } = await api.get("/abrigos", { params });
        setAbrigos(data.abrigos || []);
        setTotalPaginas(data.total_paginas || 1);
        setTotal(data.total || 0);
      } catch (erro) {
        console.error("Erro ao buscar abrigos:", erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarAbrigos();
  }, [filtroStatus, filtroBairro, pagina]); // dependências do useEffect

  // Quando muda o filtro, volta para a página 1
  // Evita ficar em uma página que não existe após filtrar
  function handleFiltroStatus(valor) {
    setFiltroStatus(valor);
    setPagina(1);
  }

  function handleFiltroBairro(e) {
    setFiltroBairro(e.target.value);
    setPagina(1);
  }

  return (
    <div className="fade-in">

      {/* ── CABEÇALHO ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Abrigos</h1>
          <p className="text-slate-500 mt-1">
            {total > 0 ? `${total} abrigos encontrados` : "Nenhum abrigo encontrado"}
          </p>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-48">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => handleFiltroStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            >
              <option value="">Todos os status</option>
              <option value="disponivel">✅ Disponível</option>
              <option value="lotado">🔴 Lotado</option>
              <option value="fechado">⚫ Fechado</option>
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Bairro</label>
            <input
              type="text"
              placeholder="Ex: Tijuca, Bangu..."
              value={filtroBairro}
              onChange={handleFiltroBairro}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          {/* Botão limpar filtros */}
          {(filtroStatus || filtroBairro) && (
            <button
              onClick={() => { setFiltroStatus(""); setFiltroBairro(""); setPagina(1); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── GRID DE CARDS ── */}
      {carregando ? (
        // Skeleton loading — placeholders animados enquanto carrega
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-6" />
              <div className="h-2 bg-slate-200 rounded mb-4" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : abrigos.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🏚️</span>
          <p className="text-slate-500 text-lg">Nenhum abrigo encontrado</p>
          <p className="text-slate-400 text-sm mt-1">Tente mudar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {abrigos.map((abrigo) => (
            <CardAbrigo key={abrigo.id} abrigo={abrigo} />
          ))}
        </div>
      )}

      {/* ── PAGINAÇÃO ── */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            ← Anterior
          </button>

          {/* Números de página */}
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagina(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                pagina === i + 1
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Próximo →
          </button>
        </div>
      )}
    </div>
  );
}