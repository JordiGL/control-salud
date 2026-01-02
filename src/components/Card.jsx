import { useState } from 'react';
import { styles } from '../styles/styles';
import { BotonEliminar, BotonEditar } from './Botones';
import ModalConfirmacion from './ModalConfirmacion';
import ModalEditar from './ModalEditar';
import { updateDoc } from 'firebase/firestore';
import { ETIQUETAS_CONFIG } from '../constants/metricas';

// Iconos para mayor claridad visual
const IconoTension = () => <span style={{ marginRight: '8px' }}>📈</span>;
const IconoPulso = () => <span style={{ marginRight: '8px' }}>❤️</span>;
const IconoOxigeno = () => <span style={{ marginRight: '8px' }}>🌬️</span>;
const IconoPeso = () => <span style={{ marginRight: '8px' }}>⚖️</span>;

const Card = ({ reg, esAdmin, deleteDoc, db, doc }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // --- LÓGICA DE COLORES DE SALUD ---
  const getSisColor = (sis) => {
    const s = Number(sis);
    if (s >= 140) return '#ef4444';
    if (s >= 130) return '#f59e0b';
    return '#1e293b';
  };

  const getDiaColor = (dia) => {
    const d = Number(dia);
    if (d >= 90) return '#ef4444';
    if (d >= 85) return '#f59e0b';
    return '#1e293b';
  };

  const getPulsoColor = (val) => {
    const p = Number(val);
    if (!p) return '#1e293b';
    return (p < 60 || p > 100) ? '#f59e0b' : '#1e293b';
  };

  const getOxigenoColor = (val) => {
    const o = Number(val);
    if (!o) return '#1e293b';
    return o < 95 ? '#ef4444' : '#1e293b';
  };

  // Color neutro para el peso (puedes cambiarlo si quieres lógica de sobrepeso)
  const getPesoColor = () => '#475569';

  // --- LÓGICA DE BORDE LATERAL ---
  const [sisVal, diaVal] = reg.tension ? reg.tension.split('/').map(Number) : [0, 0];
  const pulsVal = Number(reg.pulso);
  const o2Val = Number(reg.oxigeno);

  let colorBordeSide = '#10b981';
  if (sisVal >= 140 || diaVal >= 90 || (o2Val > 0 && o2Val < 95)) {
    colorBordeSide = '#ef4444';
  } else if (sisVal >= 130 || diaVal >= 85 || (pulsVal > 0 && (pulsVal < 60 || pulsVal > 100))) {
    colorBordeSide = '#f59e0b';
  }

  const handleEditar = async (datosActualizados) => {
    try {
      const docRef = doc(db, "mediciones", reg.id);
      await updateDoc(docRef, datosActualizados);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div 
      style={{
        ...styles.historyCard,
        borderLeft: `6px solid ${colorBordeSide}`,
        backgroundColor: '#ffffff',
        cursor: 'default',
        position: 'relative'
      }}
    >
      {/* CABECERA: Fecha y Acciones */}
      <div style={{
        ...styles.historyHeader,
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '10px',
        marginBottom: '15px'
      }}>
        <span style={{
          ...styles.dateBadge,
          backgroundColor: '#f8fafc',
          color: '#64748b',
          fontSize: '0.75rem',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #e2e8f0'
        }}>
          {reg.fecha} <span style={{ margin: '0 4px', opacity: 0.5 }}>|</span> {reg.hora}
        </span>
        
        <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
          {esAdmin && (
            <>
              <BotonEditar onClick={() => setShowEditModal(true)} />
              <BotonEliminar onClick={() => setShowDeleteModal(true)} />
            </>
          )}
        </div>
      </div>
      
      {/* GRID DE DATOS */}
      <div style={styles.historyGrid}>
        {reg.tension && (
          <div style={{...styles.dataBlock, textAlign: 'left'}}>
            <span style={{...styles.dataLabel, display: 'flex', alignItems: 'center'}}>
              <IconoTension /> Tensión
            </span>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'baseline' }}>
              <strong style={{...styles.dataValue, color: getSisColor(sisVal), fontSize: '1.25rem'}}>
                {sisVal}
              </strong>
              <span style={{color: '#94a3b8'}}>/</span>
              <strong style={{...styles.dataValue, color: getDiaColor(diaVal), fontSize: '1.25rem'}}>
                {diaVal}
              </strong>
            </div>
          </div>
        )}
        
        {reg.pulso && (
          <div style={{...styles.dataBlock, textAlign: 'left'}}>
            <span style={{...styles.dataLabel, display: 'flex', alignItems: 'center'}}>
              <IconoPulso /> Pulso
            </span>
            <strong style={{...styles.dataValue, color: getPulsoColor(reg.pulso), fontSize: '1.25rem'}}>
              {reg.pulso} <small style={{fontSize: '0.7rem', fontWeight: 'normal', color: '#94a3b8'}}>BPM</small>
            </strong>
          </div>
        )}

        {reg.oxigeno && (
          <div style={{...styles.dataBlock, textAlign: 'left'}}>
            <span style={{...styles.dataLabel, display: 'flex', alignItems: 'center'}}>
              <IconoOxigeno /> SpO2
            </span>
            <strong style={{...styles.dataValue, color: getOxigenoColor(reg.oxigeno), fontSize: '1.25rem'}}>
              {reg.oxigeno}<small style={{fontSize: '0.7rem', fontWeight: 'normal', color: '#94a3b8'}}>%</small>
            </strong>
          </div>
        )}

        {/* --- NUEVO BLOQUE DE PESO --- */}
        {reg.peso && (
          <div style={{...styles.dataBlock, textAlign: 'left'}}>
            <span style={{...styles.dataLabel, display: 'flex', alignItems: 'center'}}>
              <IconoPeso /> Peso
            </span>
            <strong style={{...styles.dataValue, color: getPesoColor(), fontSize: '1.25rem'}}>
              {reg.peso} <small style={{fontSize: '0.7rem', fontWeight: 'normal', color: '#94a3b8'}}>kg</small>
            </strong>
            {/* Mostramos el lugar si existe */}
            {reg.lugarPeso && (
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#64748b', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px' 
              }}>
                📍 {reg.lugarPeso}
              </div>
            )}
          </div>
        )}
      </div>

      {reg.ca125 && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f0f7ff',
          borderRadius: '8px',
          border: '1px solid #e0e7ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#004a99', fontSize: '0.75rem', fontWeight: '600' }}>Marcador CA-125</span>
          <strong style={{ color: '#004a99', fontSize: '1.1rem' }}>
            {reg.ca125} <small style={{ fontSize: '0.6rem' }}>U/mL</small>
          </strong>
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        {reg.etiqueta && ETIQUETAS_CONFIG[reg.etiqueta] && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.65rem',
            fontWeight: '700',
            backgroundColor: ETIQUETAS_CONFIG[reg.etiqueta].bg,
            color: ETIQUETAS_CONFIG[reg.etiqueta].text,
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '10px'
          }}>
            {ETIQUETAS_CONFIG[reg.etiqueta].label}
          </span>
        )}
        
        {reg.notas && (
          <div style={{
            ...styles.notaBox,
            marginTop: '8px',
            fontSize: '0.85rem',
            backgroundColor: '#f8fafc',
            borderLeft: '3px solid #cbd5e1',
            borderRadius: '0 8px 8px 0',
            padding: '8px 12px',
            color: '#475569',
            lineHeight: '1.4'
          }}>
            {reg.notas}
          </div>
        )}
      </div>

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