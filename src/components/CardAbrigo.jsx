import Link from "next/link";
import StatusBadge from "./StatusBadge";

// Card de um abrigo na listagem — recebe o objeto abrigo como prop
export default function CardAbrigo({ abrigo }) {
  // Calcula porcentagem de ocupação
  const ocupacao = Math.round(
    ((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100
  );

  // Cor da barra baseada na ocupação
  const corBarra =
    ocupacao >= 100 ? "from-red-500 to-red-600" :
    ocupacao >= 80  ? "from-amber-400 to-orange-500" :
                      "from-green-400 to-emerald-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight flex-1">
          {abrigo.nome}
        </h3>
        <StatusBadge status={abrigo.status} />
      </div>

      {/* Bairro e endereço */}
      <p className="text-blue-600 text-xs font-medium mb-1">{abrigo.bairro}</p>
      <p className="text-slate-400 text-xs mb-4 truncate">{abrigo.endereco}</p>

      {/* Barra de ocupação */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Ocupação</span>
          <span className="font-medium">{ocupacao}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${corBarra} transition-all duration-500`}
            style={{ width: `${Math.min(ocupacao, 100)}%` }}
          />
        </div>
      </div>

      {/* Vagas */}
      <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
        <span>
          <strong className="text-slate-700 text-sm">{abrigo.vagas_disponiveis}</strong> vagas disponíveis
        </span>
        <span>Cap: {abrigo.capacidade_total}</span>
      </div>

      {/* Botão de detalhe */}
      <Link
        href={`/abrigos/${abrigo.id}`}
        className="block text-center text-sm text-blue-600 font-semibold border border-blue-200 rounded-xl py-2 hover:bg-blue-50 hover:border-blue-400 transition-colors"
      >
        Ver detalhes →
      </Link>
    </div>
  );
}