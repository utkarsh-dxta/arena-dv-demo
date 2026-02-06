import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import useDataLayer from '../../hooks/useDataLayer';
import './Home.css';

const Home = () => {
  const [appData, setAppData] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { trackHomePage, trackProductImpressions, trackCtaClick } = useDataLayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appDataRes, productsRes, categoriesRes] = await Promise.all([
          api.getAppData(),
          api.getProducts(),
          api.getCategories()
        ]);
        setAppData(appDataRes);
        // API service now returns arrays directly
        const productsArray = Array.isArray(productsRes) ? productsRes : [];
        setProducts(productsArray);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        
        // Track product impressions when data loads
        if (productsArray.length > 0) {
          trackProductImpressions(productsArray.slice(0, 8), 'home_featured');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Track home page view when component mounts
  useEffect(() => {
    if (!loading) {
      trackHomePage();
    }
  }, [loading, trackHomePage]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <p>Loading amazing deals...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse"></span>
            New Plans Available
          </div>
          <h1 className="hero-title">
            Connect to the <span className="highlight">Future</span>
          </h1>
          <p className="hero-subtitle">
            Experience lightning-fast connectivity with our premium telecom solutions. 
            Unlimited data, crystal-clear calls, and exclusive offers await you.
          </p>
          <div className="hero-actions">
            <Link 
              to="/products" 
              className="btn btn-primary"
              onClick={() => trackCtaClick('Explore Products', 'hero', '/products')}
            >
              Explore Products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link 
              to="/plans" 
              className="btn btn-secondary"
              onClick={() => trackCtaClick('View Plans', 'hero', '/plans')}
            >
              View Plans
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-value">5G</span>
              <span className="stat-label">Network</span>
            </div>
            <div className="stat">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="device-mockup">
            <div className="device-screen">
              <div className="signal-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="speed-indicator">
                <span className="speed-value">1.2</span>
                <span className="speed-unit">Gbps</span>
              </div>
            </div>
          </div>
          <div className="floating-cards">
            <div className="float-card card-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>Ultra Fast</span>
            </div>
            <div className="float-card card-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              <span>Secure</span>
            </div>
            <div className="float-card card-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>Reliable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <p>Find the perfect solution for your needs</p>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 6).map((category, index) => {
              const categoryName = category.Category_Name || category.name || category.category_name || (typeof category === 'string' ? category : '');
              const categoryId = category.Category_Id || category.id || index;
              const categoryImage = category.Category_Thumbnail_Image || category.image || category.thumbnail;
              
              return (
                <Link 
                  key={categoryId} 
                  to={`/products?category=${encodeURIComponent(categoryName)}`}
                  className="category-card"
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="category-icon">
                    {categoryImage ? (
                      <img src={categoryImage} alt={categoryName} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    )}
                  </div>
                  <h3>{categoryName}</h3>
                  <span className="category-arrow">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>Why Choose NexTel?</h2>
              <p>We deliver cutting-edge technology with unmatched reliability and customer service.</p>
              <ul className="features-list">
                <li>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Lightning Fast Speeds</h4>
                    <p>Experience blazing 5G speeds up to 1.2 Gbps</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Enterprise Security</h4>
                    <p>Military-grade encryption for all your data</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>24/7 Support</h4>
                    <p>Our team is always here to help you</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="features-visual">
              <div className="network-animation">
                <div className="node central"></div>
                <div className="node n1"></div>
                <div className="node n2"></div>
                <div className="node n3"></div>
                <div className="node n4"></div>
                <div className="connection c1"></div>
                <div className="connection c2"></div>
                <div className="connection c3"></div>
                <div className="connection c4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join millions of satisfied customers and experience the NexTel difference today.</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Account
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

