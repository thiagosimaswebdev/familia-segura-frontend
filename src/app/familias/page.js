// src/app/familias/page.js

"use client";

// ─────────────────────────────────────
// PÁGINA DE FAMÍLIAS
// AGORA É PÚBLICA
//
// Visitantes podem:
// - visualizar famílias
// - pesquisar familiares
//
// Usuários logados podem:
// - cadastrar famílias
// ─────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";

export default function Familias() {

  // auth agora NÃO bloqueia a página
  const { usuario } = useAuth();

  const [familias, setFamilias] = useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [filtroStatus, setFiltroStatus] =
    useState("");

  const [pagina, setPagina] = useState(1);

  const [totalPaginas, setTotalPaginas] =
    useState(1);

  const [total, setTotal] = useState(0);

  // busca pública
  const [busca, setBusca] = useState("");

  // ─────────────────────────────────────
  // BUSCAR FAMÍLIAS
  // ─────────────────────────────────────
  useEffect(() => {

    async function buscarFamilias() {

      setCarregando(true);

      try {

        const params = {
          page: pagina,
          limit: 2,
        };

        // filtro status
        if (filtroStatus) {
          params.status = filtroStatus;
        }

        // busca pública
        if (busca.trim()) {
          params.nome = busca;
        }

        const { data } = await api.get(
          "/familias",
          { params }
        );

        setFamilias(data.familias || []);

        setTotalPaginas(
          data.total_paginas || 1
        );

        setTotal(data.total || 0);

      } catch (erro) {

        console.error(
          "Erro ao buscar famílias:",
          erro
        );

      } finally {

        setCarregando(false);
      }
    }

    buscarFamilias();

  }, [filtroStatus, pagina, busca]);

  return (
    <div className="fade-in">

      {/* ───────────────────────────── */}
      {/* CABEÇALHO */}
      {/* ───────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Famílias Abrigadas
          </h1>

          <p className="text-slate-500 mt-1">
            {total} famílias cadastradas
          </p>

        </div>

        {/* cadastro só para logados */}
        {usuario && (

          <Link
            href="/familias/cadastro"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <span>+</span>
            Cadastrar família
          </Link>

        )}

      </div>

      {/* ───────────────────────────── */}
      {/* BUSCA PÚBLICA */}
      {/* ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">

        <label className="text-sm font-semibold text-slate-700 mb-2 block">
          Buscar familiar
        </label>

        <input
          type="text"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(1);
          }}
          placeholder="Digite nome e sobrenome de qualquer membro da família..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <p className="text-xs text-slate-400 mt-2">
          A busca funciona pelo nome do responsável
          ou qualquer membro cadastrado.
        </p>

      </div>

      {/* ───────────────────────────── */}
      {/* FILTRO STATUS */}
      {/* ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">

        <label className="text-xs font-medium text-slate-500 mb-1 block">
          Filtrar por status
        </label>

        <div className="flex gap-2 flex-wrap">

          {[
            {
              value: "",
              label: "Todos",
            },

            {
              value: "desabrigada",
              label: "🆘 Desabrigada",
            },

            {
              value: "em_abrigo",
              label: "🏡 Em abrigo",
            },

            {
              value: "reassentada",
              label: "✅ Reassentada",
            },

          ].map((f) => (

            <button
              key={f.value}
              onClick={() => {
                setFiltroStatus(f.value);
                setPagina(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>

          ))}

        </div>

      </div>

      {/* ───────────────────────────── */}
      {/* LISTAGEM */}
      {/* ───────────────────────────── */}
      {carregando ? (

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {[...Array(5)].map((_, i) => (

            <div
              key={i}
              className="flex gap-4 p-4 border-b border-slate-100 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded flex-1" />
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-200 rounded w-32" />
              <div className="h-4 bg-slate-200 rounded w-24" />
            </div>

          ))}

        </div>

      ) : familias.length === 0 ? (

        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">

          <span className="text-6xl mb-4 block">
            👨‍👩‍👧‍👦
          </span>

          <p className="text-slate-500 text-lg">
            Nenhuma família encontrada
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {familias.map((familia) => (

            <div
              key={familia.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
            >

              {/* topo */}
              <div className="flex items-start justify-between gap-4 flex-wrap">

                <div>

                  <h2 className="text-lg font-bold text-slate-800">
                    {familia.nome_responsavel}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {familia.num_membros} membros
                  </p>

                </div>

                <StatusBadge status={familia.status} />

              </div>

              {/* membros */}
              <div className="mt-5">

                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2 font-semibold">
                  Membros cadastrados
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-line text-sm text-slate-700">
                  {familia.observacoes || "Não informado"}
                </div>

              </div>

              {/* abrigo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 font-semibold">
                    Abrigo
                  </p>

                  <p className="text-sm text-slate-700">
                    {familia.abrigo_nome || "Não vinculado"}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 font-semibold">
                    Bairro
                  </p>

                  <p className="text-sm text-slate-700">
                    {familia.abrigo_bairro || "Não informado"}
                  </p>

                </div>

              </div>

              {/* botão detalhes */}
              <div className="mt-5 flex justify-end">

                <Link
                  href={`/familias/${familia.id}`}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2
                    rounded-xl
                    bg-blue-600 hover:bg-blue-700
                    text-white text-sm font-medium
                    transition-colors
                  "
                >
                  Ver detalhes →
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ───────────────────────────── */}
      {/* PAGINAÇÃO */}
      {/* ───────────────────────────── */}
      {totalPaginas > 1 && (

        <div className="flex justify-center items-center gap-2 mt-6">

          <button
            onClick={() =>
              setPagina((p) =>
                Math.max(1, p - 1)
              )
            }
            disabled={pagina === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            ← Anterior
          </button>

          <span className="px-4 py-2 text-sm text-slate-600">
            {pagina} / {totalPaginas}
          </span>

          <button
            onClick={() =>
              setPagina((p) =>
                Math.min(totalPaginas, p + 1)
              )
            }
            disabled={
              pagina === totalPaginas
            }
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            Próximo →
          </button>

        </div>

      )}

    </div>
  );
}