import React, { useEffect, useState } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import ReactGA from 'react-ga4';

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const analyticsId = 'G-J507K728FR'; // Your Google Analytics ID

  useEffect(() => {
    const consent = Cookies.get('CookieConsent');
    if (consent === 'true') {
      initializeAnalytics();
    }
    setShowBanner(!consent); // Show the banner if consent is not set
  }, []);

  const initializeAnalytics = () => {
    ReactGA.initialize(analyticsId);
    ReactGA.event({
      category: 'CookieConsent',
      action: 'User accepted analytics cookies',
    });
  };

  const handleAccept = () => {
    Cookies.set('CookieConsent', 'true', { path: '/' });
    initializeAnalytics();
    setShowBanner(false); // Hide banner after accepting
  };

  const handleDecline = () => {
    Cookies.set('CookieConsent', 'false', { path: '/' });
    setShowBanner(false); // Hide banner after declining
  };

  const clearConsent = () => {
    Cookies.remove('CookieConsent', { path: '/' });
    setShowBanner(true); // Force the banner to reappear
  };

  return (
    <>
      {showBanner && (
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Decline"
          enableDeclineButton
          onAccept={handleAccept}
          onDecline={handleDecline}
          cookieName="CookieConsent"
          style={{ background: "#2B373B", fontSize: "15px" }}
          buttonStyle={{ color: "#ffffff", fontSize: "13px", background: "#3498db" }}
          declineButtonStyle={{ color: "#ffffff", fontSize: "13px", background: "#888888" }}
        >
          We use cookies to enhance your experience. By continuing to browse, you consent to our use of analytics cookies.
        </CookieConsent>
      )}

      <div className="footer-consent-link">
        <a href="https://kda-chain.org/index.html" target="_blank" rel="noopener noreferrer" className="footer-external-link">kda-chain.org</a>
        <span style={{ margin: '0 10px', color: 'var(--k-base)' }}>|</span>
        <button onClick={clearConsent}>
          Analytics Consent
        </button>
      </div>
    </>
  );
};

export default CookieConsentBanner;