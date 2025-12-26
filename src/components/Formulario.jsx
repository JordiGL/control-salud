import { useEffect, useState } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion } from './Botones';
import FormularioBase from './FormularioBase';

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

  // Validación: comprueba que al menos un campo tenga texto
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
              
              {/* Usamos el componente base que contiene todos los inputs y placeholders */}
              <FormularioBase datos={formData} onChange={manejarCambio} />

              <div style={{ marginTop: '20px' }}>
                <BotonAccion tipo="submit">
                  Guardar
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