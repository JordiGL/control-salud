import { styles } from '../styles/styles';
import { BotonAccion, BotonSecundario } from './Botones'; // Usamos tus componentes

const ModalConfirmacionIA = ({ datos, onConfirm, onEdit }) => {
  if (!datos) return null;

  // Lógica de colores coherente con Card.jsx
  const getSisColor = (sis) => (Number(sis) >= 140 ? '#ef4444' : Number(sis) >= 130 ? '#f59e0b' : '#1e293b');
  const getOxigenoColor = (val) => (Number(val) < 95 ? '#ef4444' : '#1e293b');

  const [sis, dia] = datos.tension ? datos.tension.split('/') : [null, null];

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={{ 
          marginTop: 0, 
          color: '#1e293b', 
          textAlign: 'center', 
          fontSize: '1.25rem',
          fontWeight: '700'
        }}>¿Es correcto?</h3>
        
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
          Valores detectados por la IA:
        </p>

        {/* Grid de valores con estilo limpio */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: datos.tension && datos.oxigeno ? '1fr 1fr' : '1fr', 
          gap: '12px', 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '12px',
          border: '1px solid #f1f5f9'
        }}>
          {datos.tension && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>TENSIÓN</span>
              <strong style={{ fontSize: '1.3rem', color: getSisColor(sis), letterSpacing: '-0.5px' }}>{datos.tension}</strong>
            </div>
          )}
          {datos.oxigeno && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>SpO2</span>
              <strong style={{ fontSize: '1.3rem', color: getOxigenoColor(datos.oxigeno) }}>{datos.oxigeno}%</strong>
            </div>
          )}
          {datos.pulso && (
            <div style={{ textAlign: 'center', gridColumn: datos.tension && datos.oxigeno ? 'span 2' : 'span 1', marginTop: '8px', borderTop: '1px solid #edf2f7', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>PULSO</span>
              <strong style={{ fontSize: '1.1rem', color: '#334155' }}>{datos.pulso} <small style={{fontSize: '0.7rem', fontWeight: 'normal'}}>BPM</small></strong>
            </div>
          )}
        </div>

        {/* Acciones con tus botones oficiales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <BotonAccion onClick={onConfirm} style={{ width: '100%', margin: 0 }}>
            Sí, guardar ahora
          </BotonAccion>
          
          <BotonSecundario onClick={onEdit}>
            No, corregir manualmente
          </BotonSecundario>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionIA;