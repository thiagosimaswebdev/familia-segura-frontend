"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

export default function Familias() {
  const router = useRouter();
  const [familias, setFamilias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Rota protegida — redireciona para login se não houver token
    const token = localStorage.getItem("token");
    if (!token) {
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
        setTotalPaginas(data.total_paginas);
        setTotal(data.total);
      } catch (erro) {
        console.error("Erro ao buscar famílias:", erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarFamilias();
  }, [filtroStatus, pagina, router]);

  return (
    <div>
      {/* Cabeçalho com botão de cadastro */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Famílias</h1>
          <p className="text-slate-500 mt-1">{total} famílias cadastradas</p>
        </div>
        <Link href="/familias/cadastro"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Cadastrar família
        </Link>
      </div>

      {/* Filtro de status */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <select
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="desabrigada">Desabrigada</option>
          <option value="em_abrigo">Em abrigo</option>
          <option value="reassentada">Reassentada</option>
        </select>
      </div>

      {/* Tabela de famílias */}
      {carregando ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-slate-500">Carregando...</p>
        </div>
      ) : familias.length === 0 ? (
        <div className="text-center py-16 text-slate-400">Nenhuma família encontrada</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Responsável</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Membros</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Abrigo</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {familias.map((familia, i) => (
                <tr key={familia.id}
                  className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{familia.nome_responsavel}</td>
                  <td className="px-4 py-3 text-slate-600">{familia.num_membros} pessoas</td>
                  <td className="px-4 py-3 text-slate-600">{familia.abrigo_nome || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={familia.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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