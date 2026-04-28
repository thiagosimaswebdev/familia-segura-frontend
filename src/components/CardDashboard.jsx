// Card de contador para o dashboard
// Props: titulo, valor, cor, icone
export default function CardDashboard({ titulo, valor, cor = "blue", icone }) {
  const cores = {
    blue:  { bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-100"   },
    green: { bg: "bg-green-50",  text: "text-green-800",  border: "border-green-100"  },
    red:   { bg: "bg-red-50",    text: "text-red-800",    border: "border-red-100"    },
    gray:  { bg: "bg-slate-50",  text: "text-slate-700",  border: "border-slate-200"  },
    slate: { bg: "bg-slate-50",  text: "text-slate-700",  border: "border-slate-200"  },
  };
  const e = cores[cor] || cores.blue;

  return (
    <div className={`${e.bg} rounded-2xl p-4 border ${e.border} hover:shadow-sm transition-shadow`}>
      {icone && <span className="text-2xl mb-2 block">{icone}</span>}
      <p className={`text-2xl font-bold ${e.text}`}>{valor}</p>
      <p className="text-xs text-slate-500 mt-1 leading-tight">{titulo}</p>
    </div>
  );
}