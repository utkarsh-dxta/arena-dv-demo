import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import useDataLayer from '../../hooks/useDataLayer';
import Moengage from '@moengage/web-sdk';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { trackProductDetail } = useDataLayer();

  // Helper to get normalized product field
  const getProductField = (prod, field) => {
    if (!prod) return '';
    const fieldMappings = {
      name: ['Product_Name', 'name', 'product_name'],
      description: ['Product_Description', 'description', 'product_description'],
      price: ['Product_Price', 'price', 'product_price'],
      originalPrice: ['Product_Original_Price', 'originalPrice', 'original_price'],
      image: ['Product_Image', 'image', 'product_image', 'Product_Thumbnail_Image'],
      detailImage: ['Product_Detail_Image', 'detail_image', 'Product_Image'],
      category: ['Category_Name', 'category', 'product_category'],
      id: ['Product_Id', 'id', 'product_id'],
      features: ['Product_Features', 'features', 'product_features'],
      specifications: ['Product_Specifications', 'specifications', 'specs'],
    };
    
    for (const key of fieldMappings[field] || []) {
      if (prod[key] !== undefined) return prod[key];
    }
    return '';
  };

  // Store category name for tracking
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch both products and categories
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        const allProducts = productsRes.products || productsRes || [];
        const allCategories = Array.isArray(categoriesRes) ? categoriesRes : [];
        
        // Build category ID to Name lookup
        const categoryIdToName = {};
        allCategories.forEach(cat => {
          const catId = cat.Category_Id || cat.id || '';
          const catName = cat.Category_Name || cat.name || '';
          if (catId && catName) {
            categoryIdToName[catId] = catName;
          }
        });
        
        // Find the product by ID
        const foundProduct = allProducts.find(p => {
          const productId = getProductField(p, 'id');
          return String(productId) === String(id);
        });

        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get category name from Category_Id
          const catId = foundProduct.Category_Id || foundProduct.category_id || '';
          const resolvedCategoryName = categoryIdToName[catId] || catId;
          setCategoryName(resolvedCategoryName);
          
          // Get related products from same category
          const related = allProducts.filter(p => {
            const pCatId = p.Category_Id || p.category_id || '';
            const pId = getProductField(p, 'id');
            return pCatId === catId && String(pId) !== String(id);
          }).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Track product view when product data is loaded
  useEffect(() => {
    if (product && !loading && categoryName) {
      const productId = getProductField(product, 'id');
      const productName = getProductField(product, 'name');
      const productPrice = parseFloat(getProductField(product, 'price')) || 0;
      const productBrand = product.Product_Brand || product.brand || 'NexTel';

      // Track with Tealium Data Layer
      trackProductDetail(product);

      // Track with MoEngage
      Moengage.track_event("Product Viewed", {
        "product_id": productId,
        "product_name": productName,
        "price": productPrice,
        "category": categoryName,
        "brand": productBrand
      });
    }
  }, [product, loading, categoryName]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        id: getProductField(product, 'id'),
        name: getProductField(product, 'name'),
        price: getProductField(product, 'price'),
        image: getProductField(product, 'image'),
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="pdp-page">
        <div className="loading-container">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-page">
        <div className="not-found">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const productName = getProductField(product, 'name');
  const productDescription = getProductField(product, 'description');
  const productPrice = parseFloat(getProductField(product, 'price')) || 0;
  const productOriginalPrice = getProductField(product, 'originalPrice');
  const productImage = getProductField(product, 'detailImage') || getProductField(product, 'image');
  const productFeatures = getProductField(product, 'features');

  return (
    <div className="pdp-page">
      <div className="pdp-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/products">Products</Link>
          {categoryName && (
            <>
              <span className="separator">/</span>
              <Link to={`/products?category=${encodeURIComponent(categoryName)}`}>
                {categoryName}
              </Link>
            </>
          )}
          <span className="separator">/</span>
          <span className="current">{productName}</span>
        </nav>

        <div className="pdp-content">
          {/* Product Image */}
          <div className="pdp-gallery">
            <div className="main-image">
              {productImage ? (
                <img src={productImage} alt={productName} />
              ) : (
                <div className="image-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15L16 10L5 21"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info">
            {categoryName && (
              <span className="product-category">{categoryName}</span>
            )}
            <h1 className="product-title">{productName}</h1>
            
            <div className="product-pricing">
              <span className="current-price">${productPrice.toFixed(2)}</span>
              {productOriginalPrice && (
                <>
                  <span className="original-price">${parseFloat(productOriginalPrice).toFixed(2)}</span>
                  <span className="discount-badge">
                    {Math.round((1 - productPrice / parseFloat(productOriginalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {productDescription && (
              <div className="product-description">
                <p>{productDescription}</p>
              </div>
            )}

            {/* Features */}
            {productFeatures && (
              <div className="product-features">
                <h3>Features</h3>
                <ul>
                  {(Array.isArray(productFeatures) ? productFeatures : productFeatures.split(','))
                    .map((feature, index) => (
                      <li key={index}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l5 5L20 7"/>
                        </svg>
                        {feature.trim()}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pdp-actions">
              <button 
                className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>Free Shipping</span>
              </div>
              <div className="badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 12a11.05 11.05 0 00-22 0zm-5 7a3 3 0 01-6 0v-7"/>
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map((prod, index) => {
                const relatedId = getProductField(prod, 'id') || index;
                const relatedName = getProductField(prod, 'name');
                const relatedPrice = parseFloat(getProductField(prod, 'price')) || 0;
                const relatedImage = getProductField(prod, 'image');

                return (
                  <Link 
                    key={relatedId} 
                    to={`/products/${relatedId}`}
                    className="related-card"
                  >
                    <div className="related-image">
                      {relatedImage ? (
                        <img src={relatedImage} alt={relatedName} />
                      ) : (
                        <div className="image-placeholder-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="related-info">
                      <h4>{relatedName}</h4>
                      <span className="related-price">${relatedPrice.toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

