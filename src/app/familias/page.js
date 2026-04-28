"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";

export default function Familias() {
  const router = useRouter();
  const { usuario, carregando: authCarregando } = useAuth();

  const [familias, setFamilias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Aguarda verificação de autenticação antes de agir
    if (authCarregando) return;

    // Rota protegida — redireciona se não logado
    if (!usuario) {
      router.push("/login");
      return;
    }

    async function buscarFamilias() {
      setCarregando(true);
      try {
        const params = { page: pagina, limit: 10 };
        if (filtroStatus) params.status = filtroStatus;

        const { data } = await api.get("/familias", { params });
        setFamilias(data.familias || []);
        setTotalPaginas(data.total_paginas || 1);
        setTotal(data.total || 0);
      } catch (erro) {
        console.error("Erro ao buscar famílias:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarFamilias();
  }, [filtroStatus, pagina, usuario, authCarregando, router]);

  if (authCarregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fade-in">

      {/* ── CABEÇALHO ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Famílias</h1>
          <p className="text-slate-500 mt-1">{total} famílias cadastradas</p>
        </div>

        {/* Botão de cadastro — vai para a página de formulário */}
        <Link
          href="/familias/cadastro"
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span>+</span> Cadastrar família
        </Link>
      </div>

      {/* ── FILTRO DE STATUS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
        <label className="text-xs font-medium text-slate-500 mb-1 block">Filtrar por status</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "",             label: "Todos"        },
            { value: "desabrigada",  label: "🆘 Desabrigada" },
            { value: "em_abrigo",    label: "🏡 Em abrigo"   },
            { value: "reassentada",  label: "✅ Reassentada"  },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setFiltroStatus(f.value); setPagina(1); }}
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

      {/* ── TABELA DE FAMÍLIAS ── */}
      {carregando ? (
        // Skeleton loading da tabela
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded flex-1" />
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-200 rounded w-32" />
              <div className="h-4 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : familias.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <span className="text-6xl mb-4 block">👨‍👩‍👧‍👦</span>
          <p className="text-slate-500 text-lg">Nenhuma família cadastrada</p>
          <Link href="/familias/cadastro"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Cadastrar primeira família →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span>Responsável</span>
            <span>Membros</span>
            <span>Abrigo vinculado</span>
            <span>Status</span>
          </div>

          {/* Linhas da tabela */}
          {familias.map((familia, i) => (
            <div
              key={familia.id}
              className={`grid grid-cols-4 px-4 py-3.5 border-b border-slate-100 text-sm items-center hover:bg-blue-50/50 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <span className="font-medium text-slate-800 truncate">{familia.nome_responsavel}</span>
              <span className="text-slate-600">{familia.num_membros} pessoas</span>
              <span className="text-slate-600 truncate">{familia.abrigo_nome || "—"}</span>
              <StatusBadge status={familia.status} />
            </div>
          ))}
        </div>
      )}

      {/* ── PAGINAÇÃO ── */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-sm text-slate-600">{pagina} / {totalPaginas}</span>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
          >
            Próximo →
          </button>
        </div>
      )}
    </div>
  );
}