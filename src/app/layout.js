import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Família Segura",
  description: "Sistema de gerenciamento de abrigos e famílias em situação de enchente",
};

// RootLayout envolve TODA a aplicação
// AuthProvider aqui garante que qualquer página pode acessar useAuth()
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}