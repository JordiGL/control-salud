import { useState, useEffect, useMemo } from 'react'
import { auth, db, provider } from './firebaseConfig'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Header from './components/Header';
import Formulario from './components/Formulario';
import Historial from './components/Historial';
import Grafica from './components/Grafica';
import { styles } from './styles/styles';

const EMAIL_ADMIN = "golojodev@gmail.com";

function App() {
  const [registros, setRegistros] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [metricaSeleccionada, setMetricaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({ tension: '', pulso: '', oxigeno: '', ca125: '', notas: '' });

  useEffect(() => {
    onAuthStateChanged(auth, setUsuario);
    const q = query(collection(db, "mediciones"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      setRegistros(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const esAdmin = usuario && usuario.email === EMAIL_ADMIN;

  const guardarRegistro = async (e) => {
    e.preventDefault();
    if (!esAdmin) return;
    await addDoc(collection(db, "mediciones"), { 
      ...formData, 
      timestamp: Date.now(), 
      fecha: new Date().toLocaleDateString(), 
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
    setFormData({ tension: '', pulso: '', oxigeno: '', ca125: '', notas: '' });
  };

  return (
    <div style={styles.container}>
      <Header usuario={usuario} login={() => signInWithPopup(auth, provider)} logout={() => signOut(auth)} />

      <main style={esAdmin ? styles.dashboardAdmin : styles.dashboardPublic}>
        {esAdmin && <Formulario formData={formData} setFormData={setFormData} guardarRegistro={guardarRegistro} />}
        
        <section style={styles.columnaHistorial}>
          <Historial 
            registros={registros} 
            esAdmin={esAdmin} 
            deleteDoc={deleteDoc} 
            db={db} 
            doc={doc}
            metricaSeleccionada={metricaSeleccionada}
            setMetricaSeleccionada={setMetricaSeleccionada}
          />
        </section>
      </main>
    </div>
  );
}

export default App;