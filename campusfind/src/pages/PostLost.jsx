
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Tag, 
  Image as ImageIcon,
  Send,
  Loader2,
  Navigation
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';
import { useUser } from '../context/UserContext';

const PostLost = () => {
  const navigate = useNavigate();
  const { city } = useLocationContext();
  const { user } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    personName: '',
    contact: '',
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
    } else {
      // Optional: Redirect to settings if strictly mandatory
      // navigate('/settings');
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
        type: 'lost',
        city: city,
        createdAt: serverTimestamp()
      });

      alert("Lost item posted successfully!");
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
          <h2 className="text-center section-title">Report Lost Item</h2>
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
              readOnly={!!user?.name} // Make read-only if auto-filled to enforce settings? Or allow edit? Let's allow edit for flexibility but it forces them to Settings to save permanently.
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
              placeholder={`Location inside ${city} (e.g., Central Park) *`}
              required 
            />
          </div>

          <div className="form-group">
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description (Color, model, unique marks)..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-group upload-group">
            <label className="upload-label">
              <ImageIcon size={24} />
              <span>{image ? "Change Image" : "Upload Item Image *"}</span>
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

          <button type="submit" className="btn btn-primary full-width submit-btn" disabled={loading}>
            {loading ? <><Loader2 className="spin" size={20} /> Posting...</> : <><Send size={20} /> Post Lost Item</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostLost;
