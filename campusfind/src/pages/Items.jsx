
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import { Loader2, MapPin } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

const Items = () => {
  const { city } = useLocationContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    if (!city) return;

    // Filter by City + Sort by Date
    // Note: Firestore requires a composite index for where+orderBy. 
    // If it fails initially, check console for the index creation link.
    // For now, we can fetch all for city and sort client-side (easier for MVP)
    const q = query(
      collection(db, "items"), 
      where("city", "==", city)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Client-side sort to avoid index issues immediately
      itemsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      
      setItems(itemsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [city]);

  const filteredItems = items.filter(item => {
    if (item.type !== activeTab) return false;

    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (!city) return <div className="text-center mt-4">Please select a city to view items.</div>;

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="page-header">
        <h2 className="section-title">
           Items in <span className="highlight">{city}</span>
        </h2>
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'lost' ? 'active lost' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            Lost Items
          </button>
          <button 
            className={`tab-btn ${activeTab === 'found' ? 'active found' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            Found Items
          </button>
        </div>
      </div>

      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
      />

      {loading ? (
        <div className="loading-container" style={{textAlign: 'center', padding: '50px'}}>
          <Loader2 className="spin" size={40} color="var(--primary-color)" />
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => <ItemCard key={item.id} item={item} />)
          ) : (
            <div className="no-items" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#6b7280' }}>
              <p>No {activeTab} items found in {city}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Items;
