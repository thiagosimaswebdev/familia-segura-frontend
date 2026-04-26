// Componente reutilizável para exibir um contador no dashboard
// Recebe titulo, valor e cor como props
export default function CardDashboard({ titulo, valor, cor = "blue" }) {

  // Mapa de cores — cada cor tem um conjunto de classes do Tailwind
  const cores = {
    blue:  { bg: "bg-blue-50",  text: "text-blue-700",  valor: "text-blue-800"  },
    green: { bg: "bg-green-50", text: "text-green-700", valor: "text-green-800" },
    red:   { bg: "bg-red-50",   text: "text-red-700",   valor: "text-red-800"   },
    gray:  { bg: "bg-slate-50", text: "text-slate-600", valor: "text-slate-800" },
    slate: { bg: "bg-slate-50", text: "text-slate-600", valor: "text-slate-800" },
  };

  const estilo = cores[cor] || cores.blue;

  return (
    <div className={`${estilo.bg} rounded-xl p-4 border border-slate-100`}>
      {/* Valor em destaque */}
      <p className={`text-2xl font-bold ${estilo.valor}`}>{valor}</p>
      {/* Título abaixo do valor */}
      <p className={`text-xs mt-1 ${estilo.text}`}>{titulo}</p>
    </div>
  );
}
