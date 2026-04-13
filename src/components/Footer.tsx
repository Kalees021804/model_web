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
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=acadifyxofficial@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
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