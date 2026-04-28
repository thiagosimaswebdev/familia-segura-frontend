"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Corrige o problema de ícones quebrados do Leaflet no Next.js
// O Next.js processa os arquivos de forma diferente e o Leaflet perde o caminho dos ícones
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Cria ícone circular colorido por status
// Verde = disponível | Vermelho = lotado | Cinza = fechado
function criarIcone(status) {
  const cores = {
    disponivel: { bg: "#22c55e", borda: "#16a34a" },
    lotado:     { bg: "#ef4444", borda: "#dc2626" },
    fechado:    { bg: "#94a3b8", borda: "#64748b" },
  };
  const c = cores[status] || cores.disponivel;

  return L.divIcon({
    className: "", // remove classe padrão do Leaflet
    html: `
      <div style="
        width: 24px; height: 24px;
        background: ${c.bg};
        border: 3px solid ${c.borda};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],   // centro do ícone fica no ponto do mapa
    popupAnchor: [0, -14],  // popup aparece acima do ícone
  });
}

// Componente auxiliar que ajusta a visão do mapa quando os abrigos mudam
// useMap() é um hook do react-leaflet que acessa a instância do mapa
function AjustarVista({ abrigos, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!abrigos || abrigos.length === 0) return;

    if (abrigos.length === 1) {
      // Um abrigo: centraliza com zoom próximo
      map.setView([abrigos[0].latitude, abrigos[0].longitude], zoom || 15);
    } else {
      // Vários abrigos: ajusta para mostrar todos no viewport
      const bounds = L.latLngBounds(
        abrigos.map((a) => [a.latitude, a.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [abrigos, map, zoom]); // roda sempre que a lista de abrigos muda

  return null; // componente auxiliar — não renderiza nada visualmente
}

export default function MapaAbrigos({ abrigos = [], zoom }) {
  // Centro padrão: Rio de Janeiro
  const centroRio = [-22.9068, -43.1729];

  return (
    <MapContainer
      center={centroRio}
      zoom={11}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Camada base do mapa — OpenStreetMap (gratuito, sem chave de API) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Ajusta a vista quando a lista de abrigos muda (filtros) */}
      <AjustarVista abrigos={abrigos} zoom={zoom} />

      {/* Marcador para cada abrigo */}
      {abrigos.map((abrigo) => (
        <Marker
          key={abrigo.id}
          position={[abrigo.latitude, abrigo.longitude]}
          icon={criarIcone(abrigo.status)}
        >
          {/* Popup ao clicar no marcador */}
          <Popup minWidth={200}>
            <div>
              {/* Nome do abrigo */}
              <p className="font-bold text-slate-800 text-sm leading-tight mb-1">
                {abrigo.nome}
              </p>

              {/* Bairro */}
              <p className="text-slate-500 text-xs mb-2">{abrigo.bairro}</p>

              {/* Vagas e status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600">
                  <strong>{abrigo.vagas_disponiveis}</strong> vagas
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  abrigo.status === "disponivel" ? "bg-green-100 text-green-700" :
                  abrigo.status === "lotado"     ? "bg-red-100 text-red-700"     :
                                                   "bg-slate-100 text-slate-600"
                }`}>
                  {abrigo.status === "disponivel" ? "Disponível" :
                   abrigo.status === "lotado"     ? "Lotado"     : "Fechado"}
                </span>
              </div>

              {/* Link para detalhes */}
              <a
                href={`/abrigos/${abrigo.id}`}
                className="block text-center text-xs text-blue-600 hover:underline font-medium"
              >
                Ver detalhes →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}