
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { User, Phone, Mail, Save, UserCircle } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="card form-card settings-card">
        <div className="form-header">
          <div className="icon-bg secure-bg">
            <UserCircle size={32} />
          </div>
          <h2 className="text-center section-title">User Settings</h2>
          <p className="text-center text-muted">
            These details will be <strong>auto-filled</strong> when you post items.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-group icon-input">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Your Full Name"
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
              placeholder="Contact Number"
              required 
            />
          </div>

          <div className="form-group icon-input">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email Address (Optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary full-width submit-btn">
            {saved ? "Saved Successfully!" : <><Save size={20} /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
