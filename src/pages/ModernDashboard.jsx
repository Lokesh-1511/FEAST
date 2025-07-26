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
  Truck,
  TrendingUp,
  Package,
  AlertTriangle,
  BarChart3,
  Brain,
  ShoppingCart,
  Calendar,
  UserCheck,
  Activity
} from 'lucide-react';

const ModernDashboard = () => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [credits, setCredits] = useState(245);
  const [reputationScore, setReputationScore] = useState(87);
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

  const weatherData = {
    today: { temp: '28°C', condition: 'Sunny', icon: '☀️', impact: 'Good for tomato sales' },
    tomorrow: { temp: '32°C', condition: 'Hot', icon: '🌡️', impact: 'Stock more beverages' },
    dayAfter: { temp: '25°C', condition: 'Rainy', icon: '🌧️', impact: 'Ginger prices may rise' }
  };

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', credits: 890, reputation: 98, badge: '🏆' },
    { rank: 2, name: 'Priya Sharma', credits: 745, reputation: 92, badge: '🥈' },
    { rank: 3, name: 'Amit Singh', credits: 680, reputation: 88, badge: '🥉' },
    { rank: 4, name: 'You', credits: credits, reputation: reputationScore, badge: '⭐' },
  ];

  const bulkPurchases = [
    { id: 1, item: 'Onions', vendors: 4, quantity: '2000kg', savings: '₹200', deadline: '2 days' },
    { id: 2, item: 'Rice', vendors: 3, quantity: '1500kg', savings: '₹150', deadline: '1 day' },
  ];

  const communityChats = [
    { id: 1, user: 'Ram Kumar', message: 'Anyone have good quality tomatoes available?', time: '2m ago' },
    { id: 2, user: 'Priya', message: 'Fresh vegetables available in Sector 12', time: '5m ago' },
    { id: 3, user: 'Amit', message: 'What is the onion price today?', time: '8m ago' },
  ];

  // Functions
  const earnCredits = (amount, activity) => {
    setCredits(prev => prev + amount);
    setReputationScore(prev => Math.min(100, prev + Math.floor(amount / 2)));
    toast.success(`🎉 Earned ${amount} credits for ${activity}!`);
  };

  const checkPriceAlert = (item) => {
    toast.success(`🔔 Price alerts enabled for ${item}!`);
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
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">🛠️</span>
            <h2 className="modern-section-title">Vendor Tools</h2>
          </div>
          
          <div className="modern-grid modern-grid-2">
            {/* Vendor Proof Token */}
            <div className="modern-card animate-slide-in-right">
              <div className="modern-card-header">
                <div className="modern-card-icon">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">Vendor Proof Token</h3>
                  <p className="modern-card-description">Verify your vendor status</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Status:</span>
                  {isVerified ? (
                    <span className="modern-badge modern-badge-success">
                      ✅ Verified Vendor
                    </span>
                  ) : (
                    <span className="modern-badge modern-badge-warning">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <button className="modern-btn modern-btn-primary w-full">
                    🔐 Verify Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Emergency Supply Mode */}
            <div className="modern-card animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="modern-card-header">
                <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--error-100), var(--error-200))', color: 'var(--error-700)' }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">Emergency Supply</h3>
                  <p className="modern-card-description">Urgent supply requests</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 'var(--space-4)' }}>
                  {emergencyPosts.map(post => (
                    <div key={post.id} style={{ 
                      padding: 'var(--space-3)', 
                      background: post.urgent ? 'var(--error-50)' : 'var(--gray-50)', 
                      borderRadius: 'var(--radius-lg)', 
                      marginBottom: 'var(--space-2)',
                      border: post.urgent ? '2px solid var(--error-200)' : '1px solid var(--gray-200)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-1)' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>📦 {post.item}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{post.quantity}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>📍 {post.location}</div>
                      </div>
                      {post.urgent && (
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          color: 'var(--error-700)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          ⚡ URGENT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  className="modern-btn modern-btn-warning w-full"
                  onClick={() => earnCredits(5, 'posting emergency request')}
                >
                  📢 Post Emergency Request
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">🤖</span>
            <h2 className="modern-section-title">AI Insights</h2>
          </div>
          
          <div className="modern-grid modern-grid-2">
            {/* AI Price Whisperer */}
            <div className="modern-card animate-slide-in-right">
              <div className="modern-card-header">
                <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--secondary-100), var(--secondary-200))', color: 'var(--secondary-700)' }}>
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">AI Price Whisperer</h3>
                  <p className="modern-card-description">Smart price predictions</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Tomorrow's Prediction:</span>
                    <span style={{ color: 'var(--success-600)', fontWeight: '700' }}>📈 +5% Rice</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    AI suggests stocking rice today. Expected 5% price increase tomorrow.
                  </div>
                </div>
                <button 
                  className="modern-btn modern-btn-secondary w-full"
                  onClick={() => toast.success('📊 AI analysis updated!')}
                >
                  🔍 View Detailed Analysis
                </button>
              </div>
            </div>

            {/* Quantity Optimizer */}
            <div className="modern-card animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="modern-card-header">
                <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--success-100), var(--success-200))', color: 'var(--success-700)' }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">Quantity Optimizer</h3>
                  <p className="modern-card-description">Optimize your inventory</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Suggested Quantity:</span>
                    <span style={{ color: 'var(--primary-600)', fontWeight: '700' }}>120 units</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Based on last 3 days sales pattern and market trends.
                  </div>
                </div>
                <button 
                  className="modern-btn modern-btn-success w-full"
                  onClick={() => toast.success('📦 Quantity optimized!')}
                >
                  📊 Optimize Inventory
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Tools Section */}
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">📈</span>
            <h2 className="modern-section-title">Market Tools</h2>
          </div>
          
          <div className="modern-grid modern-grid-2">
            {/* Mandi Prices */}
            <div className="modern-card animate-slide-in-right">
              <div className="modern-card-header">
                <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--warning-100), var(--warning-200))', color: 'var(--warning-700)' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">Live Mandi Prices</h3>
                  <p className="modern-card-description">Real-time market rates</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 'var(--space-4)' }}>
                  {mandiPrices.map((price, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: 'var(--space-2)', 
                      background: 'var(--gray-50)', 
                      borderRadius: 'var(--radius-md)', 
                      marginBottom: 'var(--space-2)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{price.item}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{price.market}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{price.price}</div>
                        {price.verified && (
                          <span className="modern-badge modern-badge-success" style={{ fontSize: '0.625rem' }}>
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="modern-btn modern-btn-warning w-full"
                  onClick={() => earnCredits(3, 'posting mandi price')}
                >
                  📊 Post New Price
                </button>
              </div>
            </div>

            {/* Bulk Purchase Groups */}
            <div className="modern-card animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="modern-card-header">
                <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', color: 'var(--primary-700)' }}>
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="modern-card-title">Bulk Purchase Groups</h3>
                  <p className="modern-card-description">Save money together</p>
                </div>
              </div>
              <div className="modern-card-content">
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 'var(--space-4)' }}>
                  {bulkPurchases.map((bulk) => (
                    <div key={bulk.id} style={{ 
                      padding: 'var(--space-3)', 
                      background: 'var(--primary-50)', 
                      borderRadius: 'var(--radius-lg)', 
                      marginBottom: 'var(--space-2)',
                      border: '1px solid var(--primary-200)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{bulk.item}</div>
                        <span className="modern-badge modern-badge-primary">💰 Save {bulk.savings}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 'var(--space-1)' }}>
                        {bulk.vendors} vendors • {bulk.quantity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--error-600)', fontWeight: '600' }}>
                        ⏰ {bulk.deadline} left
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="modern-btn modern-btn-primary w-full"
                  onClick={() => toast.success('🛒 Joined bulk purchase group!')}
                >
                  🤝 Join Group Purchase
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Weather & Insights */}
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">🌤️</span>
            <h2 className="modern-section-title">Weather & Market Insights</h2>
          </div>
          
          <div className="modern-grid modern-grid-3">
            {Object.entries(weatherData).map(([day, data], index) => (
              <div key={day} className="modern-card animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="modern-card-header">
                  <div className="modern-card-icon" style={{ background: 'linear-gradient(135deg, var(--warning-100), var(--warning-200))', color: 'var(--warning-700)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{data.icon}</span>
                  </div>
                  <div>
                    <h3 className="modern-card-title">{day === 'today' ? 'Today' : day === 'tomorrow' ? 'Tomorrow' : 'Day After'}</h3>
                    <p className="modern-card-description">{data.temp} • {data.condition}</p>
                  </div>
                </div>
                <div className="modern-card-content">
                  <div style={{ 
                    padding: 'var(--space-3)', 
                    background: 'var(--primary-50)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--primary-200)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary-700)', fontWeight: '600' }}>
                      💡 Market Tip:
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-1)' }}>
                      {data.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">🏆</span>
            <h2 className="modern-section-title">Community Leaderboard</h2>
          </div>
          
          <div className="modern-card">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {leaderboard.map((user, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 'var(--space-4)', 
                  background: user.name === 'You' ? 'var(--primary-50)' : 'var(--gray-50)', 
                  borderRadius: 'var(--radius-lg)', 
                  marginBottom: 'var(--space-2)',
                  border: user.name === 'You' ? '2px solid var(--primary-200)' : '1px solid var(--gray-200)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{user.badge}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>#{user.rank} {user.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {user.credits} credits • {user.reputation}/100 reputation
                      </div>
                    </div>
                  </div>
                  {user.name === 'You' && (
                    <span className="modern-badge modern-badge-primary">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Chat */}
        <section className="modern-section">
          <div className="modern-section-header">
            <span className="modern-section-icon">💬</span>
            <h2 className="modern-section-title">Community Chat</h2>
          </div>
          
          <div className="modern-card">
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 'var(--space-4)' }}>
              {communityChats.map((chat) => (
                <div key={chat.id} style={{ 
                  padding: 'var(--space-3)', 
                  background: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-lg)', 
                  marginBottom: 'var(--space-2)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{chat.user}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{chat.time}</span>
                  </div>
                  <div style={{ color: 'var(--gray-700)' }}>{chat.message}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <input 
                type="text" 
                placeholder="Type your message..."
                className="modern-input"
                style={{ flex: 1 }}
              />
              <button 
                className="modern-btn modern-btn-primary"
                onClick={() => toast.success('💬 Message sent!')}
              >
                📤 Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernDashboard;
