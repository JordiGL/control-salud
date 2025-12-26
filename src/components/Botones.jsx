import { styles } from '../styles/styles';

// Botón principal (Acceso Admin / Guardar)
export const BotonAccion = ({ onClick, children, tipo = "button", style = {} }) => (
  <button 
    type={tipo}
    onClick={onClick} 
    // Combinamos el estilo base con el que venga por props
    style={{ ...styles.loginBtn, ...style }}
  >
    {children}
  </button>
);

export const BotonEliminar = ({ onClick }) => (
  <button 
    onClick={onClick} 
    style={styles.deleteBtn}
  >
    Eliminar
  </button>
);

export const BotonEditar = ({ onClick }) => (
  <button 
    onClick={onClick} 
    style={{...styles.deleteBtn, color: '#004a99', marginRight: '10px'}}
  >
    Editar
  </button>
);

export const BotonSecundario = ({ onClick, children }) => (
  <button 
    type="button" 
    onClick={onClick} 
    style={styles.btnCancelar}
    onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
    onMouseOut={(e) => e.target.style.background = '#f8fafc'}
  >
    {children}
  </button>
);