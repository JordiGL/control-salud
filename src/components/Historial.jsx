import { styles } from '../styles/styles';
import Grafica from './Grafica';
import Card from './Card'; // Importamos el nuevo componente

const Historial = ({ registros, esAdmin, deleteDoc, db, doc, metricaSeleccionada, setMetricaSeleccionada }) => {
  return (
    <>
      <div style={styles.statsNav}>
        <button 
          onClick={() => setMetricaSeleccionada(null)} 
          style={{...styles.statNavLink, color: !metricaSeleccionada ? '#004a99' : '#94a3b8', borderBottom: !metricaSeleccionada ? '2px solid #004a99' : 'none'}}
        >
          Historial
        </button>
        {['tension', 'pulso', 'oxigeno', 'ca125'].map(m => (
          <button 
            key={m}
            onClick={() => setMetricaSeleccionada(m)} 
            style={{...styles.statNavLink, color: metricaSeleccionada === m ? '#004a99' : '#94a3b8', borderBottom: metricaSeleccionada === m ? '2px solid #004a99' : 'none'}}
          >
            {m.charAt(0).toUpperCase() + m.slice(1).replace('oxigeno', 'Oxígeno')}
          </button>
        ))}
      </div>

      {metricaSeleccionada ? (
        <Grafica registros={registros} metricaSeleccionada={metricaSeleccionada} />
      ) : (
        <div style={styles.historyList}>
          {[...registros].reverse().map(reg => (
            <Card 
              key={reg.id} 
              reg={reg} 
              esAdmin={esAdmin} 
              deleteDoc={deleteDoc} 
              db={db} 
              doc={doc} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Historial;