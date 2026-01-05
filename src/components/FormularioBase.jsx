import { CONFIG_CAMPOS } from '../constants/campos';
import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange, sinContenedor = false }) => {
  
  const contenido = CONFIG_CAMPOS.map((campo) => {
    
    // CASO ESPECIAL 1: Si es 'lugarPeso', lo saltamos (se renderiza dentro de 'peso')
    if (campo.id === 'lugarPeso') return null;

    // CASO ESPECIAL 2: Si es 'peso', renderizamos el GRUPO COMPLETO
    if (campo.id === 'peso') {
      // Buscamos la config del lugar para pintarlo aquí dentro
      const campoLugar = CONFIG_CAMPOS.find(c => c.id === 'lugarPeso');
      
      return (
        <div key={campo.id} style={styles.pesoContainer}>
          {/* Input de PESO */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{campo.label}</label>
            <input 
              name={campo.id} 
              type={campo.type} 
              step={campo.step}
              value={datos[campo.id] || ''} 
              onChange={onChange} 
              placeholder={campo.placeholder}
              style={{...styles.input, backgroundColor: '#fff'}} // Fondo blanco para resaltar sobre el gris
            />
          </div>

          {/* Input de LUGAR (Renderizado aquí manualmente) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{campoLugar.label || '\u00A0'}</label>
            <select 
              name={campoLugar.id} 
              value={datos[campoLugar.id] || campoLugar.defaultValue} 
              onChange={onChange} 
              style={{...styles.selector, backgroundColor: '#fff'}} // Fondo blanco
            >
              {campoLugar.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    // --- RESTO DE CAMPOS (Lógica estándar) ---

    const estiloGrupo = campo.fullWidth 
      ? { ...styles.inputGroup, gridColumn: '1/-1' } 
      : styles.inputGroup;

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

    return (
      <div key={campo.id} style={estiloGrupo}>
        <label style={styles.label}>{campo.label}</label>
        <input 
          name={campo.id} 
          type={campo.type} 
          step={campo.step || null}
          value={datos[campo.id] || ''} 
          onChange={onChange} 
          placeholder={campo.placeholder}
          style={styles.input} 
        />
      </div>
    );
  });

  if (sinContenedor) return <>{contenido}</>;

  return (
    <div style={{ ...styles.formFlex, textAlign: 'left' }}>
      {contenido}
    </div>
  );
};

export default FormularioBase;