// layout.js — Layout raiz do Next.js App Router
// Envolve TODAS as páginas da aplicação
// É aqui que ficam: metadados, AuthProvider e Navbar

import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

// Metadados — aparecem na aba do navegador e em SEO
export const metadata = {
  title: "Família Segura",
  description: "Sistema de gerenciamento de abrigos e famílias em situação de enchente",
  icons: { icon: "/favicon.ico" },
};

// viewport como export separado — padrão Next.js 14+
// width=device-width → respeita a largura real do dispositivo
// initial-scale=1 → sem zoom inicial
// maximum-scale=1 → CRÍTICO: impede zoom automático no iOS
// user-scalable=no → desabilita zoom manual (acessibilidade: opcional)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

        {/*
          AuthProvider envolve tudo — qualquer componente filho
          pode acessar o estado de autenticação com useAuth()
          sem precisar passar props manualmente
        */}
        <AuthProvider>
          {/* Navbar aparece em todas as páginas automaticamente */}
          <Navbar />

          {/* 
            Conteúdo de cada página
            px-4 sm:px-6 lg:px-8 → padding responsivo
            max-w-7xl → largura máxima para telas grandes
          */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </AuthProvider>

      </body>
    </html>
  );
}