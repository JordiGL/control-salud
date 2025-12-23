import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Estado para almacenar la lista de registros
  const [registros, setRegistros] = useState(() => {
    const guardados = localStorage.getItem('historial_salud');
    return guardados ? JSON.parse(guardados) : [];
  });

  // Estado para el formulario
  const [formData, setFormData] = useState({
    tension: '', pulso: '', oxigeno: '', ca125: ''
  });

  // Guardar en localStorage cada vez que cambien los registros
  useEffect(() => {
    localStorage.setItem('historial_salud', JSON.stringify(registros));
  }, [registros]);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarRegistro = (e) => {
    e.preventDefault();
    const nuevo = {
      ...formData,
      id: Date.now(),
      fecha: new Date().toLocaleString()
    };
    setRegistros([nuevo, ...registros]);
    setFormData({ tension: '', pulso: '', oxigeno: '', ca125: '' });
  };

  return (
    <div className="App">
      <h1>Control de Salud - Abuela</h1>
      
      <form onSubmit={guardarRegistro} className="formulario">
        <input name="tension" value={formData.tension} onChange={manejarCambio} placeholder="Tensión (120/80)" required />
        <input name="pulso" type="number" value={formData.pulso} onChange={manejarCambio} placeholder="Pulso (BPM)" required />
        <input name="oxigeno" type="number" value={formData.oxigeno} onChange={manejarCambio} placeholder="SpO2 (%)" required />
        <input name="ca125" type="number" value={formData.ca125} onChange={manejarCambio} placeholder="CA-125 (U/mL)" />
        <button type="submit">Registrar Hoy</button>
      </form>

      <div className="historial">
        {registros.map(reg => (
          <div key={reg.id} className="tarjeta-registro">
            <p><strong>Fecha:</strong> {reg.fecha}</p>
            <p><strong>Tensión:</strong> {reg.tension} | <strong>Pulso:</strong> {reg.pulso}</p>
            <p><strong>SpO2:</strong> {reg.oxigeno}% | <strong>CA-125:</strong> {reg.ca125 || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App