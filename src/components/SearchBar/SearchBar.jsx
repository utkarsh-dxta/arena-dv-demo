import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data.products || data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Helper to get normalized product field
  const getProductField = (product, field) => {
    const fieldMappings = {
      name: ['Product_Name', 'name', 'product_name'],
      price: ['Product_Price', 'price', 'product_price'],
      image: ['Product_Image', 'image', 'product_image', 'Product_Thumbnail_Image'],
      id: ['Product_Id', 'id', 'product_id'],
    };
    
    for (const key of fieldMappings[field] || []) {
      if (product[key] !== undefined) return product[key];
    }
    return '';
  };

  const handleResultClick = (product) => {
    setIsOpen(false);
    setQuery('');
    const productId = getProductField(product, 'id');
    navigate(`/products/${productId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </button>
      </form>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.slice(0, 6).map((product, index) => {
                const productId = getProductField(product, 'id') || index;
                const productName = getProductField(product, 'name');
                const productImage = getProductField(product, 'image');
                const productPrice = getProductField(product, 'price');
                
                return (
                  <button
                    key={productId}
                    className="search-result-item"
                    onClick={() => handleResultClick(product)}
                  >
                    {productImage && (
                      <img src={productImage} alt={productName} className="result-image" />
                    )}
                    <div className="result-info">
                      <span className="result-name">{productName}</span>
                      <span className="result-price">${productPrice}</span>
                    </div>
                  </button>
                );
              })}
            </>
          ) : query.length >= 2 ? (
            <div className="search-no-results">
              No products found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

