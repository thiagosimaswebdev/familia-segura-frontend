"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import api from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

export default function DetalheFamilia() {

  const params = useParams();

  const [familia, setFamilia] = useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  // ─────────────────────────────────────
  // BUSCAR FAMÍLIA
  // ─────────────────────────────────────
  useEffect(() => {

    async function buscarFamilia() {

      try {

        setCarregando(true);

        const { data } = await api.get(
          `/familias/${params.id}`
        );

        setFamilia(data);

      } catch (err) {

        console.error(err);

        setErro(
          err.response?.data?.erro ||
          "Erro ao carregar família"
        );

      } finally {

        setCarregando(false);
      }
    }

    if (params.id) {
      buscarFamilia();
    }

  }, [params.id]);

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────
  if (carregando) {

    return (

      <div className="animate-pulse">

        <div className="h-10 w-64 bg-slate-200 rounded mb-6" />

        <div className="bg-white rounded-3xl border border-slate-200 p-8">

          <div className="space-y-4">

            <div className="h-5 bg-slate-200 rounded w-1/2" />
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded w-2/3" />

          </div>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────
  // ERRO
  // ─────────────────────────────────────
  if (erro) {

    return (

      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">

        <p className="font-medium">
          {erro}
        </p>

        <Link
          href="/familias"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Voltar
        </Link>

      </div>
    );
  }

  // ─────────────────────────────────────
  // PÁGINA
  // ─────────────────────────────────────
  return (

    <div className="fade-in">

      {/* topo */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">

        <div>

          <Link
            href="/familias"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar
          </Link>

          <h1 className="text-3xl font-bold text-slate-800 mt-2">
            {familia.nome_responsavel}
          </h1>

          <p className="text-slate-500 mt-1">
            Família cadastrada no sistema
          </p>

        </div>

        <StatusBadge status={familia.status} />

      </div>

      {/* conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* dados família */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Informações da Família
          </h2>

          <div className="space-y-5">

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                Responsável
              </p>

              <p className="text-slate-700">
                {familia.nome_responsavel}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                CPF
              </p>

              <p className="text-slate-700">
                {familia.cpf}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                Telefone
              </p>

              <p className="text-slate-700">
                {familia.telefone}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                Número de membros
              </p>

              <p className="text-slate-700">
                {familia.num_membros}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                Membros cadastrados
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 whitespace-pre-line text-slate-700">
                {familia.observacoes || "Não informado"}
              </div>

            </div>

          </div>

        </div>

        {/* dados abrigo */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Abrigo Vinculado
          </h2>

          {familia.abrigo_nome ? (

            <div className="space-y-5">

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  Abrigo
                </p>

                <p className="text-slate-700">
                  {familia.abrigo_nome}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  Endereço
                </p>

                <p className="text-slate-700">
                  {familia.abrigo_endereco}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  Bairro
                </p>

                <p className="text-slate-700">
                  {familia.abrigo_bairro}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  Telefone do abrigo
                </p>

                <p className="text-slate-700">
                  {familia.abrigo_telefone || "Não informado"}
                </p>

              </div>

            </div>

          ) : (

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">

              <span className="text-5xl block mb-3">
                🏠
              </span>

              <p className="text-slate-500">
                Família ainda não vinculada a um abrigo
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}