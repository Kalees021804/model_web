import { useState, useEffect } from 'react';
import './App.css';

// Import components
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './components/pages/HomePage.tsx';
import ServicesPage from './components/pages/ServicesPage.tsx';
import ProjectsPage from './components/pages/ProjectsPage.tsx';
import ContactPage from './components/pages/ContactPage.tsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        navigate={navigate}
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      {currentPage === 'home' && <HomePage navigate={navigate} />}
      {currentPage === 'services' && <ServicesPage navigate={navigate} />}
      {currentPage === 'projects' && <ProjectsPage navigate={navigate} />}
      {currentPage === 'contact' && <ContactPage navigate={navigate} />}
      
      <Footer />
    </div>
  );
};

export default App;