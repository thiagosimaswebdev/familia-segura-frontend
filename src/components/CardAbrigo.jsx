import Link from "next/link";
import StatusBadge from "./StatusBadge";

// Componente de card para exibir um abrigo na listagem
// Recebe o objeto abrigo como prop e renderiza as informações principais
export default function CardAbrigo({ abrigo }) {
  // Calcula a porcentagem de ocupação do abrigo
  const ocupacao = Math.round(
    ((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100
  );

  // Define a cor da barra de ocupação baseado na porcentagem
  const corBarra =
    ocupacao >= 100 ? "bg-red-500" :
    ocupacao >= 80  ? "bg-amber-500" :
                      "bg-green-500";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">

      {/* Cabeçalho do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-2">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">
            {abrigo.nome}
          </h3>
          <p className="text-slate-500 text-xs mt-1">{abrigo.bairro} — {abrigo.cidade}</p>
        </div>
        {/* Badge colorido com o status */}
        <StatusBadge status={abrigo.status} />
      </div>

      {/* Endereço */}
      <p className="text-slate-500 text-xs mb-4 truncate">{abrigo.endereco}</p>

      {/* Barra de ocupação */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Ocupação</span>
          <span>{ocupacao}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${corBarra}`}
            style={{ width: `${Math.min(ocupacao, 100)}%` }}
          />
        </div>
      </div>

      {/* Vagas e capacidade */}
      <div className="flex justify-between text-xs text-slate-600 mb-4">
        <span>
          <span className="font-semibold text-slate-800">{abrigo.vagas_disponiveis}</span> vagas disponíveis
        </span>
        <span>Capacidade: {abrigo.capacidade_total}</span>
      </div>

      {/* Link para o detalhe */}
      <Link
        href={`/abrigos/${abrigo.id}`}
        className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors"
      >
        Ver detalhes
      </Link>
    </div>
  );
}
