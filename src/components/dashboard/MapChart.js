'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getStateId } from '../../lib/indegiCodes';
import { Loader2, AlertCircle } from 'lucide-react';

function MapUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        const timer = setTimeout(() => {
            map.invalidateSize();
            map.fitBounds(bounds, { padding: [20, 20], maxZoom: 7, animate: true });
        }, 100);
        return () => clearTimeout(timer);
      } catch (e) { console.warn("Ajustando mapa...", e); }
    }
  }, [bounds, map]);
  return null;
}

// --- COLORES ---
const getColor = (d) => {
  const val = Number(d);
  if (!val) return '#e0e0e0';
  return val > 2000000 ? '#0d47a1' : 
         val > 1000000 ? '#1565c0' :
         val > 500000  ? '#1976d2' :
         val > 100000  ? '#42a5f5' :
         val > 50000   ? '#90caf9' : '#e3f2fd';
};

// --- NORMALIZACIÓN ---
const normalizeText = (text) => {
  if (!text) return "";
  return text.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const getFeatureName = (properties) => {
  return properties.nomgeo || 
         properties.nom_geo || 
         properties.NOMGEO ||
         properties.nom_mun || 
         properties.name || 
         properties.NOM_ENT || 
         "Desconocido";
};

export default function MapChart({ data = [], columns = [] }) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const viewLevel = columns.includes('municipio') ? 'municipality' : 'state';
  
  const activeStateIds = useMemo(() => {
    if (!data || data.length === 0) return [];
    const uniqueStates = [...new Set(data.filter(d => d.entidad).map(d => d.entidad))];
    const ids = uniqueStates.map(name => getStateId(name)).filter(id => id);
    return ids;
  }, [data]);

  const mapKey = `map-${viewLevel}-${activeStateIds.join('-')}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setGeoData(null);
    setErrorMsg(null);

    const fetchData = async () => {
      try {
        let finalFeatures = [];

        if (viewLevel === 'state') {
          // --- NIVEL ESTATAL ---
          const res = await fetch('/data/mexico_states.json');
          if (!res.ok) throw new Error("Falta archivo local: mexico_states.json");
          const collection = await res.json();
          
          const activeStatesNorm = data.map(d => normalizeText(d.entidad));
          
          finalFeatures = collection.features.filter(f => {
             const name = normalizeText(getFeatureName(f.properties));
             return activeStatesNorm.some(s => name.includes(s) || s.includes(name));
          });

        } else if (viewLevel === 'municipality') {
          if (activeStateIds.length === 0) {
             console.warn("No se encontraron IDs de estado para cargar municipios.");
             if (isMounted) {
                setErrorMsg("No se pudo identificar la Entidad Federativa para cargar los municipios. Verifica que la columna 'Entidad' tenga datos válidos.");
                setLoading(false);
             }
             return; 
          }

          const promises = activeStateIds.map(async (id) => {
             const url = `/api/inegi/geo/mgem/${id}`;
             const res = await fetch(url);
             if (!res.ok) throw new Error(`Error API INEGI (${id})`);
             return res.json();
          });

          const results = await Promise.all(promises);
          results.forEach(collection => {
             if (collection.features) finalFeatures.push(...collection.features);
          });
          
          if (finalFeatures.length === 0) {
            throw new Error("La API no devolvió polígonos para los estados seleccionados.");
          }
        }

        if (isMounted) {
            setGeoData({ type: "FeatureCollection", features: finalFeatures });
        }

      } catch (error) {
        console.error("Error MapChart:", error);
        if (isMounted) setErrorMsg(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [viewLevel, mapKey, data, activeStateIds]); 

  const bounds = useMemo(() => {
    if (!geoData || !geoData.features?.length) return [[14.5, -118], [32.7, -86]];
    try {
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
        const sample = geoData.features.length > 500 
            ? geoData.features.filter((_, i) => i % 10 === 0) 
            : geoData.features;

        sample.forEach(f => {
            let coords = [];
            if(f.geometry.type === 'Polygon') coords = f.geometry.coordinates[0];
            else if(f.geometry.type === 'MultiPolygon') coords = f.geometry.coordinates[0][0];

            coords.forEach(c => {
                const lng = c[0]; const lat = c[1];
                if(lat < minLat) minLat = lat; if(lat > maxLat) maxLat = lat;
                if(lng < minLng) minLng = lng; if(lng > maxLng) maxLng = lng;
            });
        });
        if(minLat !== 90) return [[minLat, minLng], [maxLat, maxLng]];
    } catch(e) {}
    return [[14.5, -118], [32.7, -86]];
  }, [geoData]);

  
  const findDataForRow = (feature) => {
    const geoName = normalizeText(getFeatureName(feature.properties));
    const geoStateId = feature.properties.CVE_ENT || feature.properties.cve_ent;

    return data.find(d => {
        let rowNameRaw = viewLevel === 'state' ? d.entidad : d.municipio;
        const rowName = normalizeText(rowNameRaw);
        if (rowName === 'baja california' && geoName.includes('sur')) return false;
        if (geoName === 'baja california' && rowName.includes('sur')) return false;

        // 2. Validación de nombre (Match exacto o parcial seguro)
        const nameMatch = rowName === geoName || 
                          (rowName.length > 3 && geoName.includes(rowName)) ||
                          (geoName.length > 3 && rowName.includes(geoName));
        if (!nameMatch) return false;
        if (viewLevel === 'municipality') {
            const rowStateId = getStateId(d.entidad);
            if (geoStateId && rowStateId) {
                return geoStateId === rowStateId; 
            }
        }
        
        return true;
    });
  };

  const style = (feature) => {
    const dataRow = findDataForRow(feature);
    const hasData = dataRow && (dataRow.poblacion !== undefined);
    return {
      fillColor: hasData ? getColor(dataRow.poblacion) : '#e0e0e0',
      weight: 1, 
      opacity: 1, 
      color: 'white', 
      fillOpacity: 0.8,
      className: 'cursor-default transition-all duration-200' 
    };
  };

  const onEachFeature = (feature, layer) => {
    const geoName = getFeatureName(feature.properties);
    const dataRow = findDataForRow(feature);
    const entidadLabel = dataRow ? dataRow.entidad : ''; 
    const poblacion = dataRow?.poblacion !== undefined 
        ? new Intl.NumberFormat('es-MX').format(dataRow.poblacion) 
        : 'N/A';

    layer.bindTooltip(`
      <div class="text-center px-3 py-2">
        <div class="font-bold text-gray-800 text-xs uppercase mb-1 border-b border-gray-100 pb-1">
            ${geoName} ${viewLevel === 'municipality' && entidadLabel ? `<span class="text-gray-400 text-[10px]">(${entidadLabel})</span>` : ''}
        </div>
        <div class="text-sm ${poblacion !== 'N/A' ? 'text-blue-600 font-bold' : 'text-gray-400 italic'}">
            ${poblacion !== 'N/A' ? `👥 ${poblacion}` : 'Sin datos'}
        </div>
      </div>
    `, { sticky: true, direction: 'top', className: 'bg-white/95 border-0 shadow-xl rounded-lg backdrop-blur-sm' });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 2, color: '#333', fillOpacity: 1 });
        l.bringToFront();
      },
      mouseout: (e) => { e.target.setStyle(style(feature)); },
    });
  };

  return (
    <div className="h-full w-full relative z-0 bg-slate-50 rounded-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-1001 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
             <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <span className="text-sm font-semibold text-gray-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                   Cargando zonas...
                </span>
             </div>
          </div>
        )}
        {errorMsg && !loading && (
             <div className="absolute inset-0 z-1000 flex flex-col items-center justify-center text-gray-400 text-sm bg-gray-50 p-4 text-center">
                 <AlertCircle className="text-red-400 mb-2" size={32} />
                 <p className="font-semibold text-gray-700 mb-1">Aviso del Mapa</p>
                 <p className="text-xs text-gray-500 max-w-xs">{errorMsg}</p>
             </div>
        )}

        <MapContainer 
            key={mapKey} 
            center={[23.6345, -102.5528]} 
            zoom={4} 
            style={{ height: '100%', width: '100%', background: 'transparent' }} 
            zoomControl={true}
        >
            <TileLayer attribution='&copy; INEGI & OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater bounds={bounds} />
            {geoData && (
                <GeoJSON 
                    key={`geo-${mapKey}`} 
                    data={geoData} 
                    style={style} 
                    onEachFeature={onEachFeature} 
                    interactive={true} 
                />
            )}
        </MapContainer>
        
        {!errorMsg && (
            <div className="absolute bottom-6 left-6 bg-white/90 p-3 rounded-lg shadow-lg z-900 text-xs border border-gray-100 backdrop-blur-sm pointer-events-none">
                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Población Total</h4>
                <div className="space-y-1.5 opacity-90">
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-[#0d47a1]"></span> +2 M</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-[#1565c0]"></span> +1 M</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-[#42a5f5]"></span> +100 k</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-[#e3f2fd]"></span> -50 k</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md bg-[#e0e0e0] border border-gray-300"></span> N/A</div>
                </div>
            </div>
        )}
    </div>
  );
}