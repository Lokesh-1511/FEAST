import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
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
  MapPin as Location,
  User,
  Store,
  Shield,
  QrCode
} from 'lucide-react';

const ModernProfile = () => {
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

  const qrData = JSON.stringify({
    name: vendorInfo.name,
    shop: vendorInfo.shopName,
    location: vendorInfo.location,
    phone: vendorInfo.phone,
    verified: vptData.verified,
    reputation: reputationScore
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'shop', label: 'Shop Details', icon: Store },
    { id: 'vpt', label: 'VPT Status', icon: Shield },
    { id: 'qr', label: 'Digital QR Card', icon: QrCode }
  ];

  return (
    <div className="animate-fade-in-up" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100())' }}>
      <div className="modern-container">
        {/* Profile Header */}
        <header className="modern-header" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="modern-header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary-400), var(--secondary-400))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: 'white',
                border: '4px solid rgba(255,255,255,0.3)'
              }}>
                👨‍💼
              </div>
              <div>
                <h1 className="modern-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>
                  {vendorInfo.name}
                </h1>
                <p className="modern-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
                  {vendorInfo.shopName} • {vendorInfo.location}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {badges.map((badge, index) => (
                    <span key={index} className="modern-badge modern-badge-primary">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
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
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-8)',
          overflowX: 'auto',
          padding: 'var(--space-1)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))' 
                    : 'white',
                  color: activeTab === tab.id ? 'white' : 'var(--gray-700)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'personal' && (
          <div className="modern-card animate-fade-in-up">
            <div className="modern-card-header">
              <div className="modern-card-icon">
                <User size={20} />
              </div>
              <div>
                <h3 className="modern-card-title">Personal Information</h3>
                <p className="modern-card-description">Update your personal details</p>
              </div>
            </div>
            <div className="modern-card-content">
              <div className="modern-grid modern-grid-2">
                <div className="modern-form-group">
                  <label className="modern-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={vendorInfo.name}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={vendorInfo.shopName}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={vendorInfo.location}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={vendorInfo.phone}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={vendorInfo.email}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Products/Services</label>
                  <input
                    type="text"
                    name="products"
                    value={vendorInfo.products}
                    onChange={handleInputChange}
                    className="modern-input"
                  />
                </div>
              </div>
              <button 
                className="modern-btn modern-btn-primary mt-6"
                onClick={() => toast.success('✅ Profile updated successfully!')}
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="modern-card animate-fade-in-up">
            <div className="modern-card-header">
              <div className="modern-card-icon">
                <Store size={20} />
              </div>
              <div>
                <h3 className="modern-card-title">Shop Details</h3>
                <p className="modern-card-description">Manage your shop information</p>
              </div>
            </div>
            <div className="modern-card-content">
              <div className="modern-grid modern-grid-2">
                <div className="modern-form-group">
                  <label className="modern-label">Shop Type</label>
                  <select
                    name="shopType"
                    value={shopDetails.shopType}
                    onChange={handleShopDetailsChange}
                    className="modern-select"
                  >
                    <option value="Fast Food">Fast Food</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Grocery Store">Grocery Store</option>
                    <option value="Street Vendor">Street Vendor</option>
                  </select>
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Average Daily Customers</label>
                  <input
                    type="number"
                    name="avgCustomers"
                    value={shopDetails.avgCustomers}
                    onChange={handleShopDetailsChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Opening Time</label>
                  <input
                    type="time"
                    name="openTime"
                    value={shopDetails.openTime}
                    onChange={handleShopDetailsChange}
                    className="modern-input"
                  />
                </div>
                <div className="modern-form-group">
                  <label className="modern-label">Closing Time</label>
                  <input
                    type="time"
                    name="closeTime"
                    value={shopDetails.closeTime}
                    onChange={handleShopDetailsChange}
                    className="modern-input"
                  />
                </div>
              </div>
              
              <div className="modern-form-group">
                <label className="modern-label">Raw Materials Used</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: 'var(--space-2)',
                  marginTop: 'var(--space-2)'
                }}>
                  {rawMaterialOptions.map((material) => (
                    <label key={material} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2)',
                      background: shopDetails.rawMaterials.includes(material) ? 'var(--primary-50)' : 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: shopDetails.rawMaterials.includes(material) ? '2px solid var(--primary-200)' : '1px solid var(--gray-200)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)'
                    }}>
                      <input
                        type="checkbox"
                        checked={shopDetails.rawMaterials.includes(material)}
                        onChange={() => handleRawMaterialToggle(material)}
                        style={{ accentColor: 'var(--primary-500)' }}
                      />
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        color: shopDetails.rawMaterials.includes(material) ? 'var(--primary-700)' : 'var(--gray-700)'
                      }}>
                        {material}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                className="modern-btn modern-btn-primary mt-6"
                onClick={() => toast.success('🏪 Shop details updated!')}
              >
                💾 Save Shop Details
              </button>
            </div>
          </div>
        )}

        {activeTab === 'vpt' && (
          <div className="modern-card animate-fade-in-up">
            <div className="modern-card-header">
              <div className="modern-card-icon">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="modern-card-title">Vendor Proof Token Status</h3>
                <p className="modern-card-description">Verification status and requirements</p>
              </div>
            </div>
            <div className="modern-card-content">
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: 'var(--success-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--success-200)'
                }}>
                  <CheckCircle size={24} color="var(--success-600)" />
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--success-800)', fontSize: '1.125rem' }}>
                      ✅ Verified Vendor
                    </div>
                    <div style={{ color: 'var(--success-600)', fontSize: '0.875rem' }}>
                      All verification requirements completed
                    </div>
                  </div>
                </div>
              </div>

              <div className="modern-grid modern-grid-3">
                <div style={{
                  padding: 'var(--space-4)',
                  background: vptData.photoUploaded ? 'var(--success-50)' : 'var(--warning-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${vptData.photoUploaded ? 'var(--success-200)' : 'var(--warning-200)'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📸</div>
                  <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>Shop Photo</div>
                  <span className={`modern-badge ${vptData.photoUploaded ? 'modern-badge-success' : 'modern-badge-warning'}`}>
                    {vptData.photoUploaded ? '✅ Uploaded' : '⏳ Pending'}
                  </span>
                </div>

                <div style={{
                  padding: 'var(--space-4)',
                  background: vptData.geotagged ? 'var(--success-50)' : 'var(--warning-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${vptData.geotagged ? 'var(--success-200)' : 'var(--warning-200)'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📍</div>
                  <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>Geotag</div>
                  <span className={`modern-badge ${vptData.geotagged ? 'modern-badge-success' : 'modern-badge-warning'}`}>
                    {vptData.geotagged ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>

                <div style={{
                  padding: 'var(--space-4)',
                  background: vptData.verified ? 'var(--success-50)' : 'var(--warning-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${vptData.verified ? 'var(--success-200)' : 'var(--warning-200)'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🛡️</div>
                  <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>Verification</div>
                  <span className={`modern-badge ${vptData.verified ? 'modern-badge-success' : 'modern-badge-warning'}`}>
                    {vptData.verified ? '✅ Complete' : '⏳ Processing'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <button 
                  className="modern-btn modern-btn-success"
                  onClick={() => toast.success('🔄 Verification status refreshed!')}
                >
                  🔄 Refresh Status
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="modern-card animate-fade-in-up">
            <div className="modern-card-header">
              <div className="modern-card-icon">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="modern-card-title">Digital QR Vendor Card</h3>
                <p className="modern-card-description">Share your vendor information easily</p>
              </div>
            </div>
            <div className="modern-card-content">
              <div className="modern-grid modern-grid-2">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: 'var(--space-4)', 
                    background: 'white', 
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <QRCodeSVG 
                      value={qrData} 
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="modern-btn modern-btn-primary"
                        onClick={() => toast.success('📱 QR code downloaded!')}
                      >
                        <Download size={16} />
                        Download
                      </button>
                      <button 
                        className="modern-btn modern-btn-secondary"
                        onClick={() => toast.success('📤 QR code shared!')}
                      >
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--gray-900)', marginBottom: 'var(--space-4)' }}>
                    QR Code Information
                  </h4>
                  <div style={{ space: 'var(--space-3)' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-2)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Name:</span>
                      <span style={{ color: 'var(--gray-900)' }}>{vendorInfo.name}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-2)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Shop:</span>
                      <span style={{ color: 'var(--gray-900)' }}>{vendorInfo.shopName}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-2)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Location:</span>
                      <span style={{ color: 'var(--gray-900)' }}>{vendorInfo.location}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-2)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Reputation:</span>
                      <span style={{ color: 'var(--success-600)', fontWeight: '700' }}>{reputationScore}/100</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-2)',
                      background: 'var(--success-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--success-200)'
                    }}>
                      <span style={{ fontWeight: '600', color: 'var(--success-700)' }}>Status:</span>
                      <span className="modern-badge modern-badge-success">✅ Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProfile;
