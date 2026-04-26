"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function CadastroFamilia() {
  const router = useRouter();
  const [abrigos, setAbrigos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [form, setForm] = useState({
    nome_responsavel: "",
    cpf: "",
    telefone: "",
    num_membros: "",
    abrigo_id: "",
    status: "desabrigada",
    observacoes: "",
  });

  useEffect(() => {
    // Rota protegida
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Busca abrigos disponíveis para popular o select
    async function buscarAbrigos() {
      try {
        const { data } = await api.get("/abrigos", {
          params: { status: "disponivel", limit: 50 },
        });
        setAbrigos(data.abrigos || []);
      } catch (erro) {
        console.error("Erro ao buscar abrigos:", erro);
      }
    }
    buscarAbrigos();
  }, [router]);

  // Atualiza o campo correto do form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Formata o CPF automaticamente: 000.000.000-00
  function handleCpf(e) {
    let v = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    setForm({ ...form, cpf: v });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const body = {
        ...form,
        num_membros: parseInt(form.num_membros),
        abrigo_id: form.abrigo_id ? parseInt(form.abrigo_id) : null,
      };

      await api.post("/familias", body);

      setSucesso("Família cadastrada com sucesso!");

      // Redireciona para a lista após 2 segundos
      setTimeout(() => router.push("/familias"), 2000);
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao cadastrar família");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <button onClick={() => router.back()}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1">
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-slate-800">Cadastrar Família</h1>
        <p className="text-slate-500 mt-1">Registre uma família afetada pela enchente</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        {/* Mensagens de feedback */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{erro}</div>
        )}
        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{sucesso}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome do responsável */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do responsável *</label>
            <input type="text" name="nome_responsavel" value={form.nome_responsavel}
              onChange={handleChange} required placeholder="Nome completo"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* CPF e Telefone lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
              <input type="text" name="cpf" value={form.cpf} onChange={handleCpf}
                required placeholder="000.000.000-00" maxLength={14}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange}
                required placeholder="21999999999" maxLength={11}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Número de membros */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número de membros *</label>
            <input type="number" name="num_membros" value={form.num_membros}
              onChange={handleChange} required min={1} placeholder="Ex: 4"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Vincular ao abrigo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vincular a um abrigo</label>
            <select name="abrigo_id" value={form.abrigo_id} onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Nenhum (família desabrigada)</option>
              {abrigos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} — {a.bairro} ({a.vagas_disponiveis} vagas)
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={handleChange}
              rows={3} placeholder="Ex: Família com crianças pequenas, necessita de berço..."
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Botão de submit */}
          <button type="submit" disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60">
            {carregando ? "Cadastrando..." : "Cadastrar família"}
          </button>
        </form>
      </div>
    </div>
  );
}