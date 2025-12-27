
import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, PlusCircle, Home as HomeIcon, MapPin, Settings } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

const Navbar = () => {
  const location = useLocation();
  const { city, updateCity } = useLocationContext();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleChangeCity = () => {
    if(confirm("Do you want to change your city?")) {
      updateCity('');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Compass size={28} className="logo-icon" />
          <span>CampusFind</span>
        </Link>
        
        <ul className="nav-links">
          {city && (
            <li onClick={handleChangeCity} className="location-pill">
              <MapPin size={16} /> {city}
            </li>
          )}
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <HomeIcon size={18} /> Home
            </Link>
          </li>
          <li>
            <Link to="/items" className={`nav-link ${isActive('/items')}`}>
              <Search size={18} /> Browse Items
            </Link>
          </li>
          <li>
            <Link to="/post-lost" className={`nav-link ${isActive('/post-lost')}`}>
              <PlusCircle size={18} /> Post Lost
            </Link>
          </li>
          <li>
            <Link to="/post-found" className={`nav-link ${isActive('/post-found')}`}>
              <PlusCircle size={18} /> Post Found
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>
              <Settings size={18} /> Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
