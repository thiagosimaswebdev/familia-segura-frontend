"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

const STATUS_CONFIG = {
  ativo:    { classe: "bg-green-100 text-green-700",  label: "Ativo",    icone: "✅" },
  pendente: { classe: "bg-amber-100 text-amber-700",  label: "Pendente", icone: "⏳" },
  inativo:  { classe: "bg-slate-100 text-slate-600",  label: "Inativo",  icone: "⚫" },
};

const ROLE_CONFIG = {
  admin:    { classe: "bg-purple-100 text-purple-700", label: "Admin"    },
  operador: { classe: "bg-blue-100 text-blue-700",     label: "Operador" },
};

export default function AdminUsuarios() {
  const router = useRouter();
  const { usuario, carregando: authCarregando } = useAuth();

  const [usuarios, setUsuarios]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [sucesso, setSucesso]       = useState("");
  const [erro, setErro]             = useState("");
  const [editando, setEditando]     = useState(null);
  const [formEdicao, setFormEdicao] = useState({ status: "", role: "" });
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null); // id do usuário a excluir

  useEffect(() => {
    if (authCarregando) return;
    if (!usuario) { router.push("/login"); return; }
    if (usuario.role !== "admin") { router.push("/"); return; }
    buscarUsuarios();
  }, [usuario, authCarregando, router]);

  async function buscarUsuarios() {
    setCarregando(true);
    try {
      const { data } = await api.get("/admin/usuarios");
      setUsuarios(data);
    } catch { setErro("Erro ao carregar usuários"); }
    finally { setCarregando(false); }
  }

  function feedback(msg, tipo = "sucesso") {
    if (tipo === "sucesso") { setSucesso(msg); setErro(""); }
    else { setErro(msg); setSucesso(""); }
    setTimeout(() => { setSucesso(""); setErro(""); }, 4000);
  }

  function abrirEdicao(u) {
    setEditando(u.id);
    setFormEdicao({ status: u.status, role: u.role });
    setConfirmandoExclusao(null);
  }

  function cancelarEdicao() {
    setEditando(null);
    setFormEdicao({ status: "", role: "" });
  }

  async function salvarEdicao(id) {
    try {
      const { data } = await api.patch(`/admin/usuarios/${id}`, formEdicao);
      setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, ...data.usuario } : u));
      setEditando(null);
      feedback("Usuário atualizado com sucesso!");
    } catch (err) {
      feedback(err.response?.data?.erro || "Erro ao atualizar", "erro");
    }
  }

  async function aprovarRapido(id) {
    try {
      await api.patch(`/admin/usuarios/${id}`, { status: "ativo" });
      setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, status: "ativo" } : u));
      feedback("Usuário aprovado com sucesso!");
    } catch (err) {
      feedback(err.response?.data?.erro || "Erro ao aprovar", "erro");
    }
  }

  async function excluirUsuario(id) {
    try {
      await api.delete(`/admin/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setConfirmandoExclusao(null);
      feedback("Usuário excluído com sucesso!");
    } catch (err) {
      feedback(err.response?.data?.erro || "Erro ao excluir", "erro");
    }
  }

  if (authCarregando || carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendentes = usuarios.filter((u) => u.status === "pendente");

  return (
    <div className="fade-in space-y-6">

      {/* ── CABEÇALHO ── */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Painel Admin</h1>
            <p className="text-purple-100 mt-1">Gerenciamento de usuários do sistema</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Pendentes", valor: pendentes.length,                              cor: "bg-amber-400/30"  },
              { label: "Total",     valor: usuarios.length,                               cor: "bg-white/20"      },
            ].map((item) => (
              <div key={item.label} className={`${item.cor} backdrop-blur rounded-xl px-4 py-2 text-center min-w-16`}>
                <p className="text-2xl font-bold">{item.valor}</p>
                <p className="text-xs text-purple-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEEDBACKS ── */}
      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          ✅ {sucesso}
        </div>
      )}
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          ❌ {erro}
        </div>
      )}

      {/* ── ALERTA PENDENTES ── */}
      {pendentes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-amber-700 text-sm">
          <span className="text-xl">⏳</span>
          <span><strong>{pendentes.length}</strong> usuário{pendentes.length > 1 ? "s" : ""} aguardando aprovação</span>
        </div>
      )}

      {/* ── TABELA ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        {/* Cabeçalho */}
        <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span className="col-span-4">Usuário</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-2">Cadastro</span>
          <span className="col-span-2 text-right">Ações</span>
        </div>

        {usuarios.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Nenhum usuário encontrado</div>
        ) : (
          usuarios.map((u, i) => (
            <div key={u.id}>

              {/* Linha do usuário */}
              <div className={`grid grid-cols-12 px-5 py-4 border-b border-slate-100 text-sm items-center transition-colors hover:bg-slate-50/80 ${
                u.status === "pendente" ? "border-l-4 border-l-amber-400" : ""
              } ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>

                {/* Nome e usuário */}
                <div className="col-span-4">
                  <p className="font-semibold text-slate-800">{u.nome}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">@{u.usuario}</p>
                </div>

                {/* Status badge */}
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[u.status]?.classe}`}>
                    {STATUS_CONFIG[u.status]?.icone} {STATUS_CONFIG[u.status]?.label}
                  </span>
                </div>

                {/* Role badge */}
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_CONFIG[u.role]?.classe}`}>
                    {ROLE_CONFIG[u.role]?.label}
                  </span>
                </div>

                {/* Data de cadastro */}
                <div className="col-span-2 text-xs text-slate-400">
                  {new Date(u.criado_em).toLocaleDateString("pt-BR")}
                </div>

                {/* Botões de ação */}
                <div className="col-span-2 flex justify-end gap-1.5">

                  {/* Aprovar rápido — só pendentes */}
                  {u.status === "pendente" && u.id !== usuario?.id && (
                    <button onClick={() => aprovarRapido(u.id)} title="Aprovar acesso"
                      className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center justify-center text-sm transition-colors font-bold">
                      ✓
                    </button>
                  )}

                  {/* Editar */}
                  {u.id !== usuario?.id && (
                    <button onClick={() => abrirEdicao(u)} title="Editar usuário"
                      className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center text-sm transition-colors">
                      ✎
                    </button>
                  )}

                  {/* Excluir */}
                  {u.id !== usuario?.id && (
                    <button onClick={() => { setConfirmandoExclusao(u.id); setEditando(null); }}
                      title="Excluir usuário"
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center text-sm transition-colors">
                      🗑
                    </button>
                  )}

                  {/* Indicador de usuário atual */}
                  {u.id === usuario?.id && (
                    <span className="text-xs text-slate-400 italic px-2">você</span>
                  )}
                </div>
              </div>

              {/* ── FORMULÁRIO DE EDIÇÃO INLINE ── */}
              {editando === u.id && (
                <div className="bg-blue-50 border-b border-blue-100 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Editando <span className="text-blue-600">@{u.usuario}</span>
                  </p>
                  <div className="flex gap-3 flex-wrap items-end">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
                      <select value={formEdicao.status}
                        onChange={(e) => setFormEdicao({ ...formEdicao, status: e.target.value })}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="pendente">Pendente</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Role</label>
                      <select value={formEdicao.role}
                        onChange={(e) => setFormEdicao({ ...formEdicao, role: e.target.value })}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="operador">Operador</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button onClick={() => salvarEdicao(u.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                      Salvar
                    </button>
                    <button onClick={cancelarEdicao}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* ── CONFIRMAÇÃO DE EXCLUSÃO ── */}
              {confirmandoExclusao === u.id && (
                <div className="bg-red-50 border-b border-red-100 px-5 py-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                      <span className="text-xl">⚠️</span>
                      <span>
                        Tem certeza que deseja excluir <strong>@{u.usuario}</strong>?
                        Esta ação não pode ser desfeita.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => excluirUsuario(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        Sim, excluir
                      </button>
                      <button onClick={() => setConfirmandoExclusao(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}