import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Trophy, 
  CheckCircle, 
  Camera,
  Download,
  Share2,
  Phone,
  Mail,
  MapPin as Location
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('personal');
  const [vendorInfo, setVendorInfo] = useState({
    name: 'Rajesh Kumar',
    shopName: 'Kumar Fast Food Corner',
    location: 'Sector 12, Delhi',
    phone: '+91-9876543210',
    email: 'rajesh@example.com',
    products: 'Street Food, Snacks'
  });

  const [shopDetails, setShopDetails] = useState({
    shopType: 'Fast Food',
    openTime: '09:00',
    closeTime: '22:00',
    avgCustomers: '150',
    rawMaterials: ['tomatoes', 'onions', 'oil', 'spices'],
    coordinates: '28.6139° N, 77.2090° E',
    shopPhoto: null
  });

  const [reputationScore, setReputationScore] = useState(87);
  const [credits, setCredits] = useState(245);
  const [badges] = useState(['🏆 Top Contributor', '⭐ Verified Vendor', '🤝 Community Helper']);
  
  const [vptData, setVptData] = useState({
    photoUploaded: true,
    geotagged: true,
    verified: true
  });

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedCredits = localStorage.getItem('feast_credits');
    const savedReputation = localStorage.getItem('feast_reputation');
    const savedVendorInfo = localStorage.getItem('feast_vendor_info');
    const savedShopDetails = localStorage.getItem('feast_shop_details');

    if (savedCredits) setCredits(parseInt(savedCredits));
    if (savedReputation) setReputationScore(parseInt(savedReputation));
    if (savedVendorInfo) setVendorInfo(JSON.parse(savedVendorInfo));
    if (savedShopDetails) setShopDetails(JSON.parse(savedShopDetails));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('feast_vendor_info', JSON.stringify(vendorInfo));
  }, [vendorInfo]);

  useEffect(() => {
    localStorage.setItem('feast_shop_details', JSON.stringify(shopDetails));
  }, [shopDetails]);

  const handleInputChange = (e) => {
    setVendorInfo({
      ...vendorInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleShopDetailsChange = (e) => {
    const { name, value } = e.target;
    setShopDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const rawMaterialOptions = ['tomatoes', 'onions', 'oil', 'spices', 'flour', 'rice', 'dal', 'vegetables', 'milk', 'eggs'];

  const handleRawMaterialToggle = (material) => {
    setShopDetails(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.includes(material)
        ? prev.rawMaterials.filter(m => m !== material)
        : [...prev.rawMaterials, material]
    }));
  };

  const generateVendorCard = () => {
    return {
      name: vendorInfo.name,
      shop: vendorInfo.shopName,
      type: shopDetails.shopType,
      location: vendorInfo.location,
      phone: vendorInfo.phone,
      vpt: vptData.verified ? 'Verified' : 'Pending',
      reputation: reputationScore,
      credits: credits,
      materials: shopDetails.rawMaterials.slice(0, 3).join(', '),
      hours: `${shopDetails.openTime} - ${shopDetails.closeTime}`
    };
  };

  const downloadVendorCard = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = `${vendorInfo.name.replace(/\s+/g, '_')}_vendor_card.png`;
      link.href = url;
      link.click();
      toast.success('📥 Vendor card downloaded!');
    }
  };

  const shareVendorDetails = () => {
    const cardData = generateVendorCard();
    const shareText = `🏪 ${cardData.shop}\n👤 ${cardData.name}\n📱 ${cardData.phone}\n⭐ ${Math.floor(cardData.reputation/20)}/5 stars\n🏆 ${cardData.credits} credits`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Vendor Details',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('📋 Vendor details copied to clipboard!');
    }
  };

  const saveProfile = () => {
    toast.success('💾 Profile saved successfully!');
  };

  const uploadPhoto = () => {
    setShowPhotoModal(false);
    toast.success('📸 Shop photo uploaded successfully!');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">👤 {t('profile.title')}</h1>
          <p className="page-subtitle">{t('profile.subtitle')}</p>
          
          {/* Reputation & Credits Display */}
          <div className="vendor-stats">
            <div className="stat-card">
              <Trophy className="stat-icon" />
              <div>
                <div className="stat-value">{reputationScore}/100</div>
                <div className="stat-label">Reputation Score</div>
              </div>
            </div>
            <div className="stat-card">
              <Star className="stat-icon" />
              <div>
                <div className="stat-value">{credits}</div>
                <div className="stat-label">Credits Earned</div>
              </div>
            </div>
            <div className="stat-card stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.floor(reputationScore / 20) ? 'star-filled' : 'star-empty'}
                  size={16}
                />
              ))}
              <div className="stat-label">Vendor Rating</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            👤 Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🏪 Shop Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'vpt' ? 'active' : ''}`}
            onClick={() => setActiveTab('vpt')}
          >
            🏆 VPT Status
          </button>
          <button 
            className={`tab-button ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            📱 Digital Card
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="grid grid-1">
              <FeatureCard 
                title={`📝 ${t('profile.vendorInfo.title')}`}
                description={t('profile.vendorInfo.description')}
              >
                <div>
                  <div className="badges-section">
                    <h4 style={{ marginBottom: '12px' }}>🏅 Your Badges</h4>
                    <div className="badges-grid">
                      {badges.map((badge, index) => (
                        <span key={index} className="badge badge-success">{badge}</span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">👤 Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={vendorInfo.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">📞 Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={vendorInfo.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">📧 Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={vendorInfo.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">📍 Location/Address</label>
                    <textarea
                      name="location"
                      value={vendorInfo.location}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <button onClick={saveProfile} className="btn btn-primary" style={{ width: '100%' }}>
                    💾 Save Profile
                  </button>
                </div>
              </FeatureCard>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="grid grid-1">
              <FeatureCard title="🏪 Shop Details" description="Complete information about your business">
                <div>
                  <div className="form-group">
                    <label className="form-label">🏪 Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={vendorInfo.shopName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your shop name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">🍽️ Shop Type</label>
                    <select
                      name="shopType"
                      value={shopDetails.shopType}
                      onChange={handleShopDetailsChange}
                      className="form-select"
                    >
                      <option value="Fast Food">Fast Food</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Chaat">Chaat</option>
                      <option value="North Indian">North Indian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Sweets">Sweets</option>
                      <option value="Street Food">Street Food</option>
                      <option value="Bakery">Bakery</option>
                    </select>
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">🕘 Opening Time</label>
                      <input
                        type="time"
                        name="openTime"
                        value={shopDetails.openTime}
                        onChange={handleShopDetailsChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">🕘 Closing Time</label>
                      <input
                        type="time"
                        name="closeTime"
                        value={shopDetails.closeTime}
                        onChange={handleShopDetailsChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">👥 Average Customers/Day</label>
                    <input
                      type="number"
                      name="avgCustomers"
                      value={shopDetails.avgCustomers}
                      onChange={handleShopDetailsChange}
                      className="form-input"
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">🥕 Regular Raw Materials</label>
                    <div className="raw-materials-grid">
                      {rawMaterialOptions.map(material => (
                        <label key={material} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={shopDetails.rawMaterials.includes(material)}
                            onChange={() => handleRawMaterialToggle(material)}
                          />
                          <span className="checkmark"></span>
                          {material}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📍 GPS Coordinates</label>
                    <input
                      type="text"
                      value={shopDetails.coordinates}
                      className="form-input"
                      disabled
                      style={{ background: '#f3f4f6' }}
                    />
                    <div className="map-placeholder">
                      <MapPin size={24} />
                      <span>Map integration coming soon</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📸 Shop Photo</label>
                    <div className="file-upload" onClick={() => setShowPhotoModal(true)}>
                      <Camera size={48} />
                      <p>Click to upload shop photo</p>
                      <p style={{ fontSize: '12px', opacity: 0.7 }}>JPG, PNG up to 5MB</p>
                    </div>
                  </div>

                  <button onClick={saveProfile} className="btn btn-primary" style={{ width: '100%' }}>
                    💾 Save Shop Details
                  </button>
                </div>
              </FeatureCard>
            </div>
          )}

          {activeTab === 'vpt' && (
            <div className="grid grid-1">
              <FeatureCard 
                title={`🏆 ${t('profile.vptVerification.title')}`}
                description={t('profile.vptVerification.description')}
              >
                <div>
                  {/* Verification Status */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ 
                      backgroundColor: '#f0fdf4', 
                      border: '1px solid #bbf7d0', 
                      borderRadius: '8px', 
                      padding: '16px' 
                    }}>
                      <CheckCircle size={48} style={{ color: '#059669', margin: '0 auto 8px' }} />
                      <h3 style={{ color: '#166534', marginBottom: '4px' }}>✅ Verified Vendor</h3>
                      <p style={{ color: '#166534', fontSize: '14px' }}>Your vendor status has been verified!</p>
                      <div className="badge badge-success" style={{ marginTop: '16px' }}>
                        🏆 Premium Access Unlocked
                      </div>
                    </div>
                  </div>

                  {/* Verification Progress */}
                  <div style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ marginBottom: '8px' }}>📊 Verification Progress</h4>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>Started</span>
                      <span>Verified ✅</span>
                    </div>
                  </div>

                  {/* VPT Benefits */}
                  <div className="benefits-box">
                    <h4 className="benefits-title">🎁 VPT Benefits</h4>
                    <ul className="benefits-list">
                      <li>✅ Access to premium AI insights</li>
                      <li>✅ Priority in surplus exchanges</li>
                      <li>✅ Lower logistics costs (up to 25% off)</li>
                      <li>✅ Verified vendor badge on all posts</li>
                      <li>✅ Advanced market analytics</li>
                      <li>✅ Early access to bulk purchase deals</li>
                      <li>✅ Direct contact with suppliers</li>
                    </ul>
                  </div>

                  {/* Verification Stats */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '12px', 
                    marginTop: '16px' 
                  }}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>45</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Prices Posted</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>12</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Surplus Trades</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>8</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Community Helps</div>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="grid grid-1">
              <FeatureCard title="📱 Digital Vendor Card" description="Your QR code for quick vendor verification">
                <div style={{ textAlign: 'center' }}>
                  <div className="vendor-card-preview">
                    <div className="vendor-card">
                      <div className="vendor-card-header">
                        <h3>{vendorInfo.name}</h3>
                        <div className="vendor-badges">
                          {vptData.verified && <span className="badge badge-success">✅ Verified</span>}
                          <span className="badge badge-info">⭐ {Math.floor(reputationScore/20)} Stars</span>
                        </div>
                      </div>
                      
                      <div className="vendor-card-details">
                        <p><strong>🏪 Shop:</strong> {vendorInfo.shopName}</p>
                        <p><strong>🍽️ Type:</strong> {shopDetails.shopType}</p>
                        <p><strong>📍 Location:</strong> {vendorInfo.location}</p>
                        <p><strong>📞 Phone:</strong> {vendorInfo.phone}</p>
                        <p><strong>🏆 Credits:</strong> {credits}</p>
                        <p><strong>🕒 Hours:</strong> {shopDetails.openTime} - {shopDetails.closeTime}</p>
                        <p><strong>🥕 Materials:</strong> {shopDetails.rawMaterials.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="qr-code-section">
                      <QRCode
                        value={JSON.stringify(generateVendorCard())}
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                      <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
                        Scan to view complete vendor details
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '24px', 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <button onClick={downloadVendorCard} className="btn btn-primary">
                      <Download size={16} style={{ marginRight: '6px' }} />
                      Download Card
                    </button>
                    <button onClick={shareVendorDetails} className="btn btn-secondary">
                      <Share2 size={16} style={{ marginRight: '6px' }} />
                      Share Details
                    </button>
                  </div>

                  {/* QR Usage Tips */}
                  <div style={{ 
                    backgroundColor: '#f0f9ff', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginTop: '20px',
                    textAlign: 'left'
                  }}>
                    <h4 style={{ color: '#0369a1', marginBottom: '8px' }}>💡 How to use your QR Card:</h4>
                    <ul style={{ color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
                      <li>📱 Show to customers for instant credibility</li>
                      <li>🤝 Share with other vendors for partnerships</li>
                      <li>📊 Use in surplus exchanges for quick verification</li>
                      <li>🏪 Display at your shop entrance</li>
                      <li>📋 Include in marketing materials</li>
                    </ul>
                  </div>
                </div>
              </FeatureCard>
            </div>
          )}
        </div>

        {/* Photo Upload Modal */}
        {showPhotoModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">📷 Upload Shop Photo</h3>
              </div>
              <div>
                <div className="file-upload">
                  <Camera size={48} />
                  <p className="upload-text">📤 Click to upload or drag and drop</p>
                  <p className="upload-subtext">🖼️ PNG, JPG up to 5MB</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  padding: '12px', 
                  borderRadius: '6px',
                  margin: '16px 0'
                }}>
                  <p style={{ fontSize: '14px', color: '#92400e' }}>
                    📋 <strong>Tips:</strong> Ensure your shop name/signage is clearly visible in the photo
                  </p>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="btn btn-cancel"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={uploadPhoto}
                    className="btn btn-blue"
                  >
                    📤 Upload
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

export default Profile;
