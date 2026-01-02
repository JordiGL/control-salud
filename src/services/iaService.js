import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const escanearMedicionConIA = async (archivo) => {
  // Ahora que tienes facturación, gemini-2.0-flash ya no tendrá límite 0
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const leerComoBase64 = (file) =>
    new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.readAsDataURL(file);
    });

  try {
    const imagenData = await leerComoBase64(archivo);

    // Prompt optimizado para tu dispositivo Hylogy
    const prompt = `Actúa como OCR médico. Extrae valores de la imagen.
    Responde solo JSON: {"tension": "SYS/DIA", "pulso": int, "oxigeno": int, "peso": float}.
    Si falta un dato usa null. No escribas nada más.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imagenData, mimeType: archivo.type } },
    ]);

    const texto = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return JSON.parse(texto);
  } catch (error) {
    console.error("Error técnico:", error);
    // Ahora el error no debería ser 429 (Cuota), sino algo de la imagen si falla
    throw new Error("No se pudo procesar la imagen: " + error.message);
  }
};
