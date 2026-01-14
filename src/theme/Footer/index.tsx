import React from 'react';

function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-content">

        {/* Social Links */}
        <div className="footer-socials">

          {/* Medium */}
          <a href="https://medium.com/@communitykadena" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Medium">
            <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a href="https://x.com/KdaCed/communities/explore" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X">
            <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>

          {/* Telegram */}
          <a href="https://t.me/+3JzP9i19cM8wOWQ8" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Telegram">
            <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>

          {/* Discord */}
          <a href="https://discord.gg/T4mASjRaRr" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Discord">
            <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
            </svg>
          </a>

          {/* Bluesky */}
          <a href="https://bsky.app/profile/kdacommunity.bsky.social" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Bluesky">
            <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565-.131 2.032-.234 3.024.338 4.089c.571 1.065 2.613 4.88 2.613 4.88l1.616 3.118s-3.018-.086-4.218 3.323c-.975 2.765 2.393 4.613 5.627 3.566 3.038-.984 5.293-3.659 6.024-4.88.73 1.221 2.986 3.896 6.024 4.88 3.234 1.047 6.602-.801 5.627-3.566-1.2-3.409-4.218-3.323-4.218-3.323l1.616-3.118s2.042-3.815 2.613-4.88c.572-1.065.469-2.057-.564-2.524-.66-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.686 12 10.8Z" />
            </svg>
          </a>

        </div>

        {/* Copyright */}
        <div className="footer-copyright-wrapper">
          <span className="footer-copyright">
            © {new Date().getFullYear()} <a href="#" className="footer-brand-link">Kadena Community Edition</a>. All Rights Reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}

export default React.memo(Footer);
