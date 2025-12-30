import { Code, Lightbulb, Mail, ArrowRight, Sparkles, Zap, Trophy, Users, CheckCircle } from 'lucide-react';

interface HomePageProps {
  navigate: (page: string) => void;
}

const HomePage = ({ navigate }: HomePageProps) => {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge">
                Build. Learn. Submit with confidence.
              </div>
              <h1 className="hero-title">
                WE'RE BUILDING <span className="highlight">SMART</span>
              </h1>
              <h2 className="hero-subtitle">
                COLLEGE & SCHOOL PROJECTS
              </h2>
              <p className="hero-text">
                Specialized in AI, ML, IoT, and Web Development projects designed for students
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('contact')}
                  className="btn btn-primary"
                >
                  Get Started <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => navigate('services')}
                  className="btn btn-secondary"
                >
                  View Services
                </button>
              </div>
            </div>

            <div className="hero-card-wrapper">
              <div className="hero-card">
                <Sparkles size={48} style={{ color: 'white', marginBottom: '1rem' }} />
                <h3>High Quality Projects</h3>
                <p>Complete solutions with code, documentation, and presentations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Offerings</h2>
            <p>Discover our comprehensive services and project solutions</p>
          </div>
          <div className="services-grid">
            <button onClick={() => navigate('services')} className="service-card">
              <Code size={40} className="service-icon" />
              <h3>Services</h3>
              <p>Explore our AI, ML, IoT, and Web Development services</p>
            </button>

            <button onClick={() => navigate('projects')} className="service-card">
              <Lightbulb size={40} className="service-icon" />
              <h3>Projects</h3>
              <p>See what we offer and our project categories</p>
            </button>

            <button onClick={() => navigate('contact')} className="service-card">
              <Mail size={40} className="service-icon" />
              <h3>Contact</h3>
              <p>Get in touch to discuss your project requirements</p>
            </button>

            <div className="service-card">
              <Trophy size={40} className="service-icon" />
              <h3>Quality</h3>
              <p>Premium projects with guaranteed quality</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <Trophy size={24} style={{ color: '#f59e0b' }} />
              <span>100+ Projects Delivered</span>
            </div>
            <div className="feature-card">
              <Users size={24} style={{ color: '#f59e0b' }} />
              <span>500+ Happy Students</span>
            </div>
            <div className="feature-card">
              <Zap size={24} style={{ color: '#f59e0b' }} />
              <span>24/7 Support Available</span>
            </div>
            <div className="feature-card">
              <CheckCircle size={24} style={{ color: '#f59e0b' }} />
              <span>High Quality & Low Price</span>
            </div>
            <div className="feature-card">
              <Code size={24} style={{ color: '#f59e0b' }} />
              <span>Full Code & Documentation</span>
            </div>
            <div className="feature-card">
              <Lightbulb size={24} style={{ color: '#f59e0b' }} />
              <span>Real-time Projects</span>
            </div>
          </div>
          <div className="highlight-box">
            <h3>Ready to Start Your Project?</h3>
            <p>Get expert help with your academic projects today</p>
            <button 
              onClick={() => navigate('contact')}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Contact Us Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;