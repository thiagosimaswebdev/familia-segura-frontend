"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname(); // pega a rota atual para destacar o link ativo
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  // Verifica se há usuário logado ao montar o componente
  useEffect(() => {
    const u = localStorage.getItem("usuario");
    setUsuario(u);
  }, [pathname]); // roda sempre que a rota muda para atualizar o estado

  // Remove o token e redireciona para o login
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  }

  // Links de navegação — active quando o pathname bate com o href
  const links = [
    { href: "/", label: "Mapa" },
    { href: "/abrigos", label: "Abrigos" },
    { href: "/familias", label: "Famílias" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <span className="text-2xl">🏠</span>
          <span>Família Segura</span>
        </Link>

        {/* Links de navegação */}
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600" // link ativo
                  : "text-slate-600 hover:bg-slate-50" // link inativo
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Usuário logado / botão de logout */}
        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="text-sm text-slate-500">Olá, {usuario}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
