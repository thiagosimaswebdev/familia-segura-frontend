"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Corrige o problema de ícones quebrados do Leaflet no Next.js
// O Leaflet tenta carregar ícones de um caminho que não existe no Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Cria ícones coloridos para cada status do abrigo
// Verde = disponível, Vermelho = lotado, Cinza = fechado
function criarIcone(status) {
  const cores = {
    disponivel: "#22c55e", // green-500
    lotado: "#ef4444",     // red-500
    fechado: "#94a3b8",    // slate-400
  };

  const cor = cores[status] || cores.disponivel;

  // Cria um ícone SVG personalizado para cada status
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${cor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14], // ponto de ancoragem do ícone no mapa
    popupAnchor: [0, -16], // posição do popup em relação ao ícone
  });
}

// Componente auxiliar que ajusta o centro do mapa quando os abrigos mudam
function AjustarVista({ abrigos, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (abrigos.length === 1) {
      // Se tem só um abrigo, centraliza nele
      map.setView([abrigos[0].latitude, abrigos[0].longitude], zoom || 15);
    } else if (abrigos.length > 1) {
      // Se tem vários, ajusta para mostrar todos
      const bounds = L.latLngBounds(
        abrigos.map((a) => [a.latitude, a.longitude])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [abrigos, map, zoom]);

  return null;
}

export default function MapaAbrigos({ abrigos = [], zoom }) {
  // Centro padrão do mapa — Rio de Janeiro
  const centroRio = [-22.9068, -43.1729];

  return (
    <MapContainer
      center={centroRio}
      zoom={11}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Camada base do mapa — OpenStreetMap (gratuito) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Ajusta a vista automaticamente quando os abrigos mudam */}
      {abrigos.length > 0 && <AjustarVista abrigos={abrigos} zoom={zoom} />}

      {/* Marcador para cada abrigo */}
      {abrigos.map((abrigo) => (
        <Marker
          key={abrigo.id}
          position={[abrigo.latitude, abrigo.longitude]}
          icon={criarIcone(abrigo.status)}
        >
          {/* Popup que aparece ao clicar no marcador */}
          <Popup>
            <div className="min-w-48">
              <p className="font-bold text-slate-800 text-sm">{abrigo.nome}</p>
              <p className="text-slate-500 text-xs mt-1">{abrigo.bairro}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-600">
                  {abrigo.vagas_disponiveis} vagas
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    abrigo.status === "disponivel"
                      ? "bg-green-100 text-green-700"
                      : abrigo.status === "lotado"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {abrigo.status}
                </span>
              </div>
              {/* Link para o detalhe do abrigo */}
              <a
                href={`/abrigos/${abrigo.id}`}
                className="block text-center text-xs text-blue-600 hover:underline mt-2"
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
