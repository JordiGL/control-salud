import { exportToCSV, exportToXML, exportToPrint } from '../services/exportService';
import { styles } from '../styles/styles';

const MenuExportar = ({ datosFiltrados }) => {
  if (!datosFiltrados || datosFiltrados.length === 0) return null;

  return (
    <div className="no-print" style={{
      marginTop: '25px',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    }}>
      <p style={{ 
        fontSize: '0.75rem', 
        color: '#64748b', 
        marginBottom: '15px', 
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Opciones de Exportación ({datosFiltrados.length} registros)
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center', 
        flexWrap: 'wrap' 
      }}>
        {/* <button 
          onClick={exportToPrint} 
          style={{...styles.btnFiltro, backgroundColor: '#fff', borderColor: '#004a99', color: '#004a99'}}
        >
          🖨️ Imprimir / PDF
        </button> */}
        
        <button 
          onClick={() => exportToCSV(datosFiltrados)} 
          style={{...styles.btnFiltro, backgroundColor: '#fff', borderColor: '#64748b', color: '#64748b'}}
        >
          📊 CSV
        </button>
        
        <button 
          onClick={() => exportToXML(datosFiltrados)} 
          style={{...styles.btnFiltro, backgroundColor: '#fff', borderColor: '#64748b', color: '#64748b'}}
        >
          ⚙️ XML
        </button>
      </div>
    </div>
  );
};

export default MenuExportar;