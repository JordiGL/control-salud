// src/constants/campos.js
import { ETIQUETAS_CONFIG, LUGARES_CONFIG } from "./metricas";

export const CONFIG_CAMPOS = [
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
  {
    id: "ca125",
    label: "CA-125",
    type: "number",
    placeholder: "U/mL",
    defaultValue: "",
    exportar: true,
  },
  {
    id: "peso",
    label: "Peso",
    type: "number",
    step: "0.1",
    placeholder: "Kg",
    defaultValue: "",
    exportar: true,
  },
  {
    id: "lugarPeso",
    label: "",
    type: "select",
    defaultValue: "",
    // Generamos las opciones dinámicamente desde la config central
    options: [
      // Añadimos una opción vacía inicial
      { value: "", label: "¿Dónde?" },

      // Mapeamos el resto de opciones
      ...Object.keys(LUGARES_CONFIG).map((key) => ({
        value: key,
        label: LUGARES_CONFIG[key].label,
      })),
    ],
    exportar: true,
  },
  {
    id: "etiqueta",
    label: "Contexto",
    type: "select",
    fullWidth: true, // Propiedad personalizada para el CSS
    defaultValue: "",
    // Convertimos tus etiquetas importadas al formato compatible
    options: [
      { value: "", label: "Sin contexto definido" },
      ...Object.keys(ETIQUETAS_CONFIG).map((key) => ({
        value: key,
        label: ETIQUETAS_CONFIG[key].label,
      })),
    ],
    exportar: true,
  },
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
