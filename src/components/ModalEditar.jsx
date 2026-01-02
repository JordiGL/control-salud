import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion, BotonSecundario } from './Botones';
import FormularioBase from './FormularioBase';

const ModalEditar = ({ isOpen, reg, onConfirm, onCancel }) => {
  const [editData, setEditData] = useState({ ...reg });

  useEffect(() => {
    if (reg) setEditData({ ...reg });
  }, [reg]);

  if (!isOpen) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNCIÓN HELPER PARA ARREGLAR LA FECHA ---
  // Convierte DD/MM/YYYY (o D/M/YYYY) a YYYY-MM-DD con ceros obligatorios
  const obtenerFechaInput = (fecha) => {
    if (!fecha) return '';
    if (fecha.includes('-')) return fecha; // Ya está en formato correcto

    if (fecha.includes('/')) {
      const [dia, mes, anyo] = fecha.split('/');
      // padStart(2, '0') asegura que '1' se convierta en '01'
      return `${anyo}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return '';
  };

  const handleGuardar = () => {
    let year, month, day;
    const fechaActual = editData.fecha;

    // Lógica robusta para detectar el formato de fecha
    if (fechaActual.includes('-')) {
      // Viene del input date (YYYY-MM-DD)
      [year, month, day] = fechaActual.split('-');
    } else if (fechaActual.includes('/')) {
      // Viene del registro ya formateado (DD/MM/YYYY)
      [day, month, year] = fechaActual.split('/');
    } else {
      onConfirm(editData);
      return;
    }

    // Al guardar, volvemos a formatear a DD/MM/YYYY para la visualización
    const fechaFormateada = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    const [hours, minutes] = editData.hora.split(':');
    
    const nuevoTimestamp = new Date(year, month - 1, day, hours, minutes).getTime();

    onConfirm({
      ...editData,
      fecha: fechaFormateada,
      timestamp: nuevoTimestamp
    });
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }}>
        <h3 style={{...styles.modalTitle, marginBottom: '20px'}}>Editar Registro</h3>
        
        <div style={{ ...styles.formFlex, textAlign: 'left' }}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Fecha</label>
            <input 
              name="fecha" 
              type="date" 
              style={styles.input} 
              // APLICAMOS LA CORRECCIÓN AQUÍ
              value={obtenerFechaInput(editData.fecha)} 
              onChange={manejarCambio} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Hora</label>
            <input 
              name="hora" 
              type="time" 
              style={styles.input} 
              value={editData.hora} 
              onChange={manejarCambio} 
            />
          </div>

          {/* Reutilización limpia de FormularioBase */}
          <FormularioBase datos={editData} onChange={manejarCambio} sinContenedor={true} />
        </div>
        
        <div style={{ ...styles.modalButtons, marginTop: '25px', justifyContent: 'center' }}>
          <BotonSecundario onClick={onCancel}>Cancelar</BotonSecundario>
          <BotonAccion onClick={handleGuardar}>Guardar Cambios</BotonAccion>
        </div>
      </div>
    </div>
  );
};

export default ModalEditar;