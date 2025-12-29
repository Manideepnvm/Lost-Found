import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { MapPin, Phone, User, Tag, Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { MapView } from '../components/MapComponents';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
            alert("Item not found");
            navigate('/items');
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  if (loading) return <div className="text-center mt-4"><Loader2 className="spin" /> Loading...</div>;
  if (!item) return null;

  const date = item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date';

  return (
    <div className="container mt-4 animate-fade-in">
        <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
            <ChevronLeft size={20} /> Back
        </button>

        <div className="form-card" style={{ maxWidth: '800px' }}>
            <div className="item-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="image-section">
                    <img 
                        src={item.imageUrl} 
                        alt={item.itemName} 
                        style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }} 
                    />
                </div>
                
                <div className="info-section">
                    <h2 className="section-title" style={{ marginBottom: '10px' }}>{item.itemName}</h2>
                    <span className={`status-badge ${item.type}`} style={{ position: 'relative', top: '-5px', marginBottom: '1rem', display: 'inline-block' }}>
                        {item.type.toUpperCase()}
                    </span>
                    
                    <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        {item.description}
                    </p>

                    <div className="details-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="detail-row">
                            <Tag size={20} className="text-primary" />
                            <strong>Category:</strong> {item.category}
                        </div>
                        <div className="detail-row">
                            <MapPin size={20} className="text-primary" />
                            <strong>Location:</strong> {item.location}, {item.city}
                        </div>
                        <div className="detail-row">
                            <User size={20} className="text-primary" />
                            <strong>Posted by:</strong> {item.personName}
                        </div>
                        <div className="detail-row">
                            <Calendar size={20} className="text-primary" />
                            <strong>Date:</strong> {date}
                        </div>
                    </div>

                    <div className="mt-4">
                        <a href={`tel:${item.contact}`} className="btn btn-primary full-width">
                            <Phone size={20} /> Contact: {item.contact}
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Map Placeholder */}
            {item.coordinates ? (
                <MapView position={item.coordinates} />
            ) : (
                <div className="map-placeholder mt-4" style={{ background: 'rgba(255,255,255,0.05)', height: '200px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted">No map location provided.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ItemDetails;
