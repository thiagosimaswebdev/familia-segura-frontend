"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import CardDashboard from "@/components/CardDashboard";

export default function Dashboard() {
  const router = useRouter();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Rota protegida — verifica se há token antes de buscar os dados
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function buscarDashboard() {
      try {
        // O interceptor do api.js já adiciona o token automaticamente
        const { data } = await api.get("/abrigos/dashboard");
        setDados(data);
      } catch (err) {
        setErro("Erro ao carregar dados do dashboard");
      } finally {
        setCarregando(false);
      }
    }

    buscarDashboard();
  }, [router]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Carregando dashboard...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
        {erro}
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral em tempo real</p>
      </div>

      {/* Seção de abrigos */}
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Abrigos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <CardDashboard titulo="Total de abrigos" valor={dados.abrigos.total_abrigos} cor="blue" />
        <CardDashboard titulo="Capacidade total" valor={Number(dados.abrigos.capacidade_total).toLocaleString()} cor="slate" />
        <CardDashboard titulo="Vagas disponíveis" valor={Number(dados.abrigos.vagas_disponiveis).toLocaleString()} cor="green" />
        <CardDashboard titulo="Disponíveis" valor={dados.abrigos.abrigos_disponiveis} cor="green" />
        <CardDashboard titulo="Lotados" valor={dados.abrigos.abrigos_lotados} cor="red" />
        <CardDashboard titulo="Fechados" valor={dados.abrigos.abrigos_fechados} cor="gray" />
      </div>

      {/* Seção de famílias */}
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Famílias</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardDashboard titulo="Total de famílias" valor={dados.familias.total_familias} cor="blue" />
        <CardDashboard titulo="Total de pessoas" valor={dados.familias.total_pessoas || 0} cor="slate" />
        <CardDashboard titulo="Desabrigadas" valor={dados.familias.familias_desabrigadas} cor="red" />
        <CardDashboard titulo="Em abrigo" valor={dados.familias.familias_em_abrigo} cor="green" />
      </div>
    </div>
  );
}