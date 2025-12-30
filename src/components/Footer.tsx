import { Mail, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">AcadifyX</div>
          <p>Building smart college & school projects</p>
          
          <div className="footer-social">
            <a 
              href="https://instagram.com/acadifyx_official" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Instagram size={24} />
            </a>
            <a href="mailto:contact@acadifyx.com">
              <Mail size={24} />
            </a>
          </div>

          <div className="footer-copyright">
            © 2024 AcadifyX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;