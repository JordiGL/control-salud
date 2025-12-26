import { useState, useRef, useEffect } from 'react';
import { styles } from '../styles/styles';

const MenuUsuario = ({ usuario, logout }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const clickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
    };
    document.addEventListener("mousedown", clickFuera);
    return () => document.removeEventListener("mousedown", clickFuera);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <div 
        onClick={() => setMenuAbierto(!menuAbierto)} 
        style={styles.userButton}
      >
        <span style={styles.userName}>{usuario.displayName}</span>
        <span style={styles.arrow}>{menuAbierto ? '▴' : '▾'}</span>
      </div>
      
      {menuAbierto && (
        <div style={styles.dropdown}>
          <button 
            onClick={() => { logout(); setMenuAbierto(false); }} 
            style={styles.logoutBtn}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuUsuario;