// Función auxiliar para evitar valores vacíos en los reportes
const limpiarDato = (dato) => dato || "-";

// EXPORTAR A CSV (Compatible con Excel y Google Sheets)
export const exportToCSV = (datos) => {
  const headers = [
    "Fecha",
    "Hora",
    "Tension",
    "Pulso",
    "Oxigeno",
    "CA125",
    "Contexto",
    "Notas",
  ];

  const rows = datos.map((r) => [
    r.fecha,
    r.hora,
    limpiarDato(r.tension),
    limpiarDato(r.pulso),
    limpiarDato(r.oxigeno),
    limpiarDato(r.ca125),
    limpiarDato(r.etiqueta),
    `"${limpiarDato(r.notas).replace(/"/g, '""')}"`, // Protege comas dentro de las notas
  ]);

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
