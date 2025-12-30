import { CheckCircle, ArrowRight, Star, Users, Zap, Award } from 'lucide-react';

interface ProjectsPageProps {
  navigate: (page: string) => void;
}

const ProjectsPage = ({ navigate }: ProjectsPageProps) => {
  const features = [
    "Real-time Projects",
    "Student-friendly Pricing",
    "Full Code & Documentation",
    "Complete PPT & Project Report",
    "High Quality & Low Price",
    "Expert Technical Support"
  ];

  const projectCategories = [
    {
      title: "AI/ML Projects",
      examples: ["Image Classification", "Chatbot Development", "Sentiment Analysis", "Recommendation Systems"]
    },
    {
      title: "IoT Projects",
      examples: ["Smart Home Automation", "Health Monitoring", "Agriculture IoT", "Industrial IoT"]
    },
    {
      title: "Web Projects",
      examples: ["E-commerce Platforms", "Portfolio Websites", "Social Networks", "Admin Dashboards"]
    }
  ];

  // ✨ NEW: Showcase of completed projects with images
  const completedProjects = [
    {
      id: 1,
      title: "AI-Powered Chatbot System",
      category: "Artificial Intelligence",
      description: "An intelligent chatbot using NLP and machine learning for customer support automation.",
      technologies: ["Python", "TensorFlow", "Flask", "React"],
      rating: 5,
      deliveryTime: "7 days",
      image: "🤖", // You can replace with actual image URLs
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      title: "Smart Home IoT System",
      category: "Internet of Things",
      description: "Complete home automation system with Arduino, sensor integration, and mobile app control.",
      technologies: ["Arduino", "ESP32", "React Native", "Firebase"],
      rating: 5,
      deliveryTime: "10 days",
      image: "🏠",
      color: "from-green-400 to-green-600"
    },
    {
      id: 3,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Full-stack e-commerce website with payment integration, admin panel, and inventory management.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      rating: 5,
      deliveryTime: "14 days",
      image: "🛒",
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 4,
      title: "Face Recognition System",
      category: "Machine Learning",
      description: "Real-time face detection and recognition system using deep learning and computer vision.",
      technologies: ["Python", "OpenCV", "Keras", "Django"],
      rating: 5,
      deliveryTime: "8 days",
      image: "👤",
      color: "from-pink-400 to-pink-600"
    },
    {
      id: 5,
      title: "Weather Monitoring IoT",
      category: "Internet of Things",
      description: "IoT-based weather station with multiple sensors and real-time data visualization dashboard.",
      technologies: ["Raspberry Pi", "Python", "React", "InfluxDB"],
      rating: 5,
      deliveryTime: "9 days",
      image: "🌤️",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      id: 6,
      title: "Student Management System",
      category: "Web Development",
      description: "Complete school management system with attendance, grades, and parent portal features.",
      technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
      rating: 5,
      deliveryTime: "12 days",
      image: "📚",
      color: "from-orange-400 to-orange-600"
    }
  ];

  // ✨ NEW: Student reviews/testimonials
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      college: "IIT Delhi",
      project: "AI Chatbot Project",
      rating: 5,
      review: "Outstanding work! The chatbot project was delivered before the deadline with complete documentation. Scored 95% in my final presentation!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      college: "NIT Trichy",
      project: "IoT Smart Home",
      rating: 5,
      review: "Excellent quality and very professional. The team helped me understand every aspect of the project. Highly recommend for IoT projects!",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Arjun Reddy",
      college: "VIT Vellore",
      project: "E-Commerce Website",
      rating: 5,
      review: "Best decision ever! Got full marks in my web development project. The code quality is amazing and everything works perfectly.",
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      college: "BITS Pilani",
      project: "Face Recognition ML",
      rating: 5,
      review: "The machine learning model was incredibly accurate! Great support throughout the project. Will definitely order again for my next semester.",
      date: "1 week ago"
    }
  ];

  // Stats section
  const stats = [
    { icon: <Award size={32} />, value: "150+", label: "Projects Completed" },
    { icon: <Users size={32} />, value: "500+", label: "Happy Students" },
    { icon: <Star size={32} />, value: "4.9/5", label: "Average Rating" },
    { icon: <Zap size={32} />, value: "98%", label: "On-Time Delivery" }
  ];

  return (
    <div className="features-section" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h2>Our Projects Portfolio</h2>
          <p>Real projects delivered to students across India with excellent results</p>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                animation: 'scaleIn 0.6s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector('.stat-icon') as HTMLElement;
                if (icon) icon.style.animation = 'pop 0.5s ease-in-out';
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector('.stat-icon') as HTMLElement;
                if (icon) icon.style.animation = 'none';
              }}
            >
              <div 
                className="stat-icon"
                style={{ 
                  color: '#f59e0b', 
                  marginBottom: '1rem', 
                  display: 'flex', 
                  justifyContent: 'center',
                  animation: index === 0 ? 'wiggle 2s ease-in-out infinite' : 
                            index === 1 ? 'gentleBounce 2s ease-in-out infinite' : 
                            index === 2 ? 'pulse 2s ease-in-out infinite' : 
                            'swing 2s ease-in-out infinite'
                }}
              >
                {stat.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ✨ NEW: Completed Projects Showcase */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '1rem', 
            color: '#111827',
            fontWeight: 'bold'
          }}>
            Recently Completed Projects
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
            See what we've built for students like you
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {completedProjects.map((project, index) => (
              <div 
                key={project.id}
                className="service-card"
                style={{
                  background: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Project Image/Icon */}
                <div style={{
                  background: `linear-gradient(135deg, ${project.color.split(' ')[0].replace('from-', '')} 0%, ${project.color.split(' ')[1].replace('to-', '')} 100%)`,
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  animation: 'float 3s ease-in-out infinite',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation = 'none';
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation = 'float 3s ease-in-out infinite';
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
                >
                  {project.image}
                </div>

                {/* Category Badge */}
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  {project.category}
                </span>

                <h3 style={{ color: '#111827', marginBottom: '0.75rem', fontSize: '1.25rem' }}>
                  {project.title}
                </h3>

                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {project.description}
                </p>

                {/* Technologies */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {project.technologies.map((tech, i) => (
                    <span key={i} style={{
                      padding: '0.25rem 0.5rem',
                      background: '#f3f4f6',
                      color: '#4b5563',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Rating and Delivery */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[...Array(project.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill="#fbbf24" 
                        color="#fbbf24"
                        style={{
                          animation: `pop 0.5s ease-in-out ${i * 0.1}s`,
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.animation = 'wiggle 0.5s ease-in-out';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.animation = 'none';
                        }}
                      />
                    ))}
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {project.rating}.0
                    </span>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    ⚡ {project.deliveryTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Features */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#111827' }}>
            Why Choose Us?
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <CheckCircle size={24} style={{ color: '#22c55e' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ✨ NEW: Student Reviews Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '1rem', 
            color: '#111827',
            fontWeight: 'bold'
          }}>
            What Students Say About Us
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Real feedback from real students
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #fef3c7',
                  animation: 'fadeIn 0.6s ease-out',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill="#fbbf24" 
                      color="#fbbf24"
                      style={{
                        animation: `pop 0.6s ease-in-out ${i * 0.1}s`,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.animation = 'rotate 0.5s ease-in-out';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.animation = 'none';
                      }}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p style={{ 
                  color: '#4b5563', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}>
                  "{review.review}"
                </p>

                {/* Student Info */}
                <div style={{ 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    marginBottom: '0.25rem' 
                  }}>
                    {review.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    {review.college}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#f59e0b',
                      fontWeight: '600'
                    }}>
                      {review.project}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#9ca3af'
                    }}>
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Categories */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#111827' }}>
            Project Categories
          </h2>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {projectCategories.map((category, index) => (
              <div key={index} className="service-card">
                <h3 style={{ color: '#f59e0b' }}>{category.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  {category.examples.map((example, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#f59e0b' }}>•</span>
                      <span style={{ color: '#4b5563' }}>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('services')} className="btn btn-primary">
            View Services <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('contact')} className="btn btn-secondary">
            Get Started
          </button>
        </div>

        {/* CTA Box */}
        <div className="highlight-box">
          <h3>💡 Ready to Start Your Project?</h3>
          <p>Join 500+ students who trusted us with their academic projects</p>
          <button 
            onClick={() => navigate('contact')}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Get Your Project Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;