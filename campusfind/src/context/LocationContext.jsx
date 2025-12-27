
import { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState(localStorage.getItem('userCity') || '');

  const updateCity = (newCity) => {
    // Capitalize first letter
    const formattedCity = newCity.charAt(0).toUpperCase() + newCity.slice(1);
    setCity(formattedCity);
    localStorage.setItem('userCity', formattedCity);
  };

  return (
    <LocationContext.Provider value={{ city, updateCity }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
