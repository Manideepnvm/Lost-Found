
import { MapPin, Phone, User, Calendar } from 'lucide-react';

const ItemCard = ({ item }) => {
  const { itemName, imageUrl, location, personName, contact, type, createdAt, category, description } = item;
  
  // Format date if it exists
  const date = createdAt?.seconds ? new Date(createdAt.seconds * 1000).toLocaleDateString() : 'Just now';

  return (
    <div className={`item-card ${type === 'lost' ? 'border-lost' : 'border-found'}`}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={itemName} className="card-image" />
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

        <div className="card-footer">
          <a href={`tel:${contact}`} className="btn btn-outline full-width">
            <Phone size={18} /> Contact: {contact}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
