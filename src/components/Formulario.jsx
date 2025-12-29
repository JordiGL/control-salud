import { useEffect, useState } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion } from './Botones';
import FormularioBase from './FormularioBase';
import ScannerIA from './ScannerIA'; // Importamos el controlador de la IA

const Formulario = ({ formData, setFormData, guardarRegistro }) => {
  const [isWide, setIsWide] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const handleChange = (event) => {
      setIsWide(event.matches);
      if (event.matches) {
        setIsOpen(true);
      }
    };

    handleChange(mediaQuery);
    const listener = (event) => handleChange(event);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const recibirDatosIA = (datos) => {
    setFormData(prev => ({
      ...prev,
      tension: datos.tension || prev.tension,
      pulso: datos.pulso || "", // Cambiado null por cadena vacía para el input
      fecha: prev.fecha || new Date().toISOString().split('T')[0]
    }));
  };

  const validarYGuardar = (e) => {
    e.preventDefault();
    
    const tieneValores = Object.values(formData).some(
      valor => valor !== undefined && valor !== null && valor.toString().trim() !== ""
    );
    
    if (tieneValores) {
      guardarRegistro(e);
    } else {
      alert("Por favor, introduce al menos una medición para guardar el registro.");
    }
  };

  return (
    <section style={styles.columnaForm}>
      <div style={styles.card}>
        <details
          open={isWide || isOpen}
          onToggle={(e) => {
            if (isWide) {
              e.currentTarget.open = true;
              return;
            }
            setIsOpen(e.currentTarget.open);
          }}
        >
          <summary style={styles.detailsSummary}>Nuevo Registro</summary>
          <div style={styles.detailsContent}>
            <form onSubmit={validarYGuardar}>
              
              {/* --- BOTÓN DE IA INTEGRADO --- */}
              <ScannerIA onDatosExtraidos={recibirDatosIA} />

              {/* Formulario con los campos de texto normales */}
              <FormularioBase datos={formData} onChange={manejarCambio} />

              <div style={{ marginTop: '20px' }}>
                <BotonAccion tipo="submit">
                  Guardar Registro
                </BotonAccion>
              </div>
            </form>
          </div>
        </details>
      </div>
    </section>
  );
};

export default Formulario;