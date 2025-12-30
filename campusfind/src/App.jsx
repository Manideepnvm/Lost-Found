import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostLost from './pages/PostLost';
import PostFound from './pages/PostFound';
import Items from './pages/Items';

import MyListings from './pages/MyListings';
import Settings from './pages/Settings'; 
import EditItem from './pages/EditItem';
import ItemDetails from './pages/ItemDetails'; // Import ItemDetails
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
            <Route path="/items/:id" element={<ItemDetails />} /> {/* Details route */}
            <Route path="/my-items" element={<MyListings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-item/:id" element={<EditItem />} /> 
          </Routes>
        </div>
      </LocationProvider>
    </UserProvider>
  );
}

export default App;
