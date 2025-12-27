
import { Link } from 'react-router-dom';
import { Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Lost Something? <br /> <span className="highlight">Let's Find It.</span></h1>
          <p className="hero-subtitle">
            The official campus portal to report lost items and reunite with found belongings. 
            Simple, trustworthy, and fast.
          </p>
          
          <div className="hero-buttons">
            <Link to="/post-lost" className="btn btn-primary hero-btn lost-btn">
              <AlertCircle size={20} /> I Lost Something
            </Link>
            <Link to="/post-found" className="btn btn-primary hero-btn found-btn">
              <CheckCircle2 size={20} /> I Found Something
            </Link>
            <Link to="/items" className="btn btn-secondary hero-btn">
              <Search size={20} /> Browse Items
            </Link>
          </div>
        </div>
        <div className="hero-shape"></div>
      </div>

      <div className="features-section container">
        <div className="feature-card">
          <div className="icon-bg lost-bg"><AlertCircle size={32} /></div>
          <h3>Quick Reporting</h3>
          <p>Lost an item? Report it in seconds with a photo and description.</p>
        </div>
        <div className="feature-card">
          <div className="icon-bg found-bg"><CheckCircle2 size={32} /></div>
          <h3>Easy Returns</h3>
          <p>Found something? Help it reach its owner by posting details securely.</p>
        </div>
        <div className="feature-card">
          <div className="icon-bg secure-bg"><Search size={32} /></div>
          <h3>Public & Verified</h3>
          <p>All posts require contact info and images to ensure authenticity.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
