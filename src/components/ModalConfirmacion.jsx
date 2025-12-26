import { styles } from '../styles/styles';
import { BotonAccion, BotonSecundario } from './Botones';

const ModalConfirmacion = ({ isOpen, onConfirm, onCancel, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Confirmar eliminación</h3>
        <p style={styles.modalText}>{mensaje}</p>
        <div style={styles.modalButtons}>
          <BotonSecundario onClick={onCancel}>Cancelar</BotonSecundario>
          <BotonAccion 
            onClick={onConfirm}
            style={{ 
                color: '#ef4444',          // Texto rojo
                borderColor: '#ef4444',    // Borde rojo
                backgroundColor: '#fef2f2' // Opcional: un fondo rojizo muy suave
            }}
            >
            Eliminar
          </BotonAccion>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;