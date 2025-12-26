import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './styles/main.css';

// Placeholder components for routes we haven't built yet
const PostLost = () => <div className="container mt-4"><h2>Post Lost Item (Coming Soon)</h2></div>;
const PostFound = () => <div className="container mt-4"><h2>Post Found Item (Coming Soon)</h2></div>;
const Items = () => <div className="container mt-4"><h2>View Items (Coming Soon)</h2></div>;

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post-lost" element={<PostLost />} />
        <Route path="/post-found" element={<PostFound />} />
        <Route path="/items" element={<Items />} />
      </Routes>
    </div>
  );
}

export default App;
