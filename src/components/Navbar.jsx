import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-title">{t('app.title')}</div>
          <div className="navbar-subtitle">
            {t('app.subtitle')}
          </div>
        </Link>
        
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            📊 {t('navigation.dashboard')}
          </Link>
          <Link
            to="/profile"
            className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            👤 {t('navigation.profile')}
          </Link>
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
