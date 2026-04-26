// Componente reutilizável para exibir o status com cor correspondente
// Funciona para status de abrigos (disponivel, lotado, fechado)
// e famílias (desabrigada, em_abrigo, reassentada)
export default function StatusBadge({ status }) {

  // Mapa de estilos por status
  const estilos = {
    // Status de abrigos
    disponivel:   "bg-green-100 text-green-700",
    lotado:       "bg-red-100 text-red-700",
    fechado:      "bg-slate-100 text-slate-600",

    // Status de famílias
    desabrigada:  "bg-red-100 text-red-700",
    em_abrigo:    "bg-green-100 text-green-700",
    reassentada:  "bg-blue-100 text-blue-700",
  };

  // Labels legíveis para cada status
  const labels = {
    disponivel:   "Disponível",
    lotado:       "Lotado",
    fechado:      "Fechado",
    desabrigada:  "Desabrigada",
    em_abrigo:    "Em abrigo",
    reassentada:  "Reassentada",
  };

  const estilo = estilos[status] || "bg-slate-100 text-slate-600";
  const label = labels[status] || status;

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${estilo}`}>
      {label}
    </span>
  );
}
