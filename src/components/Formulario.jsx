import { useEffect, useState } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion } from './Botones';
import FormularioBase from './FormularioBase';
import ScannerIA from './ScannerIA';
import ModalConfirmacionIA from './ModalConfirmacionIA'; // Importamos el nuevo componente

const Formulario = ({ formData, setFormData, guardarRegistro }) => {
  const [isWide, setIsWide] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Estado para controlar los datos temporales de la IA
  const [datosTemporalesIA, setDatosTemporalesIA] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const handleChange = (event) => {
      setIsWide(event.matches);
      if (event.matches) setIsOpen(true);
    };
    handleChange(mediaQuery);
    const listener = (event) => handleChange(event);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Recibe datos de ScannerIA pero NO los guarda todavía en formData
  const recibirDatosIA = (datos) => {
    setDatosTemporalesIA(datos); // Abrirá el modal de confirmación
  };

  const confirmarYGuardarIA = () => {
    const datosFinales = {
      ...formData,
      tension: datosTemporalesIA.tension || formData.tension,
      pulso: datosTemporalesIA.pulso || formData.pulso,
      oxigeno: datosTemporalesIA.oxigeno || formData.oxigeno,
      peso: datosTemporalesIA.peso || formData.peso,
    };
    
    guardarRegistro(null, datosFinales);
    setDatosTemporalesIA(null);
  };

  const corregirManualmente = () => {
    setFormData(prev => ({
      ...prev,
      tension: datosTemporalesIA.tension || prev.tension,
      pulso: datosTemporalesIA.pulso || prev.pulso,
      oxigeno: datosTemporalesIA.oxigeno || prev.oxigeno,
      peso: datosTemporalesIA.peso || prev.peso
    }));
    setDatosTemporalesIA(null);
  };

  const validarYGuardar = (e) => {
    e.preventDefault();
    const tieneValores = Object.values(formData).some(
      valor => valor !== undefined && valor !== null && valor.toString().trim() !== ""
    );
    if (tieneValores) guardarRegistro(e);
    else alert("Por favor, introduce al menos una medición.");
  };

  return (
    <section style={styles.columnaForm}>
      {/* --- MODAL DE CONFIRMACIÓN IA --- */}
      {datosTemporalesIA && (
        <ModalConfirmacionIA 
          datos={datosTemporalesIA} 
          onConfirm={confirmarYGuardarIA} 
          onEdit={corregirManualmente}
          onCancel={() => setDatosTemporalesIA(null)}
        />
      )}

      <div style={styles.card}>
        <details
          open={isWide || isOpen}
          onToggle={(e) => {
            if (isWide) { e.currentTarget.open = true; return; }
            setIsOpen(e.currentTarget.open);
          }}
        >
          <summary style={styles.detailsSummary}>Nuevo Registro</summary>
          <div style={styles.detailsContent}>
            <form onSubmit={validarYGuardar}>
              <ScannerIA onDatosExtraidos={recibirDatosIA} />
              <FormularioBase datos={formData} onChange={manejarCambio} />
              <div style={{ marginTop: '20px' }}>
                <BotonAccion tipo="submit">Guardar Registro</BotonAccion>
              </div>
            </form>
          </div>
        </details>
      </div>
    </section>
  );
};

export default Formulario;