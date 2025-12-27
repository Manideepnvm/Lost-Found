
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter }) => {
  const categories = ['All', 'Electronics', 'Clothing', 'Documents', 'Keys', 'Wallet', 'Other'];

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search for items..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-wrapper">
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
