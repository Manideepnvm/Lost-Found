
import { Link } from 'react-router-dom';
import { MapPin, Phone, User, Calendar, Trash2, Edit } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { db } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

const ItemCard = ({ item }) => {
  const { user } = useUser();
  const { id, itemName, imageUrl, location, personName, contact, type, createdAt, category, description, ownerEmail } = item;
  
  const isOwner = (user.email && user.email === ownerEmail) || (user.contact && user.contact === contact);
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", id));
        alert("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item.");
      }
    }
  };
  
  // Format date if it exists
  const date = createdAt?.seconds ? new Date(createdAt.seconds * 1000).toLocaleDateString() : 'Just now';

  return (
    <div className={`item-card ${type === 'lost' ? 'border-lost' : 'border-found'}`}>
      <div className="card-image-wrapper">
        <Link to={`/items/${id}`}>
          <img src={imageUrl} alt={itemName} className="card-image" />
        </Link>
        <span className={`status-badge ${type}`}>{type === 'lost' ? 'LOST' : 'FOUND'}</span>
        <span className="category-badge">{category}</span>
      </div>
      
      <div className="card-content">
        <h3 className="item-title">{itemName}</h3>
        <p className="item-desc">{description}</p>
        
        <div className="card-details">
          <div className="detail-row">
            <MapPin size={16} className="text-secondary" />
            <span>{location}</span>
          </div>
          <div className="detail-row">
            <User size={16} className="text-secondary" />
            <span>{personName}</span>
          </div>
          <div className="detail-row">
            <Calendar size={16} className="text-secondary" />
            <span>{date}</span>
          </div>
        </div>

        <div className="card-footer" style={{ display: 'flex', gap: '10px' }}>
          <a href={`tel:${contact}`} className="btn btn-outline full-width">
            <Phone size={18} /> Contact: {contact}
          </a>
          
          {isOwner && (
            <>
              <a 
                href={`/edit-item/${id}`}
                className="btn btn-secondary" 
                style={{ width: '50px', padding: '0', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                title="Edit Item"
              >
                <Edit size={18} />
              </a>
              <button 
                onClick={handleDelete} 
                className="btn btn-secondary" 
                style={{ width: '50px', padding: '0', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                title="Delete Item"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
