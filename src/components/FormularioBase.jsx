import { CONFIG_CAMPOS } from '../constants/campos';
import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange, sinContenedor = false }) => {
  
  const contenido = CONFIG_CAMPOS.map((campo) => {
    
    // 1. Saltar lugarPeso (va dentro de Peso)
    if (campo.id === 'lugarPeso') return null;

    // 2. GRUPO PESO (Manejo especial responsive)
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
    // Calculamos la clase CSS basada en la configuración
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
    <>
      <style>{`
        /* --- ESTILOS RESPONSIVOS (CSS) --- */
        
        /* 1. Contenedor Principal */
        .form-responsive-grid {
          display: grid;
          gap: 15px;
          width: 100%;
          /* MÓVIL POR DEFECTO: 1 Columna */
          grid-template-columns: 1fr;
          
          /* LIMITADOR DE ANCHO PARA PC (Para que los inputs sean cortos) */
          max-width: 900px; 
        }

        /* 2. Inputs Estándar */
        .std-input {
          width: 100%;
          box-sizing: border-box; /* Crucial para no salirse */
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background-color: #fff;
          font-family: inherit;
        }

        /* 3. Grupo Peso (Contenedor Gris) */
        .peso-group {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
          display: flex;
          gap: 15px;
          /* MÓVIL: Vertical */
          flex-direction: column; 
        }
        
        .input-wrapper {
          width: 100%;
        }

        /* --- MEDIA QUERY: PANTALLAS GRANDES (> 650px) --- */
        @media (min-width: 650px) {
          .form-responsive-grid {
            /* Ahora sí activamos las 3 columnas */
            grid-template-columns: 1fr 1fr 1fr;
          }

          /* Clases especiales */
          .col-full { grid-column: 1 / -1; }     /* Ocupa todo */
          .col-span-2 { grid-column: span 2; }   /* Ocupa 2 huecos (Contexto) */

          /* Peso se pone horizontal en PC */
          .peso-group {
            display: grid;
            grid-template-columns: 120px 1fr; /* Kilos pequeño, Lugar grande */
            align-items: start;
          }
        }
      `}</style>

      <div className="form-responsive-grid" style={{ textAlign: 'left' }}>
        {contenido}
      </div>
    </>
  );
};

export default FormularioBase;