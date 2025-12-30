import { Mail, Instagram, CheckCircle } from 'lucide-react';

interface ContactPageProps {
  navigate: (page: string) => void;
}

const ContactPage = ({ navigate }: ContactPageProps) => {
  return (
    <div className="contact-section" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
      <div className="contact-content">
        <h2>Get Started Today</h2>
        <p>Ready to build your next project? Contact us to discuss your requirements</p>

        <div className="contact-buttons">
          <a 
            href="mailto:contact@acadifyx.com"
            className="btn btn-email"
          >
            <Mail size={24} />
            DM us to get started
          </a>
          <a
            href="https://instagram.com/acadifyx_official"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-instagram"
          >
            <Instagram size={24} />
            @acadifyx_official
          </a>
        </div>

        <div style={{ 
          background: 'linear-gradient(to bottom right, #fef3c7, #fed7aa)',
          borderRadius: '1rem',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'left',
          border: '1px solid #fde68a'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            What to Include in Your Message:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} style={{ color: '#f59e0b', marginTop: '0.25rem', flexShrink: 0 }} />
              <span style={{ color: '#4b5563' }}>Project type (AI, ML, IoT, Web Development)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} style={{ color: '#f59e0b', marginTop: '0.25rem', flexShrink: 0 }} />
              <span style={{ color: '#4b5563' }}>Project requirements and objectives</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} style={{ color: '#f59e0b', marginTop: '0.25rem', flexShrink: 0 }} />
              <span style={{ color: '#4b5563' }}>Timeline and deadline</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} style={{ color: '#f59e0b', marginTop: '0.25rem', flexShrink: 0 }} />
              <span style={{ color: '#4b5563' }}>Any specific technologies or frameworks</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={20} style={{ color: '#f59e0b', marginTop: '0.25rem', flexShrink: 0 }} />
              <span style={{ color: '#4b5563' }}>Budget expectations</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} className="btn btn-secondary">
            Back to Home
          </button>
          <button onClick={() => navigate('services')} className="btn btn-primary">
            View Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;