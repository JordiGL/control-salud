import { useState } from 'react';
import { BotonIA } from './Botones';
import { escanearMedicionConIA } from '../services/iaService';

const ScannerIA = ({ onDatosExtraidos }) => {
  const [cargando, setCargando] = useState(false);

  const manejarArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);
    try {
      const datos = await escanearMedicionConIA(archivo);
      onDatosExtraidos(datos);
    } catch (error) {
      alert("Error de IA: " + error.message);
    } finally {
      setCargando(false);
      e.target.value = ""; // Reset del input
    }
  };

  return <BotonIA onChange={manejarArchivo} cargando={cargando} />;
};

export default ScannerIA;