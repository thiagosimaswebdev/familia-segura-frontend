import "./globals.css";
import Navbar from "@/components/Navbar";

// Metadados da aplicação — aparecem na aba do navegador
export const metadata = {
  title: "Família Segura",
  description: "Sistema de gerenciamento de abrigos e famílias em situação de enchente",
};

// Layout raiz — envolve todas as páginas da aplicação
// A Navbar aparece em todas as páginas automaticamente
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50">
        {/* Navbar fixa no topo em todas as páginas */}
        <Navbar />
        {/* Conteúdo específico de cada página */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}