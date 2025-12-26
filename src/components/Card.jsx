import { useState } from 'react';
import { styles } from '../styles/styles';
import { BotonEliminar, BotonEditar } from './Botones';
import ModalConfirmacion from './ModalConfirmacion';
import ModalEditar from './ModalEditar';
import { updateDoc } from 'firebase/firestore';

const coloresEtiquetas = {
  reposo: { bg: '#dcfce7', text: '#166534', label: 'En Reposo' },
  ejercicio: { bg: '#fee2e2', text: '#991b1b', label: 'Post-Ejercicio' },
  ayunas: { bg: '#fef9c3', text: '#854d0e', label: 'En Ayunas' },
  medicacion: { bg: '#e0e7ff', text: '#3730a3', label: 'Tras Medicación' },
  estres: { bg: '#ffedd5', text: '#9a3412', label: 'Momento de Estrés' },
  quimio: { bg: '#f3e8ff', text: '#6b21a8', label: 'Post-Quimioterapia' }
};

const Card = ({ reg, esAdmin, deleteDoc, db, doc }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditar = async (nuevosDatos) => {
    try {
      const docRef = doc(db, "mediciones", reg.id);
      await updateDoc(docRef, nuevosDatos);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div style={styles.historyCard}>
      <div style={styles.historyHeader}>
        {/* FECHA: Eliminamos el badge solo para impresión mediante clases CSS */}
        <span className="fecha-badge-print" style={styles.dateBadge}>
          {reg.fecha} · {reg.hora}
        </span>
        
        <div className="no-print">
          {esAdmin && (
            <div style={{ display: 'flex', gap: '5px' }}>
              <BotonEditar onClick={() => setShowEditModal(true)} />
              <BotonEliminar onClick={() => setShowDeleteModal(true)} />
            </div>
          )}
        </div>
      </div>
      
      <div style={styles.historyGrid}>
        {reg.tension && (
          <div style={styles.dataBlock}>
            <span style={styles.dataLabel}>Tensión</span>
            <strong style={styles.dataValue}>{reg.tension}</strong>
          </div>
        )}
        {reg.pulso && (
          <div style={styles.dataBlock}>
            <span style={styles.dataLabel}>Pulso</span>
            <strong style={styles.dataValue}>{reg.pulso} <small style={styles.unit}>BPM</small></strong>
          </div>
        )}
        {reg.oxigeno && (
          <div style={styles.dataBlock}>
            <span style={styles.dataLabel}>Oxígeno</span>
            <strong style={styles.dataValue}>{reg.oxigeno}<small style={styles.unit}>%</small></strong>
          </div>
        )}
        {reg.ca125 && (
          <div style={{...styles.dataBlock, borderLeft: '2px solid #e0e7ff'}}>
            <span style={styles.dataLabel}>CA-125</span>
            <strong style={{...styles.dataValue, color:'#004a99'}}>{reg.ca125} <small style={styles.unit}>U/mL</small></strong>
          </div>
        )}
      </div>

      {reg.etiqueta && coloresEtiquetas[reg.etiqueta] && (
        <div style={{ marginBottom: '8px', marginTop: '10px' }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '0.65rem',
            fontWeight: '700',
            backgroundColor: coloresEtiquetas[reg.etiqueta].bg,
            color: coloresEtiquetas[reg.etiqueta].text,
            textTransform: 'uppercase',
            display: 'inline-block',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}>
            {coloresEtiquetas[reg.etiqueta].label}
          </span>
        </div>
      )}
      
      {reg.notas && (
        <div style={{...styles.notaBox, color: '#333', borderLeft: '3px solid #004a99'}}>
          {reg.notas}
        </div>
      )}

      <ModalConfirmacion 
        isOpen={showDeleteModal} 
        onConfirm={() => deleteDoc(doc(db, "mediciones", reg.id))} 
        onCancel={() => setShowDeleteModal(false)} 
        mensaje={`¿Borrar el registro del ${reg.fecha}?`} 
      />
      
      <ModalEditar 
        isOpen={showEditModal} 
        reg={reg} 
        onConfirm={handleEditar} 
        onCancel={() => setShowEditModal(false)} 
      />
    </div>
  );
};

export default Card;