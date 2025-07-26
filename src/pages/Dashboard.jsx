import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Star, 
  CloudRain, 
  Sun, 
  Users, 
  Trophy, 
  Bell, 
  MessageCircle,
  Clock,
  MapPin,
  Truck
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import PriceChart from '../components/PriceChart';

const Dashboard = () => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [salesData, setSalesData] = useState({ day1: '', day2: '', day3: '' });
  const [suggestedQty, setSuggestedQty] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showSurplusModal, setShowSurplusModal] = useState(false);
  const [credits, setCredits] = useState(245);
  const [reputationScore, setReputationScore] = useState(87);
  const [priceAlerts, setPriceAlerts] = useState([
    { item: 'Rice', targetPrice: 45, currentPrice: 48 },
    { item: 'Onions', targetPrice: 25, currentPrice: 22 }
  ]);
  const [loading, setLoading] = useState({});

  // Load user data from localStorage
  useEffect(() => {
    const savedCredits = localStorage.getItem('feast_credits');
    const savedReputation = localStorage.getItem('feast_reputation');
    if (savedCredits) setCredits(parseInt(savedCredits));
    if (savedReputation) setReputationScore(parseInt(savedReputation));
  }, []);

  // Save to localStorage when credits/reputation change
  useEffect(() => {
    localStorage.setItem('feast_credits', credits.toString());
    localStorage.setItem('feast_reputation', reputationScore.toString());
  }, [credits, reputationScore]);

  // Simulate loading states
  const simulateLoading = (key, duration = 1500) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [key]: false }));
    }, duration);
  };

  // Dummy data
  const emergencyPosts = [
    { id: 1, item: 'Rice', quantity: '500kg', location: 'Sector 12', urgent: true },
    { id: 2, item: 'Wheat', quantity: '300kg', location: 'Sector 8', urgent: false },
  ];

  const mandiPrices = [
    { item: 'Rice', price: '₹48/kg', market: 'Main Mandi', verified: true },
    { item: 'Wheat', price: '₹32/kg', market: 'Central Market', verified: true },
    { item: 'Dal', price: '₹85/kg', market: 'Local Market', verified: false },
  ];

  const supplierPrices = [
    { item: 'Rice', supplier1: '₹48', supplier2: '₹45', supplier3: '₹50' },
    { item: 'Wheat', supplier1: '₹32', supplier2: '₹34', supplier3: '₹31' },
  ];

  const surplusItems = [
    { id: 1, item: 'Tomatoes', quantity: '200kg', vendor: 'Ram Vegetables', distance: '2km' },
    { id: 2, item: 'Onions', quantity: '150kg', vendor: 'Shyam Traders', distance: '5km' },
  ];

  const deliveryRoutes = [
    { id: 1, route: 'Sector 1-5', cost: '₹500', participants: 3, available: 2 },
    { id: 2, route: 'Sector 6-10', cost: '₹750', participants: 5, available: 1 },
  ];

  const deliverySlots = [
    { id: 1, time: '9:00 AM - 11:00 AM', route: 'North Zone', spots: '3/5', cost: '₹120' },
    { id: 2, time: '2:00 PM - 4:00 PM', route: 'South Zone', spots: '1/4', cost: '₹150' },
  ];

  // New data for enhanced features
  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', credits: 890, reputation: 98, badge: '🏆' },
    { rank: 2, name: 'Priya Sharma', credits: 745, reputation: 92, badge: '🥈' },
    { rank: 3, name: 'Amit Singh', credits: 680, reputation: 88, badge: '🥉' },
    { rank: 4, name: 'You', credits: credits, reputation: reputationScore, badge: '⭐' },
    { rank: 5, name: 'Sunita Devi', credits: 520, reputation: 81, badge: '🎖️' },
  ];

  const weatherData = {
    today: { temp: '28°C', condition: 'Sunny', icon: '☀️', impact: 'Good for tomato sales' },
    tomorrow: { temp: '32°C', condition: 'Hot', icon: '🌡️', impact: 'Stock more beverages' },
    dayAfter: { temp: '25°C', condition: 'Rainy', icon: '🌧️', impact: 'Ginger prices may rise' }
  };

  const bulkPurchases = [
    { id: 1, item: 'Onions', vendors: 4, quantity: '2000kg', savings: '₹200', deadline: '2 days' },
    { id: 2, item: 'Rice', vendors: 3, quantity: '1500kg', savings: '₹150', deadline: '1 day' },
    { id: 3, item: 'Oil', vendors: 5, quantity: '500L', savings: '₹300', deadline: '3 days' },
  ];

  const communityChats = [
    { id: 1, user: 'Ram Kumar', message: 'Anyone have good quality tomatoes available?', time: '2m ago' },
    { id: 2, user: 'Priya', message: 'Fresh vegetables available in Sector 12', time: '5m ago' },
    { id: 3, user: 'Amit', message: 'What is the onion price today?', time: '8m ago' },
    { id: 4, user: 'Sunita', message: 'Looking for bulk rice supplier', time: '12m ago' },
    { id: 5, user: 'Vikash', message: 'Oil prices are going up, stock now!', time: '15m ago' },
  ];

  const calculateSuggestion = () => {
    const avg = (parseInt(salesData.day1) + parseInt(salesData.day2) + parseInt(salesData.day3)) / 3;
    setSuggestedQty(`${Math.round(avg * 1.2)} units`);
  };

  // Enhanced functions
  const earnCredits = (amount, activity) => {
    setCredits(prev => prev + amount);
    setReputationScore(prev => Math.min(100, prev + Math.floor(amount / 2)));
    toast.success(`🎉 Earned ${amount} credits for ${activity}!`);
  };

  const postMandiPrice = () => {
    simulateLoading('mandiPrice');
    setTimeout(() => {
      earnCredits(5, 'posting mandi price');
      setShowPriceModal(false);
    }, 1500);
  };

  const joinBulkPurchase = (item) => {
    simulateLoading(`bulk_${item}`);
    setTimeout(() => {
      earnCredits(3, 'joining bulk purchase');
      toast.success(`🛒 Joined bulk purchase for ${item}!`);
    }, 1000);
  };

  const checkPriceAlert = (item) => {
    const alert = priceAlerts.find(a => a.item === item);
    if (alert && alert.currentPrice <= alert.targetPrice) {
      toast.success(`🔔 Price Alert: ${item} is now ₹${alert.currentPrice}/kg!`);
    }
  };

  const sendChatMessage = (message) => {
    toast.success('💬 Message sent to community!');
  };

  const bookDeliverySlot = (slot) => {
    simulateLoading(`slot_${slot.id}`);
    setTimeout(() => {
      earnCredits(2, 'booking delivery slot');
      toast.success(`🚚 Booked ${slot.time} slot!`);
    }, 1000);
  };

  return (
    <div className="animate-fade-in-up" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Toaster position="top-right" />
      
      <div className="modern-container">
        {/* Modern Header */}
        <header className="modern-header">
          <div className="modern-header-content">
            <h1 className="modern-title">🌾 FEAST Dashboard</h1>
            <p className="modern-subtitle">Your comprehensive food supply management platform</p>
            
            {/* Modern Stats */}
            <div className="modern-stats">
              <div className="modern-stat-card">
                <div className="modern-stat-icon">
                  <Trophy size={24} />
                </div>
                <div className="modern-stat-value">{credits}</div>
                <div className="modern-stat-label">Credits</div>
              </div>
              
              <div className="modern-stat-card">
                <div className="modern-stat-icon">
                  <Star size={24} />
                </div>
                <div className="modern-stat-value">{reputationScore}/100</div>
                <div className="modern-stat-label">Reputation</div>
              </div>
              
              <div className="modern-stat-card">
                <div className="modern-stat-icon">
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.floor(reputationScore / 20) ? '#fbbf24' : 'transparent'}
                        color={i < Math.floor(reputationScore / 20) ? '#fbbf24' : '#64748b'}
                      />
                    ))}
                  </div>
                </div>
                <div className="modern-stat-value">{Math.floor(reputationScore / 20)}/5</div>
                <div className="modern-stat-label">Rating</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="modern-btn modern-btn-primary"
                onClick={() => checkPriceAlert('Rice')}
              >
                <Bell size={18} />
                <span>Price Alerts</span>
              </button>
              <button 
                className="modern-btn modern-btn-secondary"
                onClick={() => toast.success('💬 Community opened!')}
              >
                <MessageCircle size={18} />
                <span>Community Chat</span>
              </button>
            </div>
          </div>
        </header>

        {/* Vendor Tools Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-header">🛠️ {t('sections.vendorTools')}</h2>
          <div className="section-grid two-columns">
            
            {/* Vendor Proof Token */}
            <FeatureCard 
              title={`🏆 ${t('features.vpt.title')}`}
              description={t('features.vpt.description')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {isVerified ? (
                    <span className="badge badge-success">
                      ✅ Verified Vendor
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
                <Link to="/profile">
                  <button className="btn btn-primary">
                    🔐 Verify Now
                  </button>
                </Link>
              </div>
            </FeatureCard>

            {/* Emergency Supply Mode */}
            <FeatureCard 
              title={`🚨 ${t('features.emergencySupply.title')}`}
              description={t('features.emergencySupply.description')}
            >
              <div className="scrollable">
                {emergencyPosts.map(post => (
                  <div key={post.id} className={`emergency-post ${post.urgent ? 'urgent' : ''}`}>
                    <div className="emergency-post-header">
                      <div>
                        <span className="emergency-post-item">📦 {post.item}</span>
                        <span className="emergency-post-quantity">{post.quantity}</span>
                      </div>
                      <span className="emergency-post-location">📍 {post.location}</span>
                    </div>
                    {post.urgent && <div className="emergency-post-urgent">⚡ URGENT</div>}
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* AI Insights Section */}
        <section style={{ marginBottom: '40px' }}>
                    <h2 className="section-header">🤖 {t('sections.aiInsights')}</h2>
          <div className="section-grid two-columns">
            
            {/* AI Price Whisperer */}
            <FeatureCard 
              title={`💹 ${t('features.priceWhisperer.title')}`}
              description={t('features.priceWhisperer.description')}
            >
              <PriceChart />
              <div className="ai-insight">
                <p className="ai-insight-text">
                  <strong>🧠 AI Insight:</strong> Prices trending upward. Consider stocking up by Thursday.
                </p>
              </div>
            </FeatureCard>

            {/* AI Quantity Optimizer */}
            <FeatureCard 
              title={`⚡ ${t('features.quantityOptimizer.title')}`}
              description={t('features.quantityOptimizer.description')}
            >
              <div>
                <div className="form-group">
                  <label className="form-label">📈 Last 3 Days Sales</label>
                  <div className="grid-inputs">
                    <input
                      type="number"
                      placeholder="📅 Day 1"
                      value={salesData.day1}
                      onChange={(e) => setSalesData({...salesData, day1: e.target.value})}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="📅 Day 2"
                      value={salesData.day2}
                      onChange={(e) => setSalesData({...salesData, day2: e.target.value})}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="📅 Day 3"
                      value={salesData.day3}
                      onChange={(e) => setSalesData({...salesData, day3: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
                <button
                  onClick={calculateSuggestion}
                  className="btn btn-blue"
                  style={{ width: '100%' }}
                >
                  🎯 Get AI Suggestion
                </button>
                {suggestedQty && (
                  <div className="suggestion-result">
                    <p className="suggestion-text">
                      <strong>💡 Suggested Quantity:</strong> {suggestedQty}
                    </p>
                  </div>
                )}
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Market Tools Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-header">🏪 {t('sections.marketTools')}</h2>
          <div className="section-grid two-columns">
            
            {/* Crowd-Verified Mandi Prices */}
            <FeatureCard 
              title={`💰 ${t('features.mandiPrices.title')}`}
              description={t('features.mandiPrices.description')}
            >
              <div>
                {mandiPrices.map((item, index) => (
                  <div key={index} className="price-item">
                    <div className="price-item-info">
                      <div className="price-item-name">🌾 {item.item}</div>
                      <div className="price-item-market">🏪 {item.market}</div>
                    </div>
                    <div className="price-item-price">
                      <span className="price-value">{item.price}</span>
                      {item.verified && <span className="verified-icon">✅</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowPriceModal(true)}
                className="btn btn-orange"
                style={{ width: '100%' }}
              >
                ➕ Add Price
              </button>
            </FeatureCard>

            {/* Multi-Supplier Price Split */}
            <FeatureCard 
              title={`📊 ${t('features.supplierComparison.title')}`}
              description={t('features.supplierComparison.description')}
            >
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Supplier A</th>
                      <th>Supplier B</th>
                      <th>Supplier C</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierPrices.map((item, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '500' }}>{item.item}</td>
                        <td>{item.supplier1}</td>
                        <td>{item.supplier2}</td>
                        <td style={{ color: '#059669', fontWeight: 'bold' }}>{item.supplier3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ai-insight" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}>
                <p style={{ color: '#92400e' }}>
                  💡 <strong>Best Deal:</strong> Supplier C offers the lowest prices on average
                </p>
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Logistics Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-header">🚚 {t('sections.logistics')}</h2>
          <div className="section-grid three-columns">
            
            {/* Surplus-to-Shortage Exchange */}
            <FeatureCard 
              title={`🔄 ${t('features.surplusExchange.title')}`}
              description={t('features.surplusExchange.description')}
            >
              <div className="logistics-scrollable">
                {surplusItems.map(item => (
                  <div key={item.id} className="surplus-item">
                    <div className="surplus-item-name">🥬 {item.item}</div>
                    <div className="surplus-item-details">📦 {item.quantity} - 👤 {item.vendor}</div>
                    <div className="surplus-item-distance">📍 {item.distance} away</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSurplusModal(true)}
                className="btn btn-purple"
                style={{ width: '100%', marginTop: '8px' }}
              >
                📤 {t('buttons.postSurplus')}
              </button>
            </FeatureCard>

            {/* Smart Split Logistics */}
            <FeatureCard 
              title={`🧠 ${t('features.splitLogistics.title')}`}
              description={t('features.splitLogistics.description')}
            >
              <div className="logistics-scrollable">
                {deliveryRoutes.map(route => (
                  <div key={route.id} className="route-card">
                    <div className="route-name">🛣️ {route.route}</div>
                    <div className="route-cost">💰 Cost: {route.cost}</div>
                    <div className="route-participants">
                      👥 {route.participants} vendors, {route.available} spots left
                    </div>
                    <button className="btn btn-indigo" style={{ fontSize: '12px', padding: '8px 14px', marginTop: '4px' }}>
                      🚌 {t('buttons.joinRoute')}
                    </button>
                  </div>
                ))}
              </div>
            </FeatureCard>

            {/* Enhanced Delivery Slot Pooling */}
            <FeatureCard 
              title={`⏰ ${t('features.deliveryPooling.title')}`}
              description={t('features.deliveryPooling.description')}
            >
              <div className="logistics-scrollable">
                {deliverySlots.map(slot => (
                  <div key={slot.id} className="delivery-slot enhanced">
                    <div className="slot-header">
                      <div className="slot-time">
                        <Clock size={16} />
                        {slot.time}
                      </div>
                      <div className="slot-capacity">
                        <Users size={16} />
                        {slot.spots}
                      </div>
                    </div>
                    <div className="slot-route">
                      <MapPin size={14} />
                      {slot.route}
                    </div>
                    <div className="slot-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${(parseInt(slot.spots.split('/')[0]) / parseInt(slot.spots.split('/')[1])) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="progress-label">
                        {parseInt(slot.spots.split('/')[1]) - parseInt(slot.spots.split('/')[0])} spots remaining
                      </span>
                    </div>
                    <div className="slot-footer">
                      <span className="slot-cost">
                        <Truck size={14} />
                        {slot.cost}
                      </span>
                      <button 
                        className="btn btn-teal" 
                        onClick={() => bookDeliverySlot(slot)}
                        disabled={loading[`slot_${slot.id}`]}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {loading[`slot_${slot.id}`] ? '⏳ Booking...' : '🤝 Book Slot'}
                      </button>
                    </div>
                    {parseInt(slot.spots.split('/')[0]) === parseInt(slot.spots.split('/')[1]) - 1 && (
                      <div className="slot-alert">⚡ Only 1 spot left!</div>
                    )}
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Enhanced Features Sections */}
        
        {/* Weather & Seasonal Insights */}
        <section style={{ marginBottom: '30px' }}>
          <h2 className="section-header">🌤️ Weather & Market Insights</h2>
          <div className="section-grid three-columns">
            {Object.entries(weatherData).map(([day, data], index) => (
              <FeatureCard 
                key={day}
                title={`${data.icon} ${day === 'today' ? 'Today' : day === 'tomorrow' ? 'Tomorrow' : 'Day After'}`}
                description={`${data.temp} - ${data.condition}`}
              >
                <div className="weather-card">
                  <div className="weather-temp">{data.temp}</div>
                  <div className="weather-condition">{data.condition}</div>
                  <div className="weather-impact">
                    <span style={{ fontSize: '12px', color: '#059669' }}>
                      💡 {data.impact}
                    </span>
                  </div>
                </div>
              </FeatureCard>
            ))}
          </div>
        </section>

        {/* Bulk Purchase & Price Alerts */}
        <section style={{ marginBottom: '30px' }}>
          <h2 className="section-header">🛒 Bulk Purchase Opportunities</h2>
          <div className="section-grid three-columns">
            {bulkPurchases.map((purchase) => (
              <FeatureCard 
                key={purchase.id}
                title={`📦 ${purchase.item}`}
                description={`${purchase.vendors} vendors • Save ${purchase.savings}`}
              >
                <div className="bulk-purchase-card">
                  <div className="bulk-details">
                    <div className="bulk-quantity">{purchase.quantity}</div>
                    <div className="bulk-savings">💰 Save {purchase.savings}</div>
                    <div className="bulk-deadline">
                      <Clock size={14} />
                      {purchase.deadline} left
                    </div>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={() => joinBulkPurchase(purchase.item)}
                    disabled={loading[`bulk_${purchase.item}`]}
                    style={{ width: '100%' }}
                  >
                    {loading[`bulk_${purchase.item}`] ? '⏳ Joining...' : '🤝 Join Group'}
                  </button>
                </div>
              </FeatureCard>
            ))}
          </div>
        </section>

        {/* Leaderboard & Gamification */}
        <section style={{ marginBottom: '30px' }}>
          <h2 className="section-header">🏆 Top Vendors Leaderboard</h2>
          <div className="section-grid two-columns">
            <FeatureCard 
              title="🥇 Community Leaders"
              description="Top contributing vendors this month"
            >
              <div className="leaderboard">
                {leaderboard.slice(0, 5).map((vendor) => (
                  <div key={vendor.rank} className={`leaderboard-item ${vendor.name === 'You' ? 'highlight' : ''}`}>
                    <div className="rank-badge">{vendor.badge}</div>
                    <div className="vendor-info">
                      <div className="vendor-name">{vendor.name}</div>
                      <div className="vendor-stats">
                        {vendor.credits} credits • {vendor.reputation}/100 rep
                      </div>
                    </div>
                    <div className="vendor-rank">#{vendor.rank}</div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => earnCredits(1, 'viewing leaderboard')}
                style={{ width: '100%', marginTop: '12px' }}
              >
                🎯 View Full Leaderboard
              </button>
            </FeatureCard>

            <FeatureCard 
              title="🎮 Your Progress"
              description="Achievements and goals"
            >
              <div className="progress-section">
                <div className="achievement-box">
                  <h4>🏅 Recent Achievements</h4>
                  <div className="badge badge-success">🌟 Price Contributor</div>
                  <div className="badge badge-info">🤝 Community Helper</div>
                  <div className="badge badge-warning">📈 Rising Star</div>
                </div>
                
                <div className="progress-goals">
                  <h4>🎯 Next Goals</h4>
                  <div className="goal-item">
                    <span>Post 5 more prices</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <span>Join 3 bulk purchases</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Community Chat */}
        <section style={{ marginBottom: '30px' }}>
          <h2 className="section-header">💬 Community Chatboard</h2>
          <div className="section-grid one-column">
            <FeatureCard 
              title="🗨️ Recent Messages"
              description="Community discussions and vendor updates"
            >
              <div className="chat-section">
                <div className="chat-messages">
                  {communityChats.map((chat) => (
                    <div key={chat.id} className="chat-message">
                      <div className="chat-header">
                        <span className="chat-user">{chat.user}</span>
                        <span className="chat-time">{chat.time}</span>
                      </div>
                      <div className="chat-content">{chat.message}</div>
                    </div>
                  ))}
                </div>
                <div className="chat-input-section">
                  <input 
                    type="text" 
                    placeholder="Type your message to the community..."
                    className="form-input"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => sendChatMessage('Hello community!')}
                  >
                    📤 Send
                  </button>
                </div>
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Enhanced Modals */}
        {showPriceModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">💰 Add Market Price</h3>
                <div className="modal-reward">
                  🎯 Earn 5 credits for contributing!
                </div>
              </div>
              <div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="🌾 Item name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="💰 Price (₹/kg)"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="🏪 Market name"
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    onClick={() => setShowPriceModal(false)}
                    className="btn btn-cancel"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={postMandiPrice}
                    className="btn btn-primary"
                    disabled={loading.mandiPrice}
                  >
                    {loading.mandiPrice ? '⏳ Submitting...' : '✅ Submit & Earn Credits'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSurplusModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">📤 Post Surplus</h3>
              </div>
              <div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="🥬 Item name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="📦 Quantity available"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="📍 Your location"
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    onClick={() => setShowSurplusModal(false)}
                    className="btn btn-cancel"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={() => setShowSurplusModal(false)}
                    className="btn btn-purple"
                  >
                    📤 Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
