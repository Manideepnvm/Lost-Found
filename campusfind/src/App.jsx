import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostLost from './pages/PostLost';
import PostFound from './pages/PostFound';
import Items from './pages/Items';
import Settings from './pages/Settings'; // Import Settings
import LocationModal from './components/LocationModal';
import { LocationProvider } from './context/LocationContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import './styles/main.css';

function App() {
  return (
    <UserProvider>
      <LocationProvider>
        <div className="app">
          <Navbar />
          <LocationModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post-lost" element={<PostLost />} />
            <Route path="/post-found" element={<PostFound />} />
            <Route path="/items" element={<Items />} />
            <Route path="/settings" element={<Settings />} /> 
          </Routes>
        </div>
      </LocationProvider>
    </UserProvider>
  );
}

export default App;
