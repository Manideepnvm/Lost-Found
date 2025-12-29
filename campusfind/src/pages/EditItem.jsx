import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPin, Phone, User, Tag, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLocationContext } from '../context/LocationContext';
import { LocationPicker } from '../components/MapComponents';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { city } = useLocationContext();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    personName: '',
    contact: '',
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
  });

  const categories = ['Electronics', 'Clothing', 'Documents', 'Keys', 'Wallet', 'Other'];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ownership check
          const isOwner = (user.email && user.email === data.ownerEmail) || (user.contact && user.contact === data.contact);
          
          if (!isOwner) {
            alert("You are not authorized to edit this item.");
            navigate('/items');
            return;
          }

          setFormData({
            personName: data.personName,
            contact: data.contact,
            itemName: data.itemName,
            category: data.category,
            description: data.description,
            location: data.location
          });
          setPreview(data.imageUrl);
          if (data.coordinates) setPosition(data.coordinates);
        } else {
          alert("Item not found!");
          navigate('/items');
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.contact || user.email) {
        fetchItem();
    }
  }, [id, user, navigate]);

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
    setSubmitting(true);

    try {
      let downloadURL = preview;

      if (image) {
        const storageRef = ref(storage, `item-images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(doc(db, "items", id), {
        ...formData,
        imageUrl: downloadURL,
        coordinates: position,
        updatedAt: serverTimestamp()
      });

      alert("Item updated successfully!");
      navigate('/items');
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-4"><Loader2 className="spin" /> Loading...</div>;

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="form-card">
        <div className="form-header">
          <h2 className="text-center section-title">Edit Item</h2>
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
            />
          </div>

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
            <label style={{display: 'block', marginBottom: '8px', color: 'var(--text-secondary)'}}>
                <MapPin size={16} /> Edit Location on Map
            </label>
            <LocationPicker position={position} setPosition={setPosition} />
          </div>

          <div className="form-group">
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-group upload-group">
            <label className="upload-label">
              <ImageIcon size={24} />
              <span>{image ? "Change Image" : "Keep Current Image or Change"}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                hidden
              />
            </label>
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary full-width submit-btn" disabled={submitting}>
            {submitting ? <><Loader2 className="spin" size={20} /> Updating...</> : <><Send size={20} /> Update Item</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
