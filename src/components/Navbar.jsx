import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModernLanguageSelector from './ModernLanguageSelector';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      padding: '0'
    }}>
      <div className="modern-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: '80px'
        }}>
          <Link to="/" style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'white'
            }}>
              🌾
            </div>
            <div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: 'var(--gray-900)',
                background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {t('app.title')}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--gray-600)',
                fontWeight: '500'
              }}>
                {t('app.subtitle')}
              </div>
            </div>
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-4)' 
          }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '0.875rem',
                background: location.pathname === '/' 
                  ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))' 
                  : 'transparent',
                color: location.pathname === '/' ? 'white' : 'var(--gray-700)',
                transition: 'all var(--transition-base)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              📊 {t('navigation.dashboard')}
            </Link>
            <Link
              to="/profile"
              style={{
                textDecoration: 'none',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '0.875rem',
                background: location.pathname === '/profile' 
                  ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))' 
                  : 'transparent',
                color: location.pathname === '/profile' ? 'white' : 'var(--gray-700)',
                transition: 'all var(--transition-base)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              👤 {t('navigation.profile')}
            </Link>
            <ModernLanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
