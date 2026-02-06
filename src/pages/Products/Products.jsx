import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import useDataLayer from '../../hooks/useDataLayer';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  const { 
    trackProductsPage, 
    trackProductImpressions, 
    trackFilterApplied, 
    trackSortApplied,
    trackSearchResults 
  } = useDataLayer();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        // API service now returns arrays directly
        setProducts(Array.isArray(productsRes) ? productsRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to get normalized product field
  const getProductField = (product, field) => {
    const fieldMappings = {
      name: ['Product_Name', 'name', 'product_name'],
      description: ['Product_Description', 'description', 'product_description'],
      price: ['Product_Price', 'price', 'product_price'],
      categoryId: ['Category_Id', 'category_id', 'categoryId'],
      id: ['Product_Id', 'id', 'product_id'],
    };
    
    for (const key of fieldMappings[field] || []) {
      if (product[key] !== undefined) return product[key];
    }
    return '';
  };

  // Build a map from Category_Name to Category_Id for filtering
  const categoryNameToId = {};
  categories.forEach(cat => {
    const name = cat.Category_Name || cat.name || '';
    const id = cat.Category_Id || cat.id || '';
    if (name && id) {
      categoryNameToId[name.toLowerCase()] = id;
    }
  });

  const filteredProducts = products
    .filter(product => {
      const productCategoryId = getProductField(product, 'categoryId');
      const productName = getProductField(product, 'name');
      const productDescription = getProductField(product, 'description');
      
      // Convert selected category name to category ID for comparison
      const selectedCategoryId = selectedCategory ? categoryNameToId[selectedCategory.toLowerCase()] : '';
      
      const matchesCategory = !selectedCategory || 
        productCategoryId === selectedCategoryId;
      const matchesSearch = !searchQuery || 
        productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        productDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = parseFloat(getProductField(a, 'price')) || 0;
      const priceB = parseFloat(getProductField(b, 'price')) || 0;
      const nameA = getProductField(a, 'name') || '';
      const nameB = getProductField(b, 'name') || '';
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'name':
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

  const handleCategoryChange = (category) => {
    if (category) {
      searchParams.set('category', category);
      trackFilterApplied('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    trackSortApplied(newSortBy);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // Track page view and product impressions when products load
  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      if (searchQuery) {
        trackSearchResults(searchQuery, filteredProducts.length);
      } else {
        trackProductsPage({
          search: searchQuery,
          category: selectedCategory,
          sort: sortBy,
          resultsCount: filteredProducts.length,
        });
      }
      trackProductImpressions(filteredProducts, 'products_listing');
    }
  }, [loading, filteredProducts.length, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-content">
          <h1>Our Products</h1>
          <p>Discover our range of telecom solutions and devices</p>
        </div>
        <div className="header-bg-pattern"></div>
      </div>

      <div className="products-container">
        <aside className="products-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Products
              </button>
              {categories.map((category, index) => {
                const categoryName = category.Category_Name || category.name || category.category_name || (typeof category === 'string' ? category : '');
                const categoryId = category.Category_Id || category.id || index;
                
                return (
                  <button
                    key={categoryId}
                    className={`filter-option ${selectedCategory === categoryName ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(categoryName)}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedCategory || searchQuery) && (
            <button className="clear-filters" onClick={clearFilters}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Clear Filters
            </button>
          )}
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <div className="results-count">
              {searchQuery && (
                <span className="search-term">Results for "{searchQuery}"</span>
              )}
              <span>{filteredProducts.length} products</span>
            </div>
            <div className="sort-control">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="btn-reset" onClick={clearFilters}>
                View All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

