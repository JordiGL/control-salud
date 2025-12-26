import { styles } from '../styles/styles';

const FormularioBase = ({ datos, onChange }) => {
  return (
    <div style={{ ...styles.formFlex, textAlign: 'left' }}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Tensión</label>
        <input 
          name="tension" 
          type="text"
          style={styles.input} 
          value={datos.tension || ''} 
          onChange={onChange} 
          placeholder="120/80" 
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Pulso</label>
        <input 
          name="pulso" 
          type="number" 
          style={styles.input} 
          value={datos.pulso || ''} 
          onChange={onChange} 
          placeholder="BPM" 
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>SpO2</label>
        <input 
          name="oxigeno" 
          type="number" 
          style={styles.input} 
          value={datos.oxigeno || ''} 
          onChange={onChange} 
          placeholder="%" 
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>CA-125</label>
        <input 
          name="ca125" 
          type="number" 
          style={styles.input} 
          value={datos.ca125 || ''} 
          onChange={onChange} 
          placeholder="U/mL" 
        />
      </div>

      <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
        <label style={styles.label}>Contexto</label>
        <select 
            name="etiqueta" 
            style={styles.selector} 
            value={datos.etiqueta || ''} 
            onChange={onChange}
            >
            <option value="">Sin etiqueta</option>
            <option value="reposo">En reposo</option>
            <option value="ejercicio">Post-ejercicio</option>
            <option value="ayunas">En ayunas</option>
            <option value="medicacion">Tras medicación</option>
            <option value="quimio">Post-quimioterapia</option>
            <option value="estres">Momento de estrés</option>
        </select>
      </div>

      <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
        <label style={styles.label}>Notas</label>
        <textarea 
          name="notas" 
          style={{ ...styles.input, minHeight: '80px' }} 
          value={datos.notas || ''} 
          onChange={onChange} 
          placeholder="Opcional..." 
        />
      </div>
    </div>
  );
};

export default FormularioBase;