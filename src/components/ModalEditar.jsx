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
      // Fallback por seguridad
      onConfirm(editData);
      return;
    }

    const fechaFormateada = `${day}/${month}/${year}`;
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
              // Convertimos siempre a YYYY-MM-DD para que el input lo entienda
              value={editData.fecha.includes('/') 
                ? editData.fecha.split('/').reverse().join('-') 
                : editData.fecha} 
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