// src/constants/metricas.js

export const ETIQUETAS_CONFIG = {
  ejercicio: { bg: "#fee2e2", text: "#991b1b", label: "Post-Ejercicio" },
  estres: { bg: "#ffedd5", text: "#9a3412", label: "Momento de Estrés" },
  quimio: { bg: "#f3e8ff", text: "#6b21a8", label: "Post-Quimioterapia" },
  drenaje: { bg: "#e0f2fe", text: "#0369a1", label: "Post-Drenaje" },
  // Aquí es donde añadirás los nuevos en el futuro
};

export const LUGARES_CONFIG = {
  Casa: { label: "🏠 Casa" },
  Farmacia: { label: "💊 Farmacia" },
  CAP: { label: "🏥 CAP" },
  ICO: { label: "🏢 ICO" },
};

// Función útil para Capitalizar textos (Primera mayúscula)
export const capitalizar = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
