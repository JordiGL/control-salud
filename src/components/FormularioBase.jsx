import { CONFIG_CAMPOS } from '../constants/campos';
import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange, sinContenedor = false }) => {
  
  const contenido = CONFIG_CAMPOS.map((campo) => {
    
    // 1. Saltar lugarPeso
    if (campo.id === 'lugarPeso') return null;

    // 2. GRUPO PESO
    if (campo.id === 'peso') {
      const campoLugar = CONFIG_CAMPOS.find(c => c.id === 'lugarPeso');
      return (
        <div key={campo.id} className="grid-item col-full peso-group">
          <div className="input-wrapper">
            <label style={styles.label}>{campo.label}</label>
            <input 
              name={campo.id} 
              type={campo.type} 
              step={campo.step}
              value={datos[campo.id] || ''} 
              onChange={onChange} 
              placeholder={campo.placeholder}
              className="std-input"
            />
          </div>
          <div className="input-wrapper">
            <label style={styles.label}>{campoLugar.label || '\u00A0'}</label>
            <select 
              name={campoLugar.id} 
              value={datos[campoLugar.id] || campoLugar.defaultValue} 
              onChange={onChange} 
              className="std-input"
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

    // 3. RESTO DE CAMPOS
    let claseGrid = 'grid-item';
    if (campo.fullWidth) claseGrid += ' col-full';
    if (campo.gridColumn === 'span 2') claseGrid += ' col-span-2';

    if (campo.type === 'select') {
      return (
        <div key={campo.id} className={claseGrid}>
          <label style={styles.label}>{campo.label}</label>
          <select 
            name={campo.id} 
            value={datos[campo.id] || campo.defaultValue} 
            onChange={onChange} 
            className="std-input"
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
        <div key={campo.id} className={claseGrid}>
          <label style={styles.label}>{campo.label}</label>
          <textarea 
            name={campo.id} 
            value={datos[campo.id] || ''} 
            onChange={onChange} 
            placeholder={campo.placeholder}
            className="std-input"
            style={{ minHeight: '80px' }} 
          />
        </div>
      );
    }

    return (
      <div key={campo.id} className={claseGrid}>
        <label style={styles.label}>{campo.label}</label>
        <input 
          name={campo.id} 
          type={campo.type} 
          step={campo.step || null}
          value={datos[campo.id] || ''} 
          onChange={onChange} 
          placeholder={campo.placeholder}
          className="std-input"
        />
      </div>
    );
  });

  if (sinContenedor) return <>{contenido}</>;

  return (
    <div className="form-responsive-grid" style={{ textAlign: 'left' }}>
      {contenido}
    </div>
  );
};

export default FormularioBase;