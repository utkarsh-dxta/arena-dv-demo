import { useState, useEffect } from 'react';
import useDataLayer from '../../hooks/useDataLayer';
import './FAQ.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    trackFaqPage,
    trackFaqExpanded,
    trackFaqCategoryFilter,
    trackSupportFormSubmit,
    trackSupportFormInteraction,
  } = useDataLayer();

  useEffect(() => {
    trackFaqPage();
  }, [trackFaqPage]);

  const faqCategories = [
    { id: 'all', label: 'All Topics', icon: 'grid' },
    { id: 'account', label: 'Account', icon: 'user' },
    { id: 'billing', label: 'Billing', icon: 'credit-card' },
    { id: 'plans', label: 'Plans & Data', icon: 'signal' },
    { id: 'devices', label: 'Devices', icon: 'smartphone' },
    { id: 'network', label: 'Network', icon: 'wifi' },
    { id: 'support', label: 'Support', icon: 'headphones' },
  ];

  const faqs = [
    // Account
    {
      id: 'acc-1',
      category: 'account',
      question: 'How do I create a NexTel account?',
      answer: 'Creating an account is simple! Click "Sign Up" on our homepage, fill in your personal details including name, email, and phone number, then verify your email address. You can start exploring plans and products immediately after registration.',
    },
    {
      id: 'acc-2',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click "Forgot Password." Enter your registered email address and we\'ll send you a secure link to reset your password. The link expires in 24 hours for security purposes.',
    },
    {
      id: 'acc-3',
      category: 'account',
      question: 'Can I change my account email address?',
      answer: 'Yes! Navigate to your Dashboard > Account Settings > Personal Information. You can update your email address there. You\'ll need to verify the new email before the change takes effect.',
    },
    {
      id: 'acc-4',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'We\'re sorry to see you go! To delete your account, contact our support team through the form below or call us at 1-800-NEXTEL. Please note that account deletion is permanent and all data will be removed after 30 days.',
    },
    // Billing
    {
      id: 'bill-1',
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, Apple Pay, Google Pay, and bank transfers. You can manage your payment methods in Dashboard > Billing.',
    },
    {
      id: 'bill-2',
      category: 'billing',
      question: 'When will I be charged for my plan?',
      answer: 'Your billing cycle starts on the day you activate your plan. You\'ll be charged on the same date each month. For annual plans, you\'re charged once per year. You can view your next billing date in Dashboard > Billing.',
    },
    {
      id: 'bill-3',
      category: 'billing',
      question: 'How do I view my billing history?',
      answer: 'Log in to your account and go to Dashboard > Billing > History. You\'ll see a complete list of all transactions, invoices, and payment receipts. You can also download PDF invoices for each billing period.',
    },
    {
      id: 'bill-4',
      category: 'billing',
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all new plans. For device purchases, returns are accepted within 14 days of delivery in original condition. Contact support for refund processing.',
    },
    // Plans & Data
    {
      id: 'plan-1',
      category: 'plans',
      question: 'Can I change my plan at any time?',
      answer: 'Absolutely! You can upgrade or downgrade your plan anytime from Dashboard > My Plan. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle. No penalties or fees apply.',
    },
    {
      id: 'plan-2',
      category: 'plans',
      question: 'What happens when I exceed my data limit?',
      answer: 'If you exceed your data limit, your speed will be reduced to 128 Kbps until your next billing cycle. You won\'t incur any overage charges. You can purchase a data add-on or upgrade your plan to continue at full speed.',
    },
    {
      id: 'plan-3',
      category: 'plans',
      question: 'Do you offer family plans?',
      answer: 'Yes! Our Family Plan lets you add up to 5 lines with shared data, individual numbers, and family controls. Each line gets its own data allocation and you save up to 30% compared to individual plans.',
    },
    {
      id: 'plan-4',
      category: 'plans',
      question: 'Is there a contract or commitment period?',
      answer: 'No! All NexTel plans are contract-free with no minimum commitment period. You pay month-to-month and can cancel anytime without any cancellation fees or penalties.',
    },
    // Devices
    {
      id: 'dev-1',
      category: 'devices',
      question: 'Can I bring my own device?',
      answer: 'Yes, you can bring your own unlocked device! Most modern smartphones are compatible with our network. You can check device compatibility on our website or contact support. We\'ll send you a free SIM card.',
    },
    {
      id: 'dev-2',
      category: 'devices',
      question: 'Do you offer device financing?',
      answer: 'Yes, we offer 0% interest financing on select devices for up to 24 months. You can split the cost into easy monthly payments added to your bill. No credit check required for existing customers.',
    },
    {
      id: 'dev-3',
      category: 'devices',
      question: 'What is the device return policy?',
      answer: 'You can return any device within 14 days of purchase for a full refund, provided it\'s in original condition with all accessories. Devices with physical damage are not eligible for returns.',
    },
    // Network
    {
      id: 'net-1',
      category: 'network',
      question: 'What areas does your 5G network cover?',
      answer: 'Our 5G network covers over 95% of urban areas and is rapidly expanding to suburban and rural regions. Check our coverage map on the website or app for detailed coverage information in your area.',
    },
    {
      id: 'net-2',
      category: 'network',
      question: 'What speeds can I expect on your network?',
      answer: 'On our 5G network, typical download speeds range from 100 Mbps to 1 Gbps, with peak speeds up to 3 Gbps in optimal conditions. 4G LTE speeds typically range from 25-100 Mbps.',
    },
    {
      id: 'net-3',
      category: 'network',
      question: 'Do you offer international roaming?',
      answer: 'Yes! Our Pro and Enterprise plans include international roaming in 80+ countries. Basic plan users can purchase a roaming add-on for $10/day. Data, calls, and texts are included.',
    },
    // Support
    {
      id: 'sup-1',
      category: 'support',
      question: 'How do I contact customer support?',
      answer: 'You can reach us through multiple channels: Use the support form below, call us at 1-800-NEXTEL (24/7), use our chatbot for instant help, email support@nextel.com, or visit any NexTel store.',
    },
    {
      id: 'sup-2',
      category: 'support',
      question: 'What are your support hours?',
      answer: 'Our customer support is available 24/7, 365 days a year. Phone and chat support is available round the clock. Email responses are typically within 2-4 hours during business days.',
    },
    {
      id: 'sup-3',
      category: 'support',
      question: 'How do I report a network issue?',
      answer: 'You can report network issues through the NexTel app, our chatbot, or by calling 1-800-NEXTEL. Please include your location and a description of the issue. Our network team monitors and resolves issues 24/7.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    trackFaqCategoryFilter(categoryId);
  };

  const toggleFaq = (faqId) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(faqId)) {
        next.delete(faqId);
      } else {
        next.add(faqId);
        const faq = faqs.find(f => f.id === faqId);
        if (faq) {
          trackFaqExpanded(faq.question, faq.category);
        }
      }
      return next;
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldFocus = (fieldName) => {
    trackSupportFormInteraction(fieldName);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    // Map form category to API-accepted categories
    const categoryMap = {
      account: 'Account',
      billing: 'Billing',
      plans: 'Plans & Data',
      devices: 'Devices',
      network: 'Network',
      other: 'Other',
    };

    const ticketPayload = {
      email: formData.email,
      subject: formData.subject,
      description: formData.message,
      priority: 5,
      status: 'open',
      channel: 'Web',
      category: categoryMap[formData.category] || 'Other',
    };

    console.log('[Support Form] Payload:', ticketPayload);

    try {
      const response = await fetch('https://contact-center.netlify.app/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const ticketId = data._id || data.id || data.ticketId || '';
      console.log('[Support Form] Ticket created, ID:', ticketId);

      // Fire data layer event with ticket ID from API response
      trackSupportFormSubmit({ ...formData, ticketId });

      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', category: '', subject: '', message: '' });
    } catch (err) {
      console.error('Ticket submission error:', err);
      setError('Failed to submit your query. Please try again or contact us at 1-800-NEXTEL.');
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      'credit-card': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      signal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V12M22 20V8"/></svg>,
      smartphone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
      wifi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>,
      headphones: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    };
    return icons[iconName] || icons.grid;
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-bg">
          <div className="faq-gradient"></div>
          <div className="faq-grid-bg"></div>
        </div>
        <div className="faq-hero-content">
          <span className="faq-badge">Help Center</span>
          <h1>Frequently Asked <span className="highlight">Questions</span></h1>
          <p>Find answers to common questions or reach out to our support team for help.</p>

          {/* Search Bar */}
          <div className="faq-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => handleFieldFocus('faq_search')}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="faq-categories-nav">
        <div className="container">
          <div className="categories-scroll">
            {faqCategories.map(cat => (
              <button
                key={cat.id}
                className={`faq-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span className="cat-icon">{getCategoryIcon(cat.icon)}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          {searchTerm && (
            <div className="search-results-info">
              <span>{filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found for "{searchTerm}"</span>
              <button onClick={() => setSearchTerm('')}>Clear search</button>
            </div>
          )}

          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`faq-item ${openItems.has(faq.id) ? 'open' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="faq-q-content">
                      <span className="faq-cat-tag">{faq.category}</span>
                      <h3>{faq.question}</h3>
                    </div>
                    <span className="faq-toggle">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>
                <h3>No results found</h3>
                <p>Try adjusting your search or browse by category above.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="support-form-section" id="support-form">
        <div className="container">
          <div className="support-form-wrapper">
            <div className="support-info">
              <span className="form-badge">Get in Touch</span>
              <h2>Still Have <span className="highlight">Questions?</span></h2>
              <p>
                Can't find what you're looking for? Fill out the form and our support team
                will get back to you within 24 hours.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <p>1-800-NEXTEL (24/7)</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <p>support@nextel.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4>Visit a Store</h4>
                    <p>Find a NexTel store near you</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="support-form-card">
              {formSubmitted ? (
                <div className="form-success">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Our support team will get back to you within 24 hours.</p>
                  <button
                    className="btn-reset"
                    onClick={() => setFormSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="support-form">
                  <h3>Submit a Query</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        onFocus={() => handleFieldFocus('name')}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        onFocus={() => handleFieldFocus('email')}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        onFocus={() => handleFieldFocus('phone')}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        onFocus={() => handleFieldFocus('category')}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="account">Account</option>
                        <option value="billing">Billing</option>
                        <option value="plans">Plans & Data</option>
                        <option value="devices">Devices</option>
                        <option value="network">Network</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      onFocus={() => handleFieldFocus('subject')}
                      placeholder="Brief description of your query"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      onFocus={() => handleFieldFocus('message')}
                      placeholder="Please describe your question or issue in detail..."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  {error && (
                    <div className="form-error">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                      {error}
                    </div>
                  )}
                  <button type="submit" className="submit-btn" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

