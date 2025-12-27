
import { useState } from 'react';
import { useLocationContext } from '../context/LocationContext';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

const LocationModal = () => {
  const { city, updateCity } = useLocationContext();
  const [inputCity, setInputCity] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');

  if (city) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      updateCity(inputCity.trim());
    }
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    setError('');

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setDetecting(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // removing zoom to get max detail (zoom=18 approx)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        const address = data.address;
        
        // STRICTER LOGIC: User is in Madanapalle (Town), but getting Rayachoty (District/County).
        // We must prioritize specific locality names and avoid broad 'county' or 'state_district' defaults if possible.
        
        const exactLocation = 
             address.town || 
             address.city || 
             address.village || 
             address.municipality || 
             address.suburb;

        // Only fall back to broader regions if strictly necessary, but preferably ask user.
        // address.county is often the District name in India (e.g., Annamayya (Rayachoty)).
        
        if (exactLocation) {
          updateCity(exactLocation);
        } else {
          // If we only have broad data (like district), pre-fill input but let user confirm.
          const broadLocation = address.county || address.state_district;
          if (broadLocation) {
            setInputCity(broadLocation);
            setError(`We detected '${broadLocation}' (District). If this is wrong, please correct it above.`);
          } else {
            setError("Could not detect exact city. Please enter manually.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch specific location name.");
      } finally {
        setDetecting(false);
      }
    }, (err) => {
      console.error(err);
      let msg = "Location access denied.";
      if (err.code === 2) msg = "Location unavailable. Check your device GPS/Permissions.";
      if (err.code === 3) msg = "Location request timed out.";
      setError(msg);
      setDetecting(false);
    }, options);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-card">
        <div className="modal-icon-wrapper">
          <MapPin size={48} color="white" />
        </div>
        <h2>Where are you?</h2>
        <p>We need your location to show relevant items.</p>
        
        <button 
          onClick={handleDetectLocation} 
          className="btn btn-secondary full-width mb-4 detect-btn"
          disabled={detecting}
        >
          {detecting ? <Loader2 className="spin" size={20} /> : <Navigation size={20} />}
          {detecting ? " Detecting..." : " Detect My Location"}
        </button>

        <div className="divider"><span>OR</span></div>
        
        <form onSubmit={handleSubmit} className="city-form">
          <div className="input-wrapper">
            <MapPin size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Enter City Manually" 
              value={inputCity} 
              onChange={(e) => setInputCity(e.target.value)}
              className="city-input"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary full-width mt-4">
            Confirm Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
