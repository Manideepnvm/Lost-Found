
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';
import { useUser } from '../context/UserContext';
import { LocationPicker } from '../components/MapComponents';

const PostFound = () => {
  const navigate = useNavigate();
  const { city } = useLocationContext();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    personName: '',
    contact: '',
    email: '',
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
  });

  // Auto-fill user details
  useEffect(() => {
    if (user && (user.name || user.contact)) {
      setFormData(prev => ({
        ...prev,
        personName: user.name || '',
        contact: user.contact || ''
      }));
    }
  }, [user]);

  const categories = ['Electronics', 'Clothing', 'Documents', 'Keys', 'Wallet', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.personName || !formData.contact || !formData.itemName || !formData.location || !image) {
      alert("All fields including image are mandatory!");
      return;
    }

    setLoading(true);
    try {
      const storageRef = ref(storage, `item-images/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "items"), {
        ...formData,
        imageUrl: downloadURL,
        type: 'found',
        city: city, // Save city
        ownerEmail: user.email,
        coordinates: position,
        createdAt: serverTimestamp()
      });

      alert("Found item posted successfully!");
      navigate('/items');
    } catch (error) {
      console.error("Error posting item:", error);
      alert("Error posting item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="form-card">
        <div className="form-header">
          <h2 className="text-center section-title">Report Found Item</h2>
          <p className="text-center text-muted">Posting in <strong>{city}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-group icon-input">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              name="personName" 
              value={formData.personName} 
              onChange={handleChange} 
              placeholder="Your Full Name *"
              required 
              readOnly={!!user?.name}
            />
          </div>

          <div className="form-group icon-input">
            <Phone className="input-icon" size={20} />
            <input 
              type="text" 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange} 
              placeholder="Contact Number / Email *"
              required 
              readOnly={!!user?.contact}
            />
          </div>
          
          {(!user?.name || !user?.contact) && (
            <div className="text-center mb-3">
              <small className="text-muted">
                Tip: Go to <a href="/settings" style={{color:'var(--primary-color)'}}>Settings</a> to save these details permanently.
              </small>
            </div>
          )}

          <div className="form-row">
            <div className="form-group half icon-input">
              <Tag className="input-icon" size={20} />
              <input 
                type="text" 
                name="itemName" 
                value={formData.itemName} 
                onChange={handleChange} 
                placeholder="Item Name *"
                required 
              />
            </div>
            
            <div className="form-group half">
              <select name="category" value={formData.category} onChange={handleChange} className="custom-select">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group icon-input">
            <MapPin className="input-icon" size={20} />
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder={`Location inside ${city} (e.g., Cafeteria) *`}
              required 
            />
          </div>

          <div className="form-group">
             <label style={{display: 'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>
               <MapPin size={16} /> Pin Exact Location on Map (Optional)
             </label>
             <LocationPicker position={position} setPosition={setPosition} />
          </div>

          <div className="form-group">
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description (Safety first!)..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-group upload-group">
            <label className="upload-label">
              <ImageIcon size={24} />
              <span>{image ? "Change Image" : "Upload Found Item Image *"}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                required
                hidden
              />
            </label>
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary full-width submit-btn success-btn" disabled={loading}>
            {loading ? <><Loader2 className="spin" size={20} /> Posting...</> : <><CheckCircle2 size={20} /> Post Found Item</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostFound;
