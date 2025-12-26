
import { useState } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const PostFound = () => {
  const navigate = useNavigate();
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
      // 1. Upload Image
      const storageRef = ref(storage, `item-images/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Add to Firestore
      await addDoc(collection(db, "items"), {
        ...formData,
        imageUrl: downloadURL,
        type: 'found',
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
      <div className="card form-card">
        <h2 className="text-center" style={{ color: 'var(--success)' }}>Report Found Item</h2>
        <p className="text-center mb-4 text-muted">Thank you for helping returning lost items!</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input 
              type="text" 
              name="personName" 
              value={formData.personName} 
              onChange={handleChange} 
              placeholder="Enter your name"
              required 
            />
          </div>

          <div className="form-group">
            <label>Contact Number / Email *</label>
            <input 
              type="text" 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange} 
              placeholder="How can the owner reach you?"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Item Name *</label>
              <input 
                type="text" 
                name="itemName" 
                value={formData.itemName} 
                onChange={handleChange} 
                placeholder="e.g., Black Wallet"
                required 
              />
            </div>
            
            <div className="form-group half">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location Found *</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="e.g., Cafeteria Table 5"
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Any details? (Keep safety in mind)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Item Image (Mandatory) *</label>
            <div className="file-upload-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                required
              />
              {preview && <img src={preview} alt="Preview" className="image-preview" />}
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Posting...' : 'Post Found Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostFound;
