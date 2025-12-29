import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon issues in React-Leaflet/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

export const LocationPicker = ({ position, setPosition }) => {
    const [center, setCenter] = useState({ lat: 17.3850, lng: 78.4867 }); // Hyderabad default
    const mapRef = useState(null);

    const handleLocateMe = (e) => {
        e.preventDefault(); // Prevent form submission
        if(navigator.geolocation) {
             const options = { timeout: 30000, enableHighAccuracy: true };
             navigator.geolocation.getCurrentPosition((pos) => {
                 const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                 setCenter(newPos);
                 setPosition(newPos); // Auto-pin current location
                 // If we had access to map instance, we'd flyTo. 
                 // React-leaflet v4+ makes accessing map instance a bit tricky inside component without a child hook.
                 // But changing 'center' prop on MapContainer doesn't always re-center after init.
                 // We can rely on the user manually panning or use a child component to re-center.
             }, (err) => {
                 console.error(err);
                 let msg = "Could not access location.";
                 if (err.code === 3) msg = "Location request timed out.";
                 alert(msg + " Please enable permissions or try again.");
             }, options);
        }
    };

    // Component to handle map center updates
    const MapRecenter = ({ centerLoc }) => {
        const map = useMapEvents({});
        useEffect(() => {
            map.flyTo(centerLoc, map.getZoom());
        }, [centerLoc, map]);
        return null;
    };

    return (
        <div className="map-container" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <small className="text-muted">Tap map to pin location</small>
                <button onClick={handleLocateMe} className="btn btn-xs btn-outline" style={{ fontSize: '0.8rem', padding: '2px 8px' }}>
                    <MapPin size={12} /> Use My Location
                </button>
            </div>
            <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 1 }}>
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    {/* Dark Matter Tiles for Premium Dark Theme */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                    <MapRecenter centerLoc={center} />
                </MapContainer>
            </div>
        </div>
    );
};

export const MapView = ({ position }) => {
    if (!position) return <div className="text-muted">No location pinned.</div>;

    return (
        <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position}>
                    <Popup>Item Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
