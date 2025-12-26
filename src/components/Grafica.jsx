import { useMemo, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { styles } from '../styles/styles';

const Grafica = ({ registros, metricaSeleccionada }) => {
  const [rangoTiempo, setRangoTiempo] = useState('todo'); 
  const [franjaHoraria, setFranjaHoraria] = useState('todo'); 
  const esTension = metricaSeleccionada === 'tension';

  // 1. Filtrado de datos
  const registrosFiltrados = useMemo(() => {
    let filtrados = registros;
    if (rangoTiempo !== 'todo') {
      const ahora = Date.now();
      const limite = rangoTiempo === 'semana' ? ahora - 604800000 : ahora - 2592000000;
      filtrados = filtrados.filter(reg => reg.timestamp >= limite);
    }
    if (franjaHoraria !== 'todo') {
      filtrados = filtrados.filter(reg => {
        const hora = parseInt(reg.hora.split(':')[0], 10);
        return franjaHoraria === 'mañana' ? (hora >= 0 && hora < 12) : (hora >= 12 && hora < 24);
      });
    }
    return filtrados;
  }, [registros, rangoTiempo, franjaHoraria]);

  // 2. Procesamiento para la gráfica
  const datosGrafica = useMemo(() => {
    return registrosFiltrados.map(r => ({
      tiempo: `${r.fecha.substring(0, 5)} ${r.hora}`,
      sistolica: esTension ? parseFloat((r.tension || "").split('/')[0]) : null,
      diastolica: esTension ? parseFloat((r.tension || "").split('/')[1]) : null,
      valor: !esTension ? parseFloat(r[metricaSeleccionada]) : null
    })).filter(d => esTension ? !isNaN(d.sistolica) : !isNaN(d.valor));
  }, [registrosFiltrados, esTension, metricaSeleccionada]);

  // 3. NUEVO: Cálculo de Estadísticas (Máx, Mín, Promedio)
  const stats = useMemo(() => {
    if (datosGrafica.length === 0) return null;

    const calcularValores = (arr) => ({
      max: Math.max(...arr),
      min: Math.min(...arr),
      avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    });

    if (esTension) {
      return {
        sis: calcularValores(datosGrafica.map(d => d.sistolica)),
        dia: calcularValores(datosGrafica.map(d => d.diastolica))
      };
    }
    return { normal: calcularValores(datosGrafica.map(d => d.valor)) };
  }, [datosGrafica, esTension]);

  const getEstiloBoton = (tipo, valorActual, variante = 'normal') => {
    const isActive = tipo === valorActual;
    const estiloVariante = variante === 'am' ? styles.btnAM : variante === 'pm' ? styles.btnPM : styles.btnFiltroActivo;
    return { ...styles.btnFiltro, ...(isActive ? estiloVariante : {}) };
  };

  return (
    <div style={styles.chartCard}>
      {/* Selectores de Filtros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['semana', 'mes', 'todo'].map(r => (
            <button key={r} onClick={() => setRangoTiempo(r)} style={getEstiloBoton(r, rangoTiempo)}>
              {r === 'todo' ? 'Todo' : r === 'semana' ? '7 Días' : '30 Días'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setFranjaHoraria('todo')} style={getEstiloBoton('todo', franjaHoraria)}>24h</button>
          <button onClick={() => setFranjaHoraria('mañana')} style={getEstiloBoton('mañana', franjaHoraria, 'am')}>AM</button>
          <button onClick={() => setFranjaHoraria('tarde')} style={getEstiloBoton('tarde', franjaHoraria, 'pm')}>PM</button>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datosGrafica} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="tiempo" axisLine={false} tickLine={false} interval={0} 
              tick={({ x, y, payload }) => {
                const [f, h] = payload.value.split(' ');
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={10} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight="600">{f}</text>
                    <text x={0} y={20} textAnchor="middle" fill="#94a3b8" fontSize={8}>{h}</text>
                  </g>
                );
              }} 
            />
            <YAxis axisLine={false} tickLine={false} domain={['auto', 'auto']} tick={{fontSize: 10}} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            {esTension ? (
              <>
                <Area type="monotone" dataKey="sistolica" stroke="#004a99" fillOpacity={0.1} strokeWidth={3} name="Sistólica" dot={{r:3}} />
                <Area type="monotone" dataKey="diastolica" stroke="#10b981" fillOpacity={0.1} strokeWidth={3} name="Diastólica" dot={{r:3}} />
              </>
            ) : (
              <Area type="monotone" dataKey="valor" stroke="#004a99" fillOpacity={0.1} strokeWidth={3} dot={{r:4}} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* BLOQUE DE ESTADÍSTICAS RESTAURADO */}
      {stats && datosGrafica.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {esTension ? (
            <>
              <div style={{...styles.statSummaryLabel, color: '#004a99', textAlign: 'center', marginBottom: '8px'}}>SISTÓLICA</div>
              <div style={{...styles.statsSummaryGrid, marginTop: '0', paddingTop: '5px', borderTop: 'none'}}>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁX</span><strong style={styles.statSummaryValue}>{stats.sis.max}</strong></div>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROM</span><strong style={{...styles.statSummaryValue, color: '#004a99'}}>{stats.sis.avg}</strong></div>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍN</span><strong style={styles.statSummaryValue}>{stats.sis.min}</strong></div>
              </div>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '12px 0' }} />
              <div style={{...styles.statSummaryLabel, color: '#10b981', textAlign: 'center', marginBottom: '8px'}}>DIASTÓLICA</div>
              <div style={{...styles.statsSummaryGrid, marginTop: '0', paddingTop: '5px', borderTop: 'none'}}>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁX</span><strong style={styles.statSummaryValue}>{stats.dia.max}</strong></div>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROM</span><strong style={{...styles.statSummaryValue, color: '#10b981'}}>{stats.dia.avg}</strong></div>
                <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍN</span><strong style={styles.statSummaryValue}>{stats.dia.min}</strong></div>
              </div>
            </>
          ) : (
            <div style={styles.statsSummaryGrid}>
              <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÁXIMO</span><strong style={styles.statSummaryValue}>{stats.normal.max}</strong></div>
              <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>PROMEDIO</span><strong style={{ ...styles.statSummaryValue, color: '#004a99' }}>{stats.normal.avg}</strong></div>
              <div style={styles.statSummaryItem}><span style={styles.statSummaryLabel}>MÍNIMO</span><strong style={styles.statSummaryValue}>{stats.normal.min}</strong></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Grafica;