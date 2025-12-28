import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange, sinContenedor = false }) => {
  const contenido = (
    <>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Tensión</label>
        <input name="tension" type="text" style={styles.input} value={datos.tension || ''} onChange={onChange} placeholder="120/80" />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Pulso</label>
        <input name="pulso" type="number" style={styles.input} value={datos.pulso || ''} onChange={onChange} placeholder="BPM" />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>SpO2</label>
        <input name="oxigeno" type="number" style={styles.input} value={datos.oxigeno || ''} onChange={onChange} placeholder="%" />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>CA-125</label>
        <input name="ca125" type="number" style={styles.input} value={datos.ca125 || ''} onChange={onChange} placeholder="U/mL" />
      </div>

      <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
        <label style={styles.label}>Contexto</label>
        <select name="etiqueta" style={styles.selector} value={datos.etiqueta || ''} onChange={onChange}>
          <option value="">Sin contexto definido</option>
          <option value="ejercicio">Post-ejercicio</option>
          <option value="quimio">Post-quimioterapia</option>
          <option value="estres">Momento de estrés</option>
          <option value="drenaje">Post-drenaje</option>
        </select>
      </div>

      <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
        <label style={styles.label}>Notas</label>
        <textarea name="notas" style={{ ...styles.input, minHeight: '80px' }} value={datos.notas || ''} onChange={onChange} placeholder="Opcional..." />
      </div>
    </>
  );

  // Si pedimos sinContenedor (para el Modal), devolvemos solo los inputs
  if (sinContenedor) return contenido;

  // Si no (para el Formulario principal), devolvemos el grid normal
  return (
    <div style={{ ...styles.formFlex, textAlign: 'left' }}>
      {contenido}
    </div>
  );
};

export default FormularioBase;