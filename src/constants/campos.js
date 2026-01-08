import { ETIQUETAS_CONFIG, LUGARES_CONFIG } from "./metricas";

export const CONFIG_CAMPOS = [
  // --- FILA 1 (3 columnas) ---
  {
    id: "tension",
    label: "Tensión",
    type: "text",
    placeholder: "Sistólica/Diastólica",
    defaultValue: "",
    exportar: true,
  },
  {
    id: "pulso",
    label: "Pulso",
    type: "number",
    placeholder: "BPM",
    defaultValue: "",
    exportar: true,
  },
  {
    id: "oxigeno",
    label: "SpO2",
    type: "number",
    placeholder: "%",
    defaultValue: "",
    exportar: true,
  },

  // --- FILA 2 (CA-125 + Contexto doble) ---
  {
    id: "ca125",
    label: "CA-125",
    type: "number",
    placeholder: "U/mL",
    defaultValue: "",
    exportar: true,
  },
  {
    id: "etiqueta",
    label: "Contexto",
    type: "select",
    gridColumn: "span 2", // <--- ESTA ES LA CLAVE (ocupa 2 huecos)
    defaultValue: "",
    options: [
      { value: "", label: "Sin contexto definido" },
      ...Object.keys(ETIQUETAS_CONFIG).map((key) => ({
        value: key,
        label: ETIQUETAS_CONFIG[key].label,
      })),
    ],
    exportar: true,
  },

  // --- FILA 3 (Peso ocupa todo el ancho) ---
  {
    id: "peso",
    label: "Peso",
    type: "number",
    step: "0.1",
    placeholder: "Kg",
    defaultValue: "",
    fullWidth: true,
    exportar: true,
  },
  // lugarPeso se renderiza dentro de peso, pero debe estar en la lista
  {
    id: "lugarPeso",
    label: "",
    type: "select",
    defaultValue: "",
    options: [
      { value: "", label: "¿Dónde?" },
      ...Object.keys(LUGARES_CONFIG).map((key) => ({
        value: key,
        label: LUGARES_CONFIG[key].label,
      })),
    ],
    exportar: true,
  },

  // --- FILA 4 (Notas ocupa todo el ancho) ---
  {
    id: "notas",
    label: "Notas",
    type: "textarea",
    placeholder: "Opcional...",
    defaultValue: "",
    fullWidth: true,
    exportar: true,
  },
];
