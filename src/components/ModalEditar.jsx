import { useState } from 'react';
import { styles } from '../styles/styles';
import { BotonAccion, BotonSecundario } from './Botones'; // Importamos el nuevo botón
import FormularioBase from './FormularioBase';

const ModalEditar = ({ isOpen, reg, onConfirm, onCancel }) => {
  const [editData, setEditData] = useState({ ...reg });

  if (!isOpen) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{...styles.modalContent, maxWidth: '500px'}}>
        <h3 style={styles.modalTitle}>Editar Registro</h3>
        
        <FormularioBase datos={editData} onChange={manejarCambio} />
        
        <div style={{...styles.modalButtons, marginTop: '20px', justifyContent: 'center'}}>
          <BotonSecundario onClick={onCancel}>
            Cancelar
          </BotonSecundario>
          <BotonAccion onClick={() => onConfirm(editData)}>
            Guardar Cambios
          </BotonAccion>
        </div>
      </div>
    </div>
  );
};

export default ModalEditar;