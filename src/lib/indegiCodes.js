// src/lib/inegiCodes.js

export const STATE_TO_ID = {
  "Aguascalientes": "01",
  "Baja California": "02",
  "Baja California Sur": "03",
  "Campeche": "04",
  "Coahuila": "05", "Coahuila de Zaragoza": "05",
  "Colima": "06",
  "Chiapas": "07",
  "Chihuahua": "08",
  "Ciudad de México": "09", "CDMX": "09", "Distrito Federal": "09",
  "Durango": "10",
  "Guanajuato": "11",
  "Guerrero": "12",
  "Hidalgo": "13",
  "Jalisco": "14",
  "México": "15", "Edomex": "15", "Estado de México": "15",
  "Michoacán": "16", "Michoacán de Ocampo": "16",
  "Morelos": "17",
  "Nayarit": "18",
  "Nuevo León": "19",
  "Oaxaca": "20",
  "Puebla": "21",
  "Querétaro": "22",
  "Quintana Roo": "23",
  "San Luis Potosí": "24",
  "Sinaloa": "25",
  "Sonora": "26",
  "Tabasco": "27",
  "Tamaulipas": "28",
  "Tlaxcala": "29",
  "Veracruz": "30", "Veracruz de Ignacio de la Llave": "30",
  "Yucatán": "31",
  "Zacatecas": "32"
};

export const getStateId = (name) => {
  if (!name) return null;
  // 1. Intento directo
  if (STATE_TO_ID[name]) return STATE_TO_ID[name];

  // 2. Intento normalizado (sin acentos, minúsculas)
  // Ej: "Michoacan" -> "Michoacán"
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  
  const foundKey = Object.keys(STATE_TO_ID).find(key => {
    const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return cleanKey === cleanName;
  });

  return foundKey ? STATE_TO_ID[foundKey] : null;
};