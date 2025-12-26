import { BotonAccion } from './Botones';
import MenuUsuario from './MenuUsuario';
import { styles } from '../styles/styles';

const Header = ({ usuario, login, logout }) => {
  return (
    <header className="no-print" style={styles.header}>
      <div /> 
      {usuario ? (
        /* Usamos el nuevo componente de menú */
        <MenuUsuario usuario={usuario} logout={logout} />
      ) : (
        /* Usamos el nuevo componente de botón */
        <BotonAccion onClick={login}>Acceso Admin</BotonAccion>
      )}
    </header>
  );
};

export default Header;