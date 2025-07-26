import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureCard from '../components/FeatureCard';

const Profile = () => {
  const { t } = useTranslation();
  const [vendorInfo, setVendorInfo] = useState({
    name: '',
    shopName: '',
    location: '',
    phone: '',
    email: ''
  });
  
  const [vptData, setVptData] = useState({
    photoUploaded: false,
    geotagged: false,
    verified: false
  });

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleInputChange = (e) => {
    setVendorInfo({
      ...vendorInfo,
      [e.target.name]: e.target.value
    });
  };

  const simulatePhotoUpload = () => {
    setVptData({
      ...vptData,
      photoUploaded: true
    });
    setShowPhotoModal(false);
  };

  const simulateGeotag = () => {
    setVptData({
      ...vptData,
      geotagged: true
    });
    // Simulate verification after both photo and geotag
    if (vptData.photoUploaded) {
      setTimeout(() => {
        setVptData(prev => ({ ...prev, verified: true }));
      }, 2000);
    }
  };

  const saveProfile = () => {
    alert('Profile saved successfully!');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">👤 {t('profile.title')}</h1>
          <p className="page-subtitle">{t('profile.subtitle')}</p>
        </div>

        <div className="grid grid-2">
          {/* Vendor Information */}
          <FeatureCard 
            title={`📝 ${t('profile.vendorInfo.title')}`}
            description={t('profile.vendorInfo.description')}
          >
            <div>
              <div className="form-group">
                <label className="form-label">
                  👤 Full Name
                </label>
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
                <label className="form-label">
                  🏪 Shop/Business Name
                </label>
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
                <label className="form-label">
                  📍 Location/Address
                </label>
                <textarea
                  name="location"
                  value={vendorInfo.location}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  📞 Phone Number
                </label>
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
                <label className="form-label">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={vendorInfo.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </div>

              <button
                onClick={saveProfile}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                💾 Save Profile
              </button>
            </div>
          </FeatureCard>

          {/* Vendor Proof Token */}
          <FeatureCard 
            title={`🏆 ${t('profile.vptVerification.title')}`}
            description={t('profile.vptVerification.description')}
          >
            <div>
              {/* Verification Status */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {vptData.verified ? (
                  <div style={{ 
                    backgroundColor: '#f0fdf4', 
                    border: '1px solid #bbf7d0', 
                    borderRadius: '8px', 
                    padding: '16px' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#059669', 
                        borderRadius: '50%', 
                        padding: '8px',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        ✓
                      </div>
                    </div>
                    <h3 style={{ color: '#166534', marginBottom: '4px' }}>✅ Verified Vendor</h3>
                    <p style={{ color: '#166534', fontSize: '14px' }}>Your vendor status has been verified!</p>
                    <div className="badge badge-success" style={{ marginTop: '16px' }}>
                      🏆 Premium Access Unlocked
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    backgroundColor: '#fef3c7', 
                    border: '1px solid #fcd34d', 
                    borderRadius: '8px', 
                    padding: '16px' 
                  }}>
                    <h3 style={{ color: '#92400e', marginBottom: '4px' }}>⏳ Verification Pending</h3>
                    <p style={{ color: '#92400e', fontSize: '14px' }}>Complete the steps below to verify your vendor status</p>
                  </div>
                )}
              </div>

              {/* Verification Steps */}
              <div>
                {/* Step 1: Photo Upload */}
                <div className="verification-step">
                  <div className="step-header">
                    <h4 className="step-title">📷 Step 1: Upload Shop Photo</h4>
                    {vptData.photoUploaded ? (
                      <span className="step-status completed">✅ Completed</span>
                    ) : (
                      <span className="step-status pending">⏳ Pending</span>
                    )}
                  </div>
                  
                  {vptData.photoUploaded ? (
                    <div className="step-result">
                      <p className="step-result-text">📸 Shop photo uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="step-content">
                      <p className="step-description">
                        📋 Upload a clear photo of your shop front with visible signage
                      </p>
                      <button
                        onClick={() => setShowPhotoModal(true)}
                        className="btn btn-blue"
                      >
                        📤 Upload Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Step 2: Geotag Verification */}
                <div className="verification-step">
                  <div className="step-header">
                    <h4 className="step-title">📍 Step 2: Location Verification</h4>
                    {vptData.geotagged ? (
                      <span className="step-status completed">✅ Completed</span>
                    ) : (
                      <span className="step-status pending">⏳ Pending</span>
                    )}
                  </div>
                  
                  {vptData.geotagged ? (
                    <div className="step-result">
                      <p className="step-result-text">🗺️ Location verified successfully!</p>
                      <p className="step-coordinates">
                        📍 Coordinates: 28.6139° N, 77.2090° E
                      </p>
                    </div>
                  ) : (
                    <div className="step-content">
                      <p className="step-description">
                        🧭 Verify your shop location using GPS coordinates
                      </p>
                      <button
                        onClick={simulateGeotag}
                        disabled={!vptData.photoUploaded}
                        className={`btn ${vptData.photoUploaded ? 'btn-purple' : 'btn-cancel'}`}
                        style={{ cursor: vptData.photoUploaded ? 'pointer' : 'not-allowed' }}
                      >
                        {vptData.photoUploaded ? '📍 Verify Location' : '📷 Upload Photo First'}
                      </button>
                    </div>
                  )}
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
                      style={{ 
                        width: `${(
                          (vptData.photoUploaded ? 1 : 0) + 
                          (vptData.geotagged ? 1 : 0) + 
                          (vptData.verified ? 1 : 0)
                        ) * 33.33}%` 
                      }}
                    ></div>
                  </div>
                  <div className="progress-labels">
                    <span>Started</span>
                    <span>
                      {vptData.verified ? 'Verified' : 
                       vptData.geotagged ? 'Processing...' : 
                       vptData.photoUploaded ? 'Location Pending' : 'Photo Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="benefits-box">
                <h4 className="benefits-title">🎁 VPT Benefits</h4>
                <ul className="benefits-list">
                  <li>✅ Access to premium AI insights</li>
                  <li>✅ Priority in surplus exchanges</li>
                  <li>✅ Lower logistics costs</li>
                  <li>✅ Verified vendor badge</li>
                  <li>✅ Advanced market analytics</li>
                </ul>
              </div>
            </div>
          </FeatureCard>
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
                  <div className="upload-icon" style={{ fontSize: '48px' }}>📷</div>
                  <p className="upload-text">📤 Click to upload or drag and drop</p>
                  <p className="upload-subtext">🖼️ PNG, JPG up to 10MB</p>
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
                    onClick={simulatePhotoUpload}
                    className="btn btn-blue"
                  >
                    📤 Upload (Demo)
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
