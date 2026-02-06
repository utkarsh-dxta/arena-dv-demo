import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import './Plans.css';

const Plans = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.getProducts();
        const allProducts = response.products || response || [];
        // Filter for plans/subscriptions
        const plans = allProducts.filter(p => 
          p.category?.toLowerCase().includes('plan') || 
          p.type?.toLowerCase().includes('plan') ||
          p.name?.toLowerCase().includes('plan')
        );
        setProducts(plans.length > 0 ? plans : allProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    addToCart(plan);
    navigate('/checkout');
  };

  const defaultPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      description: 'Perfect for personal use',
      features: ['5GB Data', 'Unlimited Calls', 'Basic Support', '100 SMS'],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 59,
      description: 'Great for professionals',
      features: ['25GB Data', 'Unlimited Calls', 'Priority Support', 'Unlimited SMS', '5G Access'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'For teams and businesses',
      features: ['Unlimited Data', 'Unlimited Calls', '24/7 Premium Support', 'Unlimited SMS', '5G Access', 'International Roaming'],
      popular: false
    }
  ];

  const displayPlans = products.length > 0 ? products : defaultPlans;

  if (loading) {
    return (
      <div className="plans-page">
        <div className="loading-container">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-page">
      <div className="plans-header">
        <div className="header-content">
          <span className="plans-badge">Pricing</span>
          <h1>Choose Your Perfect Plan</h1>
          <p>Simple, transparent pricing that grows with you</p>
        </div>
        <div className="billing-toggle">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className="save-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="plans-container">
        <div className="plans-grid">
          {displayPlans.map((plan, index) => (
            <div 
              key={plan.id || index} 
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">
                  {billingCycle === 'yearly' 
                    ? Math.round((parseFloat(plan.price) || 49) * 0.8) 
                    : (parseFloat(plan.price) || 49)}
                </span>
                <span className="period">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <ul className="plan-features">
                {(plan.features || [
                  'High-speed data',
                  'Unlimited calls',
                  'Customer support',
                  'SMS included'
                ]).map((feature, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`plan-btn ${plan.popular ? 'primary' : 'secondary'}`}
                onClick={() => handleSelectPlan(plan)}
              >
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="features-comparison">
        <div className="comparison-container">
          <h2>All Plans Include</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h4>5G Network</h4>
              <p>Lightning-fast speeds everywhere</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
              </div>
              <h4>Secure Connection</h4>
              <p>Enterprise-grade encryption</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <h4>24/7 Support</h4>
              <p>Always here when you need us</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </div>
              <h4>Global Coverage</h4>
              <p>Stay connected worldwide</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <details className="faq-item">
              <summary>Can I switch plans anytime?</summary>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </details>
            <details className="faq-item">
              <summary>Is there a contract or commitment?</summary>
              <p>No contracts! All our plans are month-to-month with no long-term commitment required.</p>
            </details>
            <details className="faq-item">
              <summary>What payment methods do you accept?</summary>
              <p>We accept all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay.</p>
            </details>
            <details className="faq-item">
              <summary>How do I cancel my subscription?</summary>
              <p>You can cancel anytime from your dashboard. No cancellation fees or penalties apply.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plans;

