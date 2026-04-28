"use client";

// CADASTRO DE FAMÍLIA
// Só acessa após login

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function CadastroFamilia() {
  const router = useRouter();

  const [abrigos, setAbrigos] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome_responsavel: "",
    cpf: "",
    telefone: "",
    num_membros: "",
    abrigo_id: "",
    status: "desabrigada",
    observacoes: "",
  });

  // Proteção da rota + buscar abrigos
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function buscarAbrigos() {
      try {
        const { data } = await api.get("/abrigos", {
          params: {
            status: "disponivel",
            limit: 50,
          },
        });

        setAbrigos(data.abrigos || []);
      } catch (error) {
        console.error("Erro ao buscar abrigos:", error);
      }
    }

    buscarAbrigos();
  }, [router]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // máscara CPF
  function handleCpf(e) {
    let valor = e.target.value.replace(/\D/g, "");

    valor = valor.slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setForm({
      ...form,
      cpf: valor,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const body = {
        ...form,
        num_membros: Number(form.num_membros),
        abrigo_id: form.abrigo_id
          ? Number(form.abrigo_id)
          : null,
      };

      await api.post("/familias", body);

      setSucesso("Família cadastrada com sucesso!");

      setTimeout(() => {
        router.push("/familias");
      }, 1800);

    } catch (err) {
      setErro(
        err.response?.data?.erro ||
        "Erro ao cadastrar família"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8">

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-2xl fade-in">

        {/* topo */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-3xl">👨‍👩‍👧‍👦</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Cadastro de Família
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Registre famílias afetadas pela enchente
          </p>

        </div>

        {/* alertas */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            ❌ {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
            ✅ {sucesso}
          </div>
        )}

        {/* formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome do responsável
            </label>

            <input
              type="text"
              name="nome_responsavel"
              value={form.nome_responsavel}
              onChange={handleChange}
              required
              placeholder="Nome completo"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* linha cpf telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                CPF
              </label>

              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleCpf}
                required
                maxLength={14}
                placeholder="000.000.000-00"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Telefone
              </label>

              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                placeholder="21999999999"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* membros */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Número de membros
            </label>

            <input
              type="number"
              name="num_membros"
              value={form.num_membros}
              onChange={handleChange}
              required
              min="1"
              placeholder="Ex: 4"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* abrigo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Vincular abrigo
            </label>

            <select
              name="abrigo_id"
              value={form.abrigo_id}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Nenhum (desabrigada)
              </option>

              {abrigos.map((abrigo) => (
                <option
                  key={abrigo.id}
                  value={abrigo.id}
                >
                  {abrigo.nome} - {abrigo.bairro}
                </option>
              ))}
            </select>
          </div>

          {/* observações */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Observações
            </label>

            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              rows="3"
              placeholder="Informações adicionais..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* botão */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {carregando
              ? "Cadastrando..."
              : "Cadastrar Família"}
          </button>

        </form>

      </div>
    </div>
  );
}