"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();   // rota atual — para destacar o link ativo
  const { usuario, logout } = useAuth();

  // Estado do menu hambúrguer — true = aberto, false = fechado
  const [menuAberto, setMenuAberto] = useState(false);

  // Fecha o menu sempre que a rota muda (usuário clicou em um link)
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  const links = [
    { href: "/",          label: "Mapa"      },
    { href: "/abrigos",   label: "Abrigos"   },
    { href: "/familias",  label: "Famílias"  },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Verifica se o link está ativo — pathname === href
  const isAtivo = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 text-lg flex-shrink-0">
            <span className="text-2xl">🏠</span>
            <span className="hidden sm:block">Família Segura</span>
            {/* Versão curta para mobile */}
            <span className="sm:hidden">F. Segura</span>
          </Link>

          {/* ── LINKS — DESKTOP ── */}
          {/* hidden md:flex = esconde em mobile, mostra em telas médias+ */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAtivo(link.href)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── AÇÕES — DESKTOP ── */}
          <div className="hidden md:flex items-center gap-3">
            {usuario ? (
              <>
                <span className="text-sm text-slate-500">
                  Olá, <strong className="text-slate-700">{usuario.usuario}</strong>
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/cadastro"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  Cadastrar
                </Link>
                <Link href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Entrar
                </Link>
              </div>
            )}
          </div>

          {/* ── BOTÃO HAMBÚRGUER — MOBILE ── */}
          {/* md:hidden = só aparece em telas pequenas */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {/* Ícone muda entre ☰ e ✕ dependendo do estado */}
            {menuAberto ? (
              // X para fechar
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hambúrguer para abrir
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── MENU MOBILE — aparece quando hambúrguer é clicado ── */}
      {/* transition suave de altura */}
      {menuAberto && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {/* Links de navegação */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isAtivo(link.href)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divisor */}
          <div className="border-t border-slate-100 pt-2 mt-2">
            {usuario ? (
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-slate-500">
                  Olá, <strong>{usuario.usuario}</strong>
                </span>
                <button onClick={logout}
                  className="text-sm text-red-500 font-medium hover:text-red-700">
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex gap-2 px-2">
                <Link href="/cadastro"
                  className="flex-1 text-center text-sm text-blue-600 font-medium py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50">
                  Cadastrar
                </Link>
                <Link href="/login"
                  className="flex-1 text-center bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700">
                  Entrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}