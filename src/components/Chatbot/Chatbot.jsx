import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useDataLayer from '../../hooks/useDataLayer';
import './Chatbot.css';

const chatbotTree = {
  id: 'root',
  message: 'Hi there! 👋 I\'m NexBot, your virtual assistant. How can I help you today?',
  options: [
    {
      id: 'billing',
      label: '💳 Billing & Payments',
      message: 'I can help with billing questions. What would you like to know?',
      options: [
        {
          id: 'billing-view',
          label: '📄 View my bill',
          message: 'You can view your bill by logging into your account and navigating to Dashboard > Billing. Need anything else about billing?',
          options: [
            { id: 'billing-view-help', label: '❓ I can\'t find it', message: 'No worries! Go to nextel.com, click "Sign In" at the top right, then go to Dashboard. Select "Billing" from the sidebar. If you still need help, I can connect you to an agent.', options: [
              { id: 'billing-view-agent', label: '👤 Connect to agent', message: 'I\'ll connect you to a billing specialist. Please call 1-800-NEXTEL or submit a query on our FAQ page. Our team is available 24/7!', options: [] },
              { id: 'billing-view-done', label: '✅ That helped, thanks!', message: 'Great! Glad I could help. Is there anything else you need?', options: [] },
            ]},
            { id: 'billing-view-done2', label: '✅ Got it, thanks!', message: 'Happy to help! Let me know if you need anything else.', options: [] },
          ],
        },
        {
          id: 'billing-payment',
          label: '💰 Make a payment',
          message: 'You can make a payment through Dashboard > Billing > Make Payment. We accept credit/debit cards, PayPal, Apple Pay, and Google Pay. Would you like more help?',
          options: [
            { id: 'billing-payment-methods', label: '🔄 Other payment methods', message: 'We also accept bank transfers and in-store payments. Visit any NexTel store to pay in person, or set up auto-pay for hassle-free billing!', options: [] },
            { id: 'billing-payment-done', label: '✅ That\'s helpful!', message: 'Glad to hear it! Feel free to ask anything else.', options: [] },
          ],
        },
        {
          id: 'billing-dispute',
          label: '⚠️ Dispute a charge',
          message: 'Sorry about that! For billing disputes, please call our billing team at 1-800-NEXTEL or submit a detailed query through our FAQ page support form. We\'ll investigate within 48 hours.',
          options: [
            { id: 'billing-dispute-faq', label: '📝 Go to support form', message: 'You can find the support form at the bottom of our FAQ page. Select "Billing" as the category and describe the charge you\'d like to dispute.', options: [] },
            { id: 'billing-dispute-done', label: '✅ Thanks!', message: 'You\'re welcome! We\'ll make sure it gets resolved.', options: [] },
          ],
        },
      ],
    },
    {
      id: 'plans',
      label: '📶 Plans & Upgrades',
      message: 'Looking to explore plans or upgrade? Here\'s how I can help:',
      options: [
        {
          id: 'plans-current',
          label: '📋 View current plans',
          message: 'We offer Basic ($29/mo), Pro ($59/mo), and Enterprise ($99/mo) plans. Visit our Plans page for detailed comparisons. Would you like to know more?',
          options: [
            { id: 'plans-compare', label: '🔍 Compare plans in detail', message: 'Head to our Plans page at /plans to see a full comparison of features, data limits, and pricing. You can also switch plans instantly from your Dashboard!', options: [] },
            { id: 'plans-recommend', label: '💡 Recommend a plan', message: 'For personal use, our Pro plan is the most popular — it includes 25GB data, 5G access, and priority support at $59/mo. For families or businesses, check out our Enterprise plan!', options: [] },
          ],
        },
        {
          id: 'plans-upgrade',
          label: '⬆️ Upgrade options',
          message: 'Great choice! We have device upgrades, plan upgrades, speed boosts, and add-ons — all with special savings. Check our Upgrades page for the latest deals!',
          options: [
            { id: 'plans-upgrade-how', label: '🔄 How to upgrade', message: 'Visit our Upgrades page, select the upgrade you want, and click "Get This Upgrade." It\'ll be added to your cart and activated instantly after payment!', options: [] },
            { id: 'plans-upgrade-deals', label: '🏷️ Current deals', message: 'Right now we have up to 50% off on device upgrades and 33% off speed boosts! Visit the Upgrades page for all current promotions.', options: [] },
          ],
        },
        {
          id: 'plans-cancel',
          label: '❌ Cancel plan',
          message: 'We\'re sorry to hear that! You can cancel anytime from Dashboard > My Plan > Cancel. No fees or penalties apply. Would you consider a downgrade instead?',
          options: [
            { id: 'plans-downgrade', label: '⬇️ Yes, tell me about downgrade', message: 'Instead of canceling, you can downgrade to our Basic plan at just $29/mo. You\'ll keep your number and account. Go to Dashboard > My Plan to make the switch.', options: [] },
            { id: 'plans-cancel-confirm', label: '🚪 No, I want to cancel', message: 'Understood. Please go to Dashboard > My Plan > Cancel, or contact support at 1-800-NEXTEL. Your service will remain active until the end of your billing cycle.', options: [] },
          ],
        },
      ],
    },
    {
      id: 'technical',
      label: '🔧 Technical Support',
      message: 'Let\'s get your technical issue resolved! What kind of problem are you experiencing?',
      options: [
        {
          id: 'tech-network',
          label: '📡 Network issues',
          message: 'I\'m sorry you\'re having network problems. Let me help troubleshoot. Try these steps:\n\n1. Toggle Airplane Mode on/off\n2. Restart your device\n3. Check our coverage map\n\nDid that help?',
          options: [
            { id: 'tech-network-yes', label: '✅ Yes, it\'s working now!', message: 'Excellent! Glad the troubleshooting worked. If it happens again, don\'t hesitate to reach out!', options: [] },
            { id: 'tech-network-no', label: '❌ Still not working', message: 'I\'m sorry about that. Please report the issue through our FAQ page support form or call 1-800-NEXTEL. Our network team monitors issues 24/7 and will prioritize your area.', options: [] },
          ],
        },
        {
          id: 'tech-device',
          label: '📱 Device problems',
          message: 'What kind of device issue are you facing?',
          options: [
            { id: 'tech-device-setup', label: '🔧 Device setup help', message: 'For device setup, insert your NexTel SIM card, power on your device, and follow the on-screen instructions. If you need your APN settings, go to Settings > Network > Access Point Names and select "NexTel."', options: [] },
            { id: 'tech-device-repair', label: '🔨 Device repair', message: 'For device repairs, visit any NexTel store or authorized service center. If your device is under warranty, repairs may be free. You can also check warranty status in Dashboard > My Devices.', options: [] },
          ],
        },
        {
          id: 'tech-internet',
          label: '🌐 Slow internet speed',
          message: 'Slow speeds can be frustrating! Try these:\n\n1. Check if you\'ve exceeded your data limit\n2. Move to an area with better signal\n3. Close background apps\n4. Consider a speed boost add-on\n\nWould you like more help?',
          options: [
            { id: 'tech-internet-boost', label: '🚀 Tell me about speed boosts', message: 'Our 5G Ultra Speed Boost gives you priority network access with speeds up to 3 Gbps for just $19.99/mo! Check the Upgrades page for details.', options: [] },
            { id: 'tech-internet-report', label: '📋 Report the issue', message: 'Please submit a report through our FAQ page support form with your location and time of the slow speeds. Our team will investigate within 24 hours.', options: [] },
          ],
        },
      ],
    },
    {
      id: 'account',
      label: '👤 Account Help',
      message: 'I can help with your account. What do you need?',
      options: [
        {
          id: 'account-login',
          label: '🔐 Login issues',
          message: 'Having trouble logging in? Here are some options:',
          options: [
            { id: 'account-reset', label: '🔑 Reset password', message: 'Go to the Login page and click "Forgot Password." Enter your email address and we\'ll send you a reset link within minutes. Check your spam folder if you don\'t see it!', options: [] },
            { id: 'account-locked', label: '🔒 Account locked', message: 'If your account is locked due to multiple failed attempts, wait 30 minutes or contact support at 1-800-NEXTEL for immediate assistance.', options: [] },
          ],
        },
        {
          id: 'account-update',
          label: '✏️ Update my info',
          message: 'You can update your personal information from Dashboard > Account Settings. This includes your name, email, phone number, and address. Changes take effect immediately.',
          options: [
            { id: 'account-update-done', label: '✅ Got it!', message: 'Great! Let me know if you need help with anything else.', options: [] },
          ],
        },
        {
          id: 'account-delete',
          label: '🗑️ Delete account',
          message: 'We\'re sorry to see you go. To delete your account, please contact our support team at 1-800-NEXTEL or use the support form on our FAQ page. Account deletion takes 30 days and is irreversible.',
          options: [
            { id: 'account-delete-agent', label: '📞 Contact support', message: 'You can call us at 1-800-NEXTEL (24/7) or submit a request through the support form on our FAQ page. We\'ll process your request and confirm via email.', options: [] },
          ],
        },
      ],
    },
    {
      id: 'other',
      label: '💬 Something else',
      message: 'I\'d love to help! For specific queries, you can:',
      options: [
        { id: 'other-faq', label: '❓ Browse FAQ', message: 'Visit our comprehensive FAQ page for detailed answers to common questions across all topics — accounts, billing, plans, devices, network, and support.', options: [] },
        { id: 'other-support', label: '📝 Submit a support query', message: 'Use the support form at the bottom of our FAQ page to submit a detailed query. Our team responds within 24 hours.', options: [] },
        { id: 'other-call', label: '📞 Call us', message: 'Our support team is available 24/7 at 1-800-NEXTEL. We\'re always happy to help!', options: [] },
      ],
    },
  ],
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [path, setPath] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const {
    trackChatbotOpened,
    trackChatbotClosed,
    trackChatbotOptionSelected,
    trackChatbotPath,
    trackChatbotRestart,
  } = useDataLayer();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = useCallback((text, options = []) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text, options, timestamp: new Date() }]);
    }, 600 + Math.random() * 400);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    trackChatbotOpened();
    if (messages.length === 0) {
      setCurrentNode(chatbotTree);
      addBotMessage(chatbotTree.message, chatbotTree.options);
      setPath(['Welcome']);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    trackChatbotClosed();
  };

  const handleOptionClick = (option, depth) => {
    // Add user selection as message
    setMessages(prev => [...prev, { type: 'user', text: option.label, timestamp: new Date() }]);

    // Track
    trackChatbotOptionSelected(option.label, option.id, depth);

    // Update path
    const newPath = [...path, option.label];
    setPath(newPath);
    trackChatbotPath(newPath);

    // Set new node and add bot response
    setCurrentNode(option);
    addBotMessage(option.message, option.options || []);
  };

  const handleRestart = () => {
    trackChatbotRestart();
    setMessages([]);
    setPath(['Welcome']);
    setCurrentNode(chatbotTree);
    addBotMessage(chatbotTree.message, chatbotTree.options);
  };

  // Calculate depth based on messages
  const getDepth = () => {
    return messages.filter(m => m.type === 'user').length;
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        className={`chatbot-trigger ${isOpen ? 'hidden' : ''}`}
        onClick={handleOpen}
        aria-label="Open chat"
      >
        <div className="chatbot-trigger-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <span className="chatbot-trigger-pulse"></span>
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                <path d="M12 20C12 15.5817 15.5817 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 28C24.4183 28 28 24.4183 28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="20" r="4" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h4>NexBot</h4>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button className="chatbot-restart-btn" onClick={handleRestart} title="Restart conversation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            </button>
            <button className="chatbot-close-btn" onClick={handleClose} title="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="bot-avatar-small">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {/* Show options only for the last bot message */}
                {msg.type === 'bot' && msg.options && msg.options.length > 0 && index === messages.length - 1 && (
                  <div className="message-options">
                    {msg.options.map(option => (
                      <button
                        key={option.id}
                        className="option-btn"
                        onClick={() => handleOptionClick(option, getDepth())}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
                {/* Show restart for terminal messages */}
                {msg.type === 'bot' && (!msg.options || msg.options.length === 0) && index === messages.length - 1 && !isTyping && (
                  <div className="message-options">
                    <button className="option-btn restart" onClick={handleRestart}>
                      🔄 Start Over
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message bot">
              <div className="bot-avatar-small">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="chatbot-footer">
          <p>Powered by <strong>NexBot AI</strong></p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;

