import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useDataLayer from '../../hooks/useDataLayer';
import './Upgrades.css';

const Upgrades = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState([]);
  const { addToCart } = useCart();

  const {
    trackUpgradesPage,
    trackUpgradeSelected,
    trackUpgradeComparison,
    trackUpgradeCtaClick,
    trackCtaClick,
  } = useDataLayer();

  useEffect(() => {
    trackUpgradesPage();
  }, [trackUpgradesPage]);

  const upgradeCategories = [
    { id: 'all', label: 'All Upgrades', icon: '⚡' },
    { id: 'device', label: 'Device Upgrades', icon: '📱' },
    { id: 'plan', label: 'Plan Upgrades', icon: '📶' },
    { id: 'addon', label: 'Add-ons', icon: '🔧' },
    { id: 'speed', label: 'Speed Boosts', icon: '🚀' },
  ];

  const upgrades = [
    {
      id: 'device-1',
      name: 'Premium Smartphone Upgrade',
      description: 'Upgrade to the latest flagship device with 5G support, AI camera, and all-day battery.',
      price: 199,
      originalPrice: 399,
      type: 'device',
      category: 'device',
      popular: true,
      features: ['Latest 5G Chipset', '200MP AI Camera', '5000mAh Battery', '256GB Storage'],
      savings: '50%',
      badge: 'Best Value',
    },
    {
      id: 'device-2',
      name: 'Smart Tablet Bundle',
      description: 'Get a premium tablet with cellular connectivity included in your plan.',
      price: 149,
      originalPrice: 299,
      type: 'device',
      category: 'device',
      popular: false,
      features: ['12.9" Display', 'Cellular + WiFi', 'Stylus Included', '128GB Storage'],
      savings: '50%',
      badge: null,
    },
    {
      id: 'plan-1',
      name: 'Unlimited Pro Plan',
      description: 'Upgrade to unlimited data with premium streaming and international roaming.',
      price: 79,
      originalPrice: 99,
      type: 'plan',
      category: 'plan',
      popular: true,
      features: ['Unlimited 5G Data', 'HD Streaming', '50GB Hotspot', 'International Roaming'],
      savings: '20%',
      badge: 'Most Popular',
    },
    {
      id: 'plan-2',
      name: 'Family Plan Upgrade',
      description: 'Add up to 5 lines with shared data pool and family controls.',
      price: 129,
      originalPrice: 179,
      type: 'plan',
      category: 'plan',
      popular: false,
      features: ['Up to 5 Lines', '200GB Shared Data', 'Family Controls', 'Priority Support'],
      savings: '28%',
      badge: null,
    },
    {
      id: 'addon-1',
      name: 'International Calling Pack',
      description: 'Unlimited calls to 80+ countries. Stay connected with family worldwide.',
      price: 15,
      originalPrice: 25,
      type: 'addon',
      category: 'addon',
      popular: false,
      features: ['80+ Countries', 'Unlimited Minutes', 'No Hidden Fees', 'Instant Activation'],
      savings: '40%',
      badge: null,
    },
    {
      id: 'addon-2',
      name: 'Cloud Storage Plus',
      description: '2TB cloud storage with automatic backup for all your devices.',
      price: 9.99,
      originalPrice: 14.99,
      type: 'addon',
      category: 'addon',
      popular: false,
      features: ['2TB Storage', 'Auto Backup', 'Cross-device Sync', 'End-to-end Encryption'],
      savings: '33%',
      badge: null,
    },
    {
      id: 'speed-1',
      name: '5G Ultra Speed Boost',
      description: 'Priority 5G access with speeds up to 3 Gbps during peak hours.',
      price: 19.99,
      originalPrice: 29.99,
      type: 'speed',
      category: 'speed',
      popular: true,
      features: ['Up to 3 Gbps', 'Priority Network Access', 'Ultra-low Latency', 'Gaming Mode'],
      savings: '33%',
      badge: 'New',
    },
    {
      id: 'speed-2',
      name: 'Home Internet Upgrade',
      description: 'Upgrade your home internet to fiber-fast 5G home broadband.',
      price: 49,
      originalPrice: 69,
      type: 'speed',
      category: 'speed',
      popular: false,
      features: ['1 Gbps Speed', '5G Home Router', 'Unlimited Data', 'Free Installation'],
      savings: '29%',
      badge: null,
    },
  ];

  const filteredUpgrades = selectedCategory === 'all'
    ? upgrades
    : upgrades.filter(u => u.category === selectedCategory);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    trackCtaClick(`filter_${categoryId}`, 'upgrades_filter', '');
  };

  const handleUpgradeSelect = (upgrade) => {
    trackUpgradeSelected(upgrade);
    trackUpgradeCtaClick('Get Upgrade', upgrade.name);
    addToCart({ ...upgrade, Product_Name: upgrade.name, Product_Price: upgrade.price });
  };

  const toggleCompare = (upgrade) => {
    setCompareItems(prev => {
      const exists = prev.find(item => item.id === upgrade.id);
      if (exists) {
        return prev.filter(item => item.id !== upgrade.id);
      }
      if (prev.length >= 3) return prev;
      const newItems = [...prev, upgrade];
      if (newItems.length === 2) {
        trackUpgradeComparison(newItems[0].name, newItems[1].name);
      }
      return newItems;
    });
  };

  return (
    <div className="upgrades-page">
      {/* Hero Section */}
      <section className="upgrades-hero">
        <div className="upgrades-hero-bg">
          <div className="upgrades-gradient"></div>
          <div className="upgrades-grid-bg"></div>
        </div>
        <div className="upgrades-hero-content">
          <span className="upgrades-badge">
            <span className="pulse-dot"></span>
            Exclusive Offers
          </span>
          <h1>Upgrade Your <span className="highlight">Experience</span></h1>
          <p>Unlock premium features, faster speeds, and the latest devices at unbeatable prices.</p>
          <div className="upgrades-hero-stats">
            <div className="stat-item">
              <span className="stat-number">50%</span>
              <span className="stat-text">Max Savings</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">8+</span>
              <span className="stat-text">Upgrades</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-text">Contracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="upgrades-filters">
        <div className="container">
          <div className="filters-bar">
            <div className="category-tabs">
              {upgradeCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span className="tab-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              className={`compare-toggle ${compareMode ? 'active' : ''}`}
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareItems([]);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              {compareMode ? 'Exit Compare' : 'Compare'}
            </button>
          </div>
        </div>
      </section>

      {/* Compare Bar */}
      {compareMode && compareItems.length > 0 && (
        <div className="compare-bar">
          <div className="container">
            <div className="compare-bar-inner">
              <span className="compare-count">{compareItems.length}/3 selected</span>
              <div className="compare-items">
                {compareItems.map(item => (
                  <span key={item.id} className="compare-chip">
                    {item.name}
                    <button onClick={() => toggleCompare(item)}>×</button>
                  </span>
                ))}
              </div>
              {compareItems.length >= 2 && (
                <button className="compare-btn-action">
                  Compare Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrades Grid */}
      <section className="upgrades-listing">
        <div className="container">
          <div className="upgrades-grid">
            {filteredUpgrades.map((upgrade, index) => (
              <div
                key={upgrade.id}
                className={`upgrade-card ${upgrade.popular ? 'popular' : ''} ${compareItems.find(i => i.id === upgrade.id) ? 'selected-compare' : ''}`}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                {upgrade.badge && (
                  <div className="upgrade-badge">{upgrade.badge}</div>
                )}
                {compareMode && (
                  <button
                    className={`compare-check ${compareItems.find(i => i.id === upgrade.id) ? 'checked' : ''}`}
                    onClick={() => toggleCompare(upgrade)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </button>
                )}
                <div className="upgrade-type-badge">{upgrade.type}</div>
                <h3>{upgrade.name}</h3>
                <p className="upgrade-desc">{upgrade.description}</p>
                <div className="upgrade-pricing">
                  <div className="price-current">
                    <span className="currency">$</span>
                    <span className="amount">{upgrade.price}</span>
                    <span className="period">/mo</span>
                  </div>
                  <div className="price-original">${upgrade.originalPrice}/mo</div>
                  <div className="savings-tag">Save {upgrade.savings}</div>
                </div>
                <ul className="upgrade-features">
                  {upgrade.features.map((feature, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`upgrade-btn ${upgrade.popular ? 'primary' : 'secondary'}`}
                  onClick={() => handleUpgradeSelect(upgrade)}
                >
                  Get This Upgrade
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="upgrade-how-it-works">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-badge">Simple Process</span>
            <h2>How Upgrades Work</h2>
            <p>Three simple steps to upgrade your NexTel experience</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h4>Choose Your Upgrade</h4>
              <p>Browse our selection of device, plan, and add-on upgrades.</p>
            </div>
            <div className="step-connector">
              <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 12h40M34 6l6 6-6 6" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4>Confirm & Pay</h4>
              <p>Review your upgrade details and complete payment securely.</p>
            </div>
            <div className="step-connector">
              <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 12h40M34 6l6 6-6 6" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h4>Enjoy Instantly</h4>
              <p>Your upgrade activates immediately. Start enjoying right away!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="upgrades-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Not Sure Which Upgrade Is Right For You?</h2>
            <p>Our experts are available 24/7 to help you find the perfect upgrade for your needs.</p>
            <div className="cta-actions">
              <Link
                to="/faq"
                className="btn btn-primary"
                onClick={() => trackCtaClick('Visit FAQ', 'upgrades_cta', '/faq')}
              >
                Visit FAQ
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/plans" className="btn btn-secondary">
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upgrades;

