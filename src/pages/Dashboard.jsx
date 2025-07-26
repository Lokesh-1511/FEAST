import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FeatureCard from '../components/FeatureCard';
import PriceChart from '../components/PriceChart';

const Dashboard = () => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [salesData, setSalesData] = useState({ day1: '', day2: '', day3: '' });
  const [suggestedQty, setSuggestedQty] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showSurplusModal, setShowSurplusModal] = useState(false);

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

  const calculateSuggestion = () => {
    const avg = (parseInt(salesData.day1) + parseInt(salesData.day2) + parseInt(salesData.day3)) / 3;
    setSuggestedQty(`${Math.round(avg * 1.2)} units`);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🌾 {t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', 
            marginTop: '20px',
            flexWrap: 'wrap' 
          }}>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>📊</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Live Market Data</div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>🤖</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>AI Powered</div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>🚚</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Smart Logistics</div>
            </div>
          </div>
        </div>

        {/* Vendor Tools Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-header">🛠️ {t('sections.vendorTools')}</h2>
          <div className="grid grid-2">
            
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
          <div className="grid grid-2">
            
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
          <div className="grid grid-2">
            
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
          <div className="grid grid-3">
            
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

            {/* Delivery Slot Pooling */}
            <FeatureCard 
              title={`⏰ ${t('features.deliveryPooling.title')}`}
              description={t('features.deliveryPooling.description')}
            >
              <div className="logistics-scrollable">
                {deliverySlots.map(slot => (
                  <div key={slot.id} className="delivery-slot">
                    <div className="slot-time">🕐 {slot.time}</div>
                    <div className="slot-route">🌍 {slot.route}</div>
                    <div className="slot-spots">📊 Spots: {slot.spots}</div>
                    <div className="slot-footer">
                      <span className="slot-cost">💵 {slot.cost}</span>
                      <button className="btn btn-teal" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        🤝 {t('buttons.join')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Modals */}
        {showPriceModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">💰 Add Market Price</h3>
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
                    onClick={() => setShowPriceModal(false)}
                    className="btn btn-primary"
                  >
                    ✅ Submit
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
