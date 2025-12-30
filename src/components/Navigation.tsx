import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  navigate: (page: string) => void;
  scrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Navigation = ({ currentPage, navigate, scrolled, isMenuOpen, setIsMenuOpen }: NavigationProps) => {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <button onClick={() => navigate('home')} className="logo-text">
            AcadifyX
          </button>

          <div className="desktop-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="mobile-link"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;