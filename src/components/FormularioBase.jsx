import { CONFIG_CAMPOS } from '../constants/campos';
import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange, sinContenedor = false }) => {
  
  // Generamos el HTML recorriendo la configuración
  const contenido = CONFIG_CAMPOS.map((campo) => {
    
    // 1. Estilos dinámicos: Si es 'fullWidth', ocupa toda la fila
    const estiloGrupo = campo.fullWidth 
      ? { ...styles.inputGroup, gridColumn: '1/-1' } 
      : styles.inputGroup;

    // 2. Renderizado de SELECT (Para Contexto y Lugar)
    if (campo.type === 'select') {
      return (
        <div key={campo.id} style={estiloGrupo}>
          <label style={styles.label}>{campo.label}</label>
          <select 
            name={campo.id} 
            value={datos[campo.id] || campo.defaultValue} 
            onChange={onChange} 
            style={styles.selector}
          >
            {campo.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // 3. Renderizado de TEXTAREA (Notas)
    if (campo.type === 'textarea') {
      return (
        <div key={campo.id} style={estiloGrupo}>
          <label style={styles.label}>{campo.label}</label>
          <textarea 
            name={campo.id} 
            value={datos[campo.id] || ''} 
            onChange={onChange} 
            placeholder={campo.placeholder}
            style={{ ...styles.input, minHeight: '80px' }} 
          />
        </div>
      );
    }

    // 4. Renderizado de INPUT NORMAL (Texto/Número)
    return (
      <div key={campo.id} style={estiloGrupo}>
        <label style={styles.label}>{campo.label}</label>
        <input 
          name={campo.id} 
          type={campo.type} 
          step={campo.step || null} // Solo aplica si existe en config (ej: peso)
          value={datos[campo.id] || ''} 
          onChange={onChange} 
          placeholder={campo.placeholder}
          style={styles.input} 
        />
      </div>
    );
  });

  // Renderizado final
  if (sinContenedor) return <>{contenido}</>;

  return (
    <div style={{ ...styles.formFlex, textAlign: 'left' }}>
      {contenido}
    </div>
  );
};

export default FormularioBase;