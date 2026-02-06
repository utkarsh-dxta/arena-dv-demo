import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useDataLayer from '../../hooks/useDataLayer';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const { 
    trackCheckoutPage, 
    trackBeginCheckout, 
    trackCheckoutStep, 
    trackPurchase 
  } = useDataLayer();

  // Track checkout page view and begin checkout
  useEffect(() => {
    if (cartItems.length > 0) {
      trackCheckoutPage(cartItems, step);
      if (step === 1) {
        trackBeginCheckout(cartItems);
      }
    }
  }, []);

  // Track checkout step changes
  useEffect(() => {
    if (cartItems.length > 0 && step > 1) {
      const stepNames = ['', 'shipping', 'payment', 'review'];
      trackCheckoutStep(step, stepNames[step] || `step_${step}`, cartItems);
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: user?.id || user?.email,
        items: cartItems,
        total: cartTotal,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      const response = await api.createOrder(orderData);
      
      // Track purchase event
      trackPurchase({ 
        Order_Id: response.orderId, 
        total: cartTotal,
        Order_Status: 'confirmed' 
      }, cartItems);
      
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order error:', error);
      // Still track purchase for demo purposes
      trackPurchase({ 
        Order_Id: `ORD-${Date.now()}`, 
        total: cartTotal,
        Order_Status: 'confirmed' 
      }, cartItems);
      clearCart();
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to continue with checkout</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <div className="checkout-steps">
              <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Shipping</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Payment</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Review</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                <button type="button" className="btn-next" onClick={() => setStep(2)}>
                  Continue to Payment
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h2>Payment Details</h2>
                <div className="payment-methods">
                  <label className="payment-method active">
                    <input type="radio" name="payment" defaultChecked />
                    <span className="method-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </span>
                    <span>Credit Card</span>
                  </label>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Expiry Date</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvc">CVC</label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="step-buttons">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>
                  <button type="button" className="btn-next" onClick={() => setStep(3)}>
                    Review Order
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section">
                <h2>Review Your Order</h2>
                <div className="review-section">
                  <div className="review-block">
                    <h3>Shipping Address</h3>
                    <p>{formData.name}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.zipCode}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                  <div className="review-block">
                    <h3>Payment Method</h3>
                    <p>Credit Card ending in {formData.cardNumber.slice(-4) || '****'}</p>
                  </div>
                </div>
                <div className="review-items">
                  <h3>Order Items</h3>
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="review-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="step-buttons">
                  <button type="button" className="btn-back" onClick={() => setStep(2)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l5 5L20 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <aside className="checkout-sidebar">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={item.id || index} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="secure-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <div>
              <strong>Secure Checkout</strong>
              <span>256-bit SSL encrypted</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

