import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion, BotonSecundario } from './Botones';

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
    // 1. Extraer partes de la fecha del input (YYYY-MM-DD)
    const [year, month, day] = editData.fecha.split('-');
    
    // 2. Crear el formato legible para el Card y la Gráfica (DD/MM/YYYY)
    const fechaFormateada = `${day}/${month}/${year}`;
    
    // 3. Crear el timestamp real para que la gráfica ordene los puntos bien
    const [hours, minutes] = editData.hora.split(':');
    const nuevoTimestamp = new Date(year, month - 1, day, hours, minutes).getTime();

    onConfirm({
      ...editData,
      fecha: fechaFormateada, // Guardamos como texto legible
      timestamp: nuevoTimestamp // Guardamos como número para la gráfica
    });
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }}>
        <h3 style={{...styles.modalTitle, marginBottom: '20px'}}>Editar Registro</h3>
        
        <div style={{ ...styles.formFlex, textAlign: 'left' }}>
          
          {/* FECHA: Ahora comparte fila con HORA */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Fecha</label>
            <input 
              name="fecha" 
              type="date" 
              style={styles.input} 
              // Convertimos DD/MM/YYYY de vuelta a YYYY-MM-DD para el input
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

          {/* Resto de campos manuales para asegurar alineación perfecta */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tensión</label>
            <input name="tension" type="text" style={styles.input} value={editData.tension || ''} onChange={manejarCambio} placeholder="120/80" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Pulso</label>
            <input name="pulso" type="number" style={styles.input} value={editData.pulso || ''} onChange={manejarCambio} placeholder="BPM" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>SpO2</label>
            <input name="oxigeno" type="number" style={styles.input} value={editData.oxigeno || ''} onChange={manejarCambio} placeholder="%" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>CA-125</label>
            <input name="ca125" type="number" style={styles.input} value={editData.ca125 || ''} onChange={manejarCambio} placeholder="U/mL" />
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
            <label style={styles.label}>Contexto</label>
            <select name="etiqueta" style={styles.selector} value={editData.etiqueta || ''} onChange={manejarCambio}>
              <option value="">Sin contexto definido</option>
              <option value="ejercicio">Post-ejercicio</option>
              <option value="quimio">Post-quimioterapia</option>
              <option value="estres">Momento de estrés</option>
              <option value="drenaje">Post-drenaje</option>
            </select>
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
            <label style={styles.label}>Notas</label>
            <textarea name="notas" style={{ ...styles.input, minHeight: '80px' }} value={editData.notas || ''} onChange={manejarCambio} placeholder="Opcional..." />
          </div>
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