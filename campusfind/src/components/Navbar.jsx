import { Link } from 'react-router-dom';
import '../styles/main.css';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ background: 'var(--primary-color)', padding: '15px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🏫 CampusFind
        </Link>
        <div className="nav-links">
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
          <Link to="/items" style={{ color: 'white', textDecoration: 'none' }}>View Items</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
