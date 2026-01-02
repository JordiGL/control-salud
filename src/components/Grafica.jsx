import { useMemo, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { styles } from '../styles/styles';
import MenuExportar from './MenuExportar';
import { ETIQUETAS_CONFIG, LUGARES_CONFIG, capitalizar } from '../constants/metricas';

const COLORES_GRAFICA = {
  sistolica: '#1e40af', 
  diastolica: '#92400e', 
  general: '#004A99',    
  grid: '#f1f5f9',
  texto: '#64748b' 
};

// Tooltip Personalizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; 
    
    const textoEtiqueta = ETIQUETAS_CONFIG[data.etiquetaOriginal]?.label || capitalizar(data.etiquetaOriginal);

    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: 'none',
        fontSize: '0.8rem',
        pointerEvents: 'none'
      }}>
        <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
          {data.tiempoCompleto || label}
        </p>
        
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0', color: entry.color, fontWeight: '600' }}>
            {capitalizar(entry.name)}: {entry.value}
          </p>
        ))}

        {/* Mostrar Lugar del Peso */}
        {data.lugarPeso && (
           <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
             <span>📍</span> {data.lugarPeso}
           </div>
        )}

        {data.etiquetaOriginal && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
            <p style={{ margin: 0, color: '#0369a1', fontWeight: '500' }}>
              🏷️ {textoEtiqueta}
            </p>
          </div>
        )}
        
        {data.notasOriginales && (
          <div style={{ marginTop: '6px' }}>
            <p style={{ margin: 0, color: '#475569', fontStyle: 'italic', maxWidth: '150px', lineHeight: '1.2' }}>
              📝 {capitalizar(data.notasOriginales)}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const Grafica = ({ registros, metricaSeleccionada }) => {
  const [rangoTiempo, setRangoTiempo] = useState('todo'); 
  const [franjaHoraria, setFranjaHoraria] = useState('todo'); 
  const [etiquetaFiltro, setEtiquetaFiltro] = useState('todos');
  const [lugarFiltro, setLugarFiltro] = useState('todos');
  
  const esTension = metricaSeleccionada === 'tension';

  const registrosFiltrados = useMemo(() => {
    let filtrados = registros;

    if (rangoTiempo !== 'todo') {
      const ahora = Date.now();
      const limite = rangoTiempo === 'semana' ? ahora - 604800000 : ahora - 2592000000;
      filtrados = filtrados.filter(reg => reg.timestamp >= limite);
    }

    if (franjaHoraria !== 'todo') {
      filtrados = filtrados.filter(reg => {
        const horaNumerica = parseInt(reg.hora.split(':')[0], 10);
        return franjaHoraria === 'mañana' ? (horaNumerica >= 0 && horaNumerica < 12) : (horaNumerica >= 12 && horaNumerica < 24);
      });
    }

    if (etiquetaFiltro !== 'todos') {
      filtrados = filtrados.filter(reg => reg.etiqueta === etiquetaFiltro);
    }

    if (metricaSeleccionada === 'peso' && lugarFiltro !== 'todos') {
      filtrados = filtrados.filter(reg => reg.lugarPeso === lugarFiltro);
    }

    return filtrados;
  }, [registros, rangoTiempo, franjaHoraria, etiquetaFiltro, lugarFiltro, metricaSeleccionada]);

  const datosGrafica = useMemo(() => {
    return registrosFiltrados.map(r => ({
      tiempo: `${r.fecha.substring(0, 5)} ${r.hora}`,
      tiempoCompleto: `${r.fecha} | ${r.hora}`,
      etiquetaOriginal: r.etiqueta,
      notasOriginales: r.notas,
      lugarPeso: r.lugarPeso,
      sistolica: esTension ? parseFloat((r.tension || "").split('/')[0]) : null,
      diastolica: esTension ? parseFloat((r.tension || "").split('/')[1]) : null,
      valor: !esTension ? parseFloat(r[metricaSeleccionada]) : null
    })).filter(d => esTension ? !isNaN(d.sistolica) : !isNaN(d.valor));
  }, [registrosFiltrados, esTension, metricaSeleccionada]);

  const stats = useMemo(() => {
    if (datosGrafica.length === 0) return null;

    const calcularValores = (arr) => {
      const suma = arr.reduce((a, b) => a + b, 0);
      const promedio = suma / arr.length;

      const promedioFinal = metricaSeleccionada === 'peso'
        ? Math.round(promedio * 10) / 10 
        : Math.round(promedio);

      return {
        max: Math.max(...arr),
        min: Math.min(...arr),
        avg: promedioFinal
      };
    };

    if (esTension) {
      return {
        sis: calcularValores(datosGrafica.map(d => d.sistolica)),
        dia: calcularValores(datosGrafica.map(d => d.diastolica))
      };
    }
    return { normal: calcularValores(datosGrafica.map(d => d.valor)) };
  }, [datosGrafica, esTension, metricaSeleccionada]);

  const getEstiloBoton = (tipo, valorActual, variante = 'normal') => {
    const isActive = tipo === valorActual;
    const estiloVariante = variante === 'am' ? styles.btnAM : variante === 'pm' ? styles.btnPM : styles.btnFiltroActivo;
    return { ...styles.btnFiltro, ...(isActive ? estiloVariante : {}) };
  };

  const colorLinea = COLORES_GRAFICA.general;

  return (
    <div style={styles.chartCard}>
      <div className="print-only" style={{
        display: 'none', 
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1e293b', 
        textTransform: 'uppercase',
        borderBottom: `2px solid ${COLORES_GRAFICA.sistolica}`,
        paddingBottom: '10px'
      }}>
        Seguimiento de {metricaSeleccionada.toUpperCase()}
      </div>

      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px', alignItems: 'center' }}>
        
        {/* BOTONES DE TIEMPO */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['semana', 'mes', 'todo'].map(r => (
            <button key={r} onClick={() => setRangoTiempo(r)} style={getEstiloBoton(r, rangoTiempo)}>
              {r === 'todo' ? 'Todo' : r === 'semana' ? '7 Días' : '30 Días'}
            </button>
          ))}
          <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />
          <button onClick={() => setFranjaHoraria('todo')} style={getEstiloBoton('todo', franjaHoraria)}>24h</button>
          <button onClick={() => setFranjaHoraria('mañana')} style={getEstiloBoton('mañana', franjaHoraria, 'am')}>AM</button>
          <button onClick={() => setFranjaHoraria('tarde')} style={getEstiloBoton('tarde', franjaHoraria, 'pm')}>PM</button>
        </div>

        {/* --- CONTENEDOR DE FILTROS (LADO A LADO) --- */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center', 
          width: '100%'
        }}>
          
          {/* SELECTOR DE CONTEXTO */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ ...styles.label}}>Contextos</label>
            <select 
              style={{ ...styles.selector, ...styles.selectorFiltro, minWidth: "170px"}} 
              value={etiquetaFiltro}
              onChange={(e) => setEtiquetaFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              {Object.keys(ETIQUETAS_CONFIG).map(key => (
                <option key={key} value={key}>{ETIQUETAS_CONFIG[key].label}</option>
              ))}
            </select>
          </div>

          {/* SELECTOR DE LUGAR (Solo Peso) */}
          {metricaSeleccionada === 'peso' && (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
               <label style={{ ...styles.label}}>Lugares</label>
               <select 
                 style={{ ...styles.selector, ...styles.selectorFiltro, minWidth: "120px"}} 
                 value={lugarFiltro}
                 onChange={(e) => setLugarFiltro(e.target.value)}
               >
                <option value="todos">Todos</option>
                {/* Generamos las opciones desde la config central */}
                {Object.keys(LUGARES_CONFIG).map(key => (
                  <option key={key} value={key}>{LUGARES_CONFIG[key].label}</option>
                ))}
               </select>
             </div>
          )}
        </div>
      </div>

      {datosGrafica.length > 0 ? (
        <>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datosGrafica} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <defs>
                  <linearGradient id="colorSis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORES_GRAFICA.sistolica} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={COLORES_GRAFICA.sistolica} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORES_GRAFICA.grid} />
                <XAxis 
                    dataKey="tiempo" 
                    axisLine={false} 
                    tickLine={false} 
                    interval="preserveStartEnd" 
                    height={50}
                    tick={({ x, y, payload }) => {
                        const partes = payload.value.split(' ');
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text x={0} y={15} textAnchor="middle" fill={COLORES_GRAFICA.texto} fontSize={10} fontWeight="bold">{partes[0]}</text>
                            <text x={0} y={30} textAnchor="middle" fill={COLORES_GRAFICA.texto} fontSize={10} fontWeight="bold">{partes[1]}</text>
                          </g>
                        );
                    }}
                />
                <YAxis axisLine={false} tickLine={false} domain={['auto', 'auto']} tick={{fontSize: 10, fill: COLORES_GRAFICA.texto}} />
                
                <Tooltip content={<CustomTooltip />} />
                
                {esTension ? (
                  <>
                    <Area type="monotone" dataKey="sistolica" stroke={COLORES_GRAFICA.sistolica} fillOpacity={1} fill="url(#colorSis)" strokeWidth={3} name="Sistólica" dot={{r:3}} />
                    <Area type="monotone" dataKey="diastolica" stroke={COLORES_GRAFICA.diastolica} fillOpacity={0} fill="transparent" strokeWidth={3} name="Diastólica" dot={{r:3}} />
                  </>
                ) : (
                  <Area type="monotone" dataKey="valor" stroke={colorLinea} fillOpacity={0.1} fill={colorLinea} strokeWidth={3} dot={{r:4}} name={capitalizar(metricaSeleccionada)} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {stats && (
            <div style={{ marginTop: '20px' }}>
              {esTension ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORES_GRAFICA.sistolica }}></div>
                    <div style={{ ...styles.statSummaryLabel, color: COLORES_GRAFICA.texto, fontSize: '0.7rem', fontWeight: 'bold' }}>SISTÓLICA</div>
                  </div>
                  <div style={{...styles.statsSummaryGrid, marginTop: '0', paddingTop: '5px', borderTop: 'none'}}>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁX</span><strong style={styles.statSummaryValue}>{stats.sis.max}</strong></div>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROM</span><strong style={{...styles.statSummaryValue, color: '#1e293b'}}>{stats.sis.avg}</strong></div>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍN</span><strong style={styles.statSummaryValue}>{stats.sis.min}</strong></div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '12px 0' }} className="no-print" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORES_GRAFICA.diastolica }}></div>
                    <div style={{ ...styles.statSummaryLabel, color: COLORES_GRAFICA.texto, fontSize: '0.7rem', fontWeight: 'bold' }}>DIASTÓLICA</div>
                  </div>
                  <div style={{...styles.statsSummaryGrid, marginTop: '0', paddingTop: '5px', borderTop: 'none'}}>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁX</span><strong style={styles.statSummaryValue}>{stats.dia.max}</strong></div>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROM</span><strong style={{...styles.statSummaryValue, color: '#1e293b'}}>{stats.dia.avg}</strong></div>
                    <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍN</span><strong style={styles.statSummaryValue}>{stats.dia.min}</strong></div>
                  </div>
                </>
              ) : (
                <div style={{...styles.statsSummaryGrid, marginTop: '0', paddingTop: '5px', borderTop: 'none'}}>
                  <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁXIMO</span><strong style={styles.statSummaryValue}>{stats.normal.max}</strong></div>
                  <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROMEDIO</span><strong style={{ ...styles.statSummaryValue, color: '#1e293b' }}>{stats.normal.avg}</strong></div>
                  <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍNIMO</span><strong style={styles.statSummaryValue}>{stats.normal.min}</strong></div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No hay mediciones registradas para los filtros seleccionados.
        </div>
      )}

      <MenuExportar datosFiltrados={registrosFiltrados} />
    </div>
  );
};

export default Grafica;