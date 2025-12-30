import { Cpu, Code, Lightbulb, Globe, CheckCircle, ArrowRight } from 'lucide-react';

interface ServicesPageProps {
  navigate: (page: string) => void;
}

const ServicesPage = ({ navigate }: ServicesPageProps) => {
  const services = [
    {
      icon: <Cpu size={40} />,
      title: "Artificial Intelligence",
      description: "Cutting-edge AI solutions tailored for your academic projects including neural networks, NLP, and computer vision applications.",
      features: ["Neural Networks", "NLP Projects", "Computer Vision", "AI Algorithms"]
    },
    {
      icon: <Code size={40} />,
      title: "Machine Learning",
      description: "Advanced ML models and implementations for research with complete training data and model optimization.",
      features: ["Predictive Models", "Classification", "Regression Analysis", "Deep Learning"]
    },
    {
      icon: <Lightbulb size={40} />,
      title: "IoT Projects",
      description: "Smart IoT solutions connecting devices and data with Arduino, Raspberry Pi, and sensor integration.",
      features: ["Arduino Projects", "Raspberry Pi", "Sensor Integration", "Smart Systems"]
    },
    {
      icon: <Globe size={40} />,
      title: "Web Development",
      description: "Modern, responsive web applications and platforms using latest technologies and frameworks.",
      features: ["React Apps", "Full Stack", "Responsive Design", "API Integration"]
    }
  ];

  return (
    <div className="services-section" style={{ paddingTop: '6rem' }}>
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive project solutions across multiple technology domains with complete documentation and support</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div style={{ marginTop: '1rem' }}>
                {service.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={18} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('projects')} className="btn btn-primary">
            View Projects <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('contact')} className="btn btn-secondary">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;