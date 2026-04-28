// Badge colorido para exibir status de abrigos e famílias
export default function StatusBadge({ status }) {
  const config = {
    // Status de abrigos
    disponivel:  { classe: "bg-green-100 text-green-700",  label: "Disponível"   },
    lotado:      { classe: "bg-red-100 text-red-700",      label: "Lotado"       },
    fechado:     { classe: "bg-slate-100 text-slate-600",  label: "Fechado"      },
    // Status de famílias
    desabrigada: { classe: "bg-red-100 text-red-700",      label: "Desabrigada"  },
    em_abrigo:   { classe: "bg-green-100 text-green-700",  label: "Em abrigo"    },
    reassentada: { classe: "bg-blue-100 text-blue-700",    label: "Reassentada"  },
  };

  const { classe, label } = config[status] || { classe: "bg-slate-100 text-slate-600", label: status };

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${classe}`}>
      {label}
    </span>
  );
}