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

export const BotonIA = ({ onChange, cargando }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: cargando ? 'not-allowed' : 'pointer',
    color: cargando ? '#94a3b8' : '#0ea5e9', // Color azul suave
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '8px',
    borderRadius: '8px',
    border: '1px dashed #0ea5e9', // Borde punteado para indicar "subida"
    backgroundColor: '#f0f9ff',
    transition: 'all 0.2s',
    marginBottom: '15px'
  }}>
    {cargando ? '⌛ Analizando...' : '📷 Escanear dispositivo'}
    <input 
      type="file" 
      accept="image/*" 
      capture="environment" 
      onChange={onChange} 
      style={{ display: 'none' }}
      disabled={cargando}
    />
  </label>
);