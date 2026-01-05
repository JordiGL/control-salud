import { useState, useEffect } from 'react'
import { auth, db, provider } from './firebaseConfig'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Header from './components/Header';
import Formulario from './components/Formulario';
import Historial from './components/Historial';
import Grafica from './components/Grafica';
import { CONFIG_CAMPOS } from './constants/campos';
import { styles } from './styles/styles';

const EMAIL_ADMIN = "golojodev@gmail.com";

function App() {
  const [registros, setRegistros] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [metricaSeleccionada, setMetricaSeleccionada] = useState(null);
  const estadoInicial = CONFIG_CAMPOS.reduce((acc, campo) => {
    acc[campo.id] = campo.defaultValue;
    return acc;
  }, {})
  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    onAuthStateChanged(auth, setUsuario);
    const q = query(collection(db, "mediciones"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      setRegistros(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const esAdmin = usuario && usuario.email === EMAIL_ADMIN;

  const guardarRegistro = async (e, datosDirectos = null) => {
    if (e) e.preventDefault();
    if (!esAdmin) return;
  
    // Si vienen datosDirectos (desde el Modal de IA), los usamos. Si no, usamos formData.
    let datosAGuardar = datosDirectos ? { ...datosDirectos } : { ...formData };

    // Si no hay peso escrito, borramos el lugar para no ensuciar la base de datos
    if (!datosAGuardar.peso) {
      datosAGuardar.lugarPeso = "";
    }
  
    await addDoc(collection(db, "mediciones"), { 
      ...datosAGuardar, 
      timestamp: Date.now(), 
      fecha: new Date().toLocaleDateString(), 
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
  
    // Limpiamos el formulario
    setFormData(estadoInicial);
  };

  return (
    <div style={styles.container}>
      <Header usuario={usuario} login={() => signInWithPopup(auth, provider)} logout={() => signOut(auth)} />

      <main style={esAdmin ? styles.dashboardAdmin : styles.dashboardPublic}>
        {/* Envolvemos el formulario en un div con la clase no-print */}
        {esAdmin && (
          <div className="no-print">
            <Formulario 
              formData={formData} 
              setFormData={setFormData} 
              guardarRegistro={guardarRegistro} 
            />
          </div>
        )}
        
        <section style={styles.columnaHistorial}>
          {/* Navegación de métricas y Tabla de registros */}
          <Historial 
            registros={registros} 
            esAdmin={esAdmin} 
            deleteDoc={deleteDoc} 
            db={db} 
            doc={doc}
            updateDoc={updateDoc} // Pasamos updateDoc para permitir la edición
            metricaSeleccionada={metricaSeleccionada}
            setMetricaSeleccionada={setMetricaSeleccionada}
          />
        </section>
      </main>
    </div>
  );
}

export default App;