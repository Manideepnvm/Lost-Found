import { Link } from 'react-router-dom';
import '../styles/main.css';

const Home = () => {
  return (
    <div className="home-page container" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>CampusFind - Lost & Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#4b5563' }}>
        The trusted public portal for reporting lost and found items on campus.
        <br />
        No login required. Fast & Secure.
      </p>

      <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Link to="/post-lost" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          Post Lost Item
        </Link>
        <Link to="/post-found" className="btn btn-primary" style={{ backgroundColor: '#059669', padding: '15px 30px', fontSize: '1.1rem' }}>
          Post Found Item
        </Link>
        <Link to="/items" className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          Browse Items
        </Link>
      </div>

      <div style={{ marginTop: '50px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', display: 'inline-block' }}>
        <strong>⚠️ Note:</strong> Please do not post fake items. All posts require a name, contact, and image verification.
      </div>
    </div>
  );
};

export default Home;
