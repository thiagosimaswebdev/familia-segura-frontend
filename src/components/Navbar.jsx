// src/components/Navbar.jsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {

  const pathname = usePathname();

  const {
    usuario,
    logout,
  } = useAuth();

  const [menuAberto, setMenuAberto] =
    useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  // ─────────────────────────────────────
  // LINKS PÚBLICOS
  // ─────────────────────────────────────
  const linksPublicos = [
    { href: "/", label: "Mapa" },
    { href: "/abrigos", label: "Abrigos" },

    // agora famílias é pública
    { href: "/familias", label: "Famílias" },
  ];

  // ─────────────────────────────────────
  // LINKS PRIVADOS
  // ─────────────────────────────────────
  const linksPrivados = [
    { href: "/dashboard", label: "Dashboard" },
  ];

  // ─────────────────────────────────────
  // ADMIN
  // ─────────────────────────────────────
  const linkAdmin = {
    href: "/admin",
    label: "⚙️ Admin",
  };

  // ─────────────────────────────────────
  // LINK ATIVO
  // ─────────────────────────────────────
  const isAtivo = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  const classeLink = (href) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isAtivo(href)
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
    }`;

  const classeLinkMobile = (href) =>
    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isAtivo(href)
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* ───────────────────────────── */}
          {/* LOGO */}
          {/* ───────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-800 text-lg flex-shrink-0"
          >

            <span className="text-2xl">
              🏠
            </span>

            <span className="hidden sm:block">
              Família Segura
            </span>

            <span className="sm:hidden">
              F. Segura
            </span>

          </Link>

          {/* ───────────────────────────── */}
          {/* LINKS DESKTOP */}
          {/* ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">

            {/* públicos */}
            {linksPublicos.map((link) => (

              <Link
                key={link.href}
                href={link.href}
                className={classeLink(link.href)}
              >
                {link.label}
              </Link>

            ))}

            {/* privados */}
            {usuario &&
              linksPrivados.map((link) => (

                <Link
                  key={link.href}
                  href={link.href}
                  className={classeLink(link.href)}
                >
                  {link.label}
                </Link>

              ))}

            {/* admin */}
            {usuario?.role === "admin" && (

              <Link
                href={linkAdmin.href}
                className={`${classeLink(linkAdmin.href)} ${
                  isAtivo(linkAdmin.href)
                    ? ""
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                {linkAdmin.label}
              </Link>

            )}

          </div>

          {/* ───────────────────────────── */}
          {/* AÇÕES DESKTOP */}
          {/* ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">

            {usuario ? (

              <>
                <span className="text-sm text-slate-500">

                  Olá,
                  <strong className="text-slate-700">
                    {" "}
                    {usuario.usuario}
                  </strong>

                  {usuario.role === "admin" && (
                    <span className="ml-1 text-xs text-purple-600 font-semibold">
                      (admin)
                    </span>
                  )}

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

                <Link
                  href="/cadastro"
                  className="text-sm text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Cadastrar
                </Link>

                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Entrar
                </Link>

              </div>

            )}

          </div>

          {/* ───────────────────────────── */}
          {/* MENU MOBILE */}
          {/* ───────────────────────────── */}
          <button
            onClick={() =>
              setMenuAberto(!menuAberto)
            }
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >

            {menuAberto ? (

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

            ) : (

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

            )}

          </button>

        </div>
      </div>

      {/* ───────────────────────────── */}
      {/* MENU MOBILE */}
      {/* ───────────────────────────── */}
      {menuAberto && (

        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">

          {linksPublicos.map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className={classeLinkMobile(link.href)}
            >
              {link.label}
            </Link>

          ))}

          {usuario &&
            linksPrivados.map((link) => (

              <Link
                key={link.href}
                href={link.href}
                className={classeLinkMobile(link.href)}
              >
                {link.label}
              </Link>

            ))}

          {usuario?.role === "admin" && (

            <Link
              href={linkAdmin.href}
              className={`${classeLinkMobile(linkAdmin.href)} text-purple-600`}
            >
              {linkAdmin.label}
            </Link>

          )}

          <div className="border-t border-slate-100 pt-2 mt-2">

            {usuario ? (

              <div className="flex items-center justify-between px-4 py-2">

                <span className="text-sm text-slate-500">

                  <strong>
                    {usuario.usuario}
                  </strong>

                  {usuario.role === "admin" && (
                    <span className="ml-1 text-xs text-purple-600">
                      (admin)
                    </span>
                  )}

                </span>

                <button
                  onClick={logout}
                  className="text-sm text-red-500 font-medium"
                >
                  Sair
                </button>

              </div>

            ) : (

              <div className="flex gap-2 px-2">

                <Link
                  href="/cadastro"
                  className="flex-1 text-center text-sm text-blue-600 font-medium py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50"
                >
                  Cadastrar
                </Link>

                <Link
                  href="/login"
                  className="flex-1 text-center bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700"
                >
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