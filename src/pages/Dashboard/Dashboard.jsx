import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useDataLayer from '../../hooks/useDataLayer';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { trackDashboardPage, trackLogout } = useDataLayer();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id && !user?.email) {
        setLoading(false);
        return;
      }

      try {
        const userId = user.id || user.email;
        const [ordersRes, offersRes] = await Promise.all([
          api.getUserOrders(userId),
          api.getUserOffers(userId)
        ]);
        // API service now returns arrays directly
        setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        setOffers(Array.isArray(offersRes) ? offersRes : []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Track dashboard page view
  useEffect(() => {
    if (!loading) {
      trackDashboardPage(activeTab);
    }
  }, [loading, activeTab, trackDashboardPage]);

  const handleLogout = () => {
    trackLogout();
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'offers', label: 'My Offers', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Logout
        </button>
      </div>

      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="welcome-text">Here's what's happening with your account.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z"/>
                    <path d="M5 12h14M5 12a2 2 0 110-4h14a2 2 0 110 4"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{offers.length}</span>
                  <span className="stat-label">Active Offers</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-value">Premium</span>
                  <span className="stat-label">Account Status</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/products" className="action-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  <span>Browse Products</span>
                </Link>
                <Link to="/plans" className="action-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  <span>View Plans</span>
                </Link>
                <button className="action-card" onClick={() => setActiveTab('orders')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  </svg>
                  <span>Track Orders</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('settings')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {offers.length > 0 && (
              <div className="recent-offers">
                <h2>Your Special Offers</h2>
                <div className="offers-preview">
                  {offers.slice(0, 3).map((offer, index) => (
                    <div key={offer.id || index} className="offer-card">
                      <div className="offer-discount">{offer.discount || '20%'} OFF</div>
                      <h4>{offer.name || offer.title || 'Special Offer'}</h4>
                      <p>{offer.description || 'Limited time offer on selected products'}</p>
                      <span className="offer-code">Code: {offer.code || 'NEXTEL20'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <h1>My Orders</h1>
            <p className="welcome-text">Track and manage your orders</p>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading orders...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order, index) => (
                  <div key={order.id || index} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <span className="label">Order ID</span>
                        <span className="value">#{order.id || `ORD-${1000 + index}`}</span>
                      </div>
                      <div className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || 'Pending'}
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="order-items">
                        {order.items?.map((item, i) => (
                          <span key={i}>{item.name}</span>
                        )) || <span>{order.productName || 'Product'}</span>}
                      </div>
                      <div className="order-meta">
                        <span className="order-date">
                          {order.date || new Date().toLocaleDateString()}
                        </span>
                        <span className="order-total">
                          ${order.total || order.amount || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <path d="M12 12v4M10 14h4"/>
                </svg>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <Link to="/products" className="btn-primary">Browse Products</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="dashboard-content">
            <h1>My Offers</h1>
            <p className="welcome-text">Exclusive deals just for you</p>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading offers...</span>
              </div>
            ) : offers.length > 0 ? (
              <div className="offers-grid">
                {offers.map((offer, index) => (
                  <div key={offer.id || index} className="offer-detail-card">
                    <div className="offer-badge">{offer.discount || '20%'} OFF</div>
                    <h3>{offer.name || offer.title || 'Special Offer'}</h3>
                    <p>{offer.description || 'Get amazing discounts on selected products'}</p>
                    <div className="offer-footer">
                      <div className="offer-code-box">
                        <span className="code-label">Promo Code</span>
                        <span className="code-value">{offer.code || 'NEXTEL20'}</span>
                      </div>
                      <span className="offer-expiry">
                        Expires: {offer.expiry || '30 days'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z"/>
                  <path d="M5 12h14"/>
                </svg>
                <h3>No offers available</h3>
                <p>Check back later for exclusive deals</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <h1>Account Settings</h1>
            <p className="welcome-text">Manage your account preferences</p>

            <div className="settings-section">
              <h2>Profile Information</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name || ''} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user?.email || ''} placeholder="Your email" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue={user?.phone || ''} placeholder="Your phone" />
                </div>
                <button className="save-btn">Save Changes</button>
              </div>
            </div>

            <div className="settings-section">
              <h2>Notifications</h2>
              <div className="toggle-options">
                <label className="toggle-option">
                  <span>Email notifications</span>
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-switch"></span>
                </label>
                <label className="toggle-option">
                  <span>SMS notifications</span>
                  <input type="checkbox" />
                  <span className="toggle-switch"></span>
                </label>
                <label className="toggle-option">
                  <span>Promotional offers</span>
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

