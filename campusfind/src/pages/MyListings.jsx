import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ItemCard from '../components/ItemCard';
import { Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const MyListings = () => {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (!user.email && !user.contact)) {
        setLoading(false);
        return;
    }

    const fetchMyItems = async () => {
        // Query logic: prefer ownerEmail, fallback to contact
        // Note: Firestore 'in' query or multiple queries might be needed if we want to matching EITHER.
        // For simplicity, let's just fetch all and filter client side if the dataset is small, OR try to match email.
        // Since we updated PostLost/Found to save ownerEmail, let's rely on that primarily.
        
        // Actually, simpler: query where ownerEmail == user.email
        // If user doesn't have email in profile, falling back to contact won't work easily with simple queries unless we save 'contact' as 'ownerContact' specifically.
        // Current Items have 'contact' field. So let's query where contact == user.contact
        
        // Strategy: 
        // 1. If email exists, query by ownerEmail
        // 2. If contact exists, query by contact
        // We can do two queries and merge? Or just rely on contact which is mandatory.
        
        try {
            const q = query(
                collection(db, "items"), 
                where("contact", "==", user.contact || "UNKNOWN") 
            );
            // Also checking email if stored
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const itemsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by date desc
                itemsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
                setItems(itemsData);
                setLoading(false);
            });
            return unsubscribe;
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    fetchMyItems();
  }, [user]);

  if (!user.contact) {
      return (
          <div className="container mt-4 text-center">
              <h2>Please complete your profile in Settings to view your items.</h2>
          </div>
      )
  }

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="page-header">
        <h2 className="section-title">My Listings</h2>
      </div>

      {loading ? (
        <div className="loading-container" style={{textAlign: 'center', padding: '50px'}}>
          <Loader2 className="spin" size={40} color="var(--primary-color)" />
        </div>
      ) : (
        <div className="items-grid">
          {items.length > 0 ? (
            items.map(item => <ItemCard key={item.id} item={item} />)
          ) : (
            <div className="no-items" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#6b7280' }}>
              <p>You haven't posted any items yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyListings;
