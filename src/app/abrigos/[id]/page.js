"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

// Mapa dinâmico — evita erro de SSR do Next.js
const MapaAbrigos = dynamic(() => import("@/components/MapaAbrigos"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />,
});

export default function DetalheAbrigo() {
  const { id } = useParams(); // pega o ID da URL — ex: /abrigos/3
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
  }, [id]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!abrigo) {
    return <div className="text-center py-16 text-slate-400">Abrigo não encontrado</div>;
  }

  // Calcula a porcentagem de ocupação
  const ocupacao = Math.round(
    ((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100
  );

  return (
    <div>
      {/* Botão voltar */}
      <button onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1">
        ← Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Informações do abrigo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">{abrigo.nome}</h1>
            <StatusBadge status={abrigo.status} />
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 min-w-24">Endereço:</span>
              <span>{abrigo.endereco}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 min-w-24">Bairro:</span>
              <span>{abrigo.bairro}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 min-w-24">Cidade:</span>
              <span>{abrigo.cidade}</span>
            </div>
            {abrigo.telefone && (
              <div className="flex gap-2">
                <span className="font-medium text-slate-700 min-w-24">Telefone:</span>
                <span>{abrigo.telefone}</span>
              </div>
            )}
            {abrigo.responsavel && (
              <div className="flex gap-2">
                <span className="font-medium text-slate-700 min-w-24">Responsável:</span>
                <span>{abrigo.responsavel}</span>
              </div>
            )}
          </div>

          {/* Barra de ocupação */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Ocupação</span>
              <span className="font-medium text-slate-800">{ocupacao}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  ocupacao >= 100 ? "bg-red-500" :
                  ocupacao >= 80  ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(ocupacao, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{abrigo.vagas_disponiveis} vagas disponíveis</span>
              <span>Capacidade: {abrigo.capacidade_total}</span>
            </div>
          </div>
        </div>

        {/* Mini mapa do abrigo */}
        <div className="h-80 lg:h-auto rounded-2xl overflow-hidden border border-slate-200">
          <MapaAbrigos abrigos={[abrigo]} zoom={15} />
        </div>
      </div>
    </div>
  );
}