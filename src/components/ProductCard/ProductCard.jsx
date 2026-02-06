import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Normalize product data from various API formats
  const normalizedProduct = {
    id: product.Product_Id || product.id || product.product_id,
    name: product.Product_Name || product.name || product.product_name || 'Product',
    description: product.Product_Description || product.description || product.product_description || '',
    price: product.Product_Price || product.price || product.product_price || 0,
    originalPrice: product.Product_Original_Price || product.originalPrice || product.original_price,
    image: product.Product_Image || product.image || product.product_image || product.Product_Thumbnail_Image,
    category: product.Category_Name || product.category || product.product_category || '',
    badge: product.Product_Badge || product.badge || product.product_badge,
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      id: normalizedProduct.id,
      name: normalizedProduct.name,
      price: normalizedProduct.price,
      image: normalizedProduct.image,
    });
  };

  const price = parseFloat(normalizedProduct.price) || 0;
  const originalPrice = normalizedProduct.originalPrice ? parseFloat(normalizedProduct.originalPrice) : null;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${normalizedProduct.id}`)}>
      <div className="product-image">
        {normalizedProduct.image ? (
          <img src={normalizedProduct.image} alt={normalizedProduct.name} />
        ) : (
          <div className="image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15L16 10L5 21"/>
            </svg>
          </div>
        )}
        {normalizedProduct.badge && (
          <span className="product-badge">{normalizedProduct.badge}</span>
        )}
      </div>
      <div className="product-info">
        {normalizedProduct.category && (
          <span className="product-category">{normalizedProduct.category}</span>
        )}
        <h3 className="product-name">{normalizedProduct.name}</h3>
        {normalizedProduct.description && (
          <p className="product-description">{normalizedProduct.description}</p>
        )}
        <div className="product-footer">
          <div className="product-price">
            <span className="price-amount">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="price-original">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

