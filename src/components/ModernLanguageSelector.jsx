import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const ModernLanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--gray-50)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--gray-700)',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          minWidth: '120px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--gray-100)';
          e.target.style.borderColor = 'var(--gray-300)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--gray-50)';
          e.target.style.borderColor = 'var(--gray-200)';
        }}
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <ChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-base)'
          }} 
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + var(--space-2))',
          right: 0,
          background: 'white',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 'var(--z-dropdown)',
          minWidth: '200px',
          overflow: 'hidden'
        }}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'white',
                border: 'none',
                color: 'var(--gray-700)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--gray-50)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
              <span>{language.name}</span>
              {language.code === i18n.language && (
                <span style={{ 
                  marginLeft: 'auto', 
                  color: 'var(--primary-500)',
                  fontSize: '0.75rem'
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 'var(--z-overlay)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernLanguageSelector;
