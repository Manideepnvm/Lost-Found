import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostLost from './pages/PostLost';
import PostFound from './pages/PostFound';
import Items from './pages/Items';
import LocationModal from './components/LocationModal';
import { LocationProvider } from './context/LocationContext';
import './styles/main.css';

function App() {
  return (
    <LocationProvider>
      <div className="app">
        <Navbar />
        <LocationModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post-lost" element={<PostLost />} />
          <Route path="/post-found" element={<PostFound />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </div>
    </LocationProvider>
  );
}

export default App;
