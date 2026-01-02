import { CONFIG_CAMPOS } from "../constants/campos";

// Función auxiliar para evitar valores vacíos en los reportes
const limpiarDato = (dato) => dato || "-";

// EXPORTAR A CSV (Compatible con Excel y Google Sheets)
export const exportToCSV = (datos) => {
  const headers = [
    "Fecha",
    "Hora",
    ...CONFIG_CAMPOS.filter((c) => c.exportar).map((c) => c.label),
  ];

  const rows = datos.map((r) => {
    // 2. Generamos las filas dinámicamente
    const filaDinamica = CONFIG_CAMPOS.filter((c) => c.exportar).map(
      (campo) => {
        let valor = r[campo.id];
        // Si es notas, aplicamos el formato especial de comillas
        if (campo.id === "notas") {
          return `"${limpiarDato(valor).replace(/"/g, '""')}"`;
        }
        return limpiarDato(valor);
      }
    );

    return [r.fecha, r.hora, ...filaDinamica];
  });

  // \uFEFF es el BOM para que Excel detecte correctamente acentos y símbolos
  const csvContent =
    "\uFEFF" + [headers, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `historial_medico_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// EXPORTAR A XML
export const exportToXML = (datos) => {
  let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<historial>\n';
  datos.forEach((r) => {
    xmlString += `  <registro>
    <fecha>${r.fecha}</fecha>
    <hora>${r.hora}</hora>
    <tension>${limpiarDato(r.tension)}</tension>
    <pulso>${limpiarDato(r.pulso)}</pulso>
    <oxigeno>${limpiarDato(r.oxigeno)}</oxigeno>
    <ca125>${limpiarDato(r.ca125)}</ca125>
    <contexto>${limpiarDato(r.etiqueta)}</contexto>
    <notas>${limpiarDato(r.notas)}</notas>
  </registro>\n`;
  });
  xmlString += "</historial>";

  const blob = new Blob([xmlString], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "historial_medico.xml";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// FUNCIÓN DE IMPRESIÓN (Para generar PDF nativo)
export const exportToPrint = () => {
  window.print();
};
