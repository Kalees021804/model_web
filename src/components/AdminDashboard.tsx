import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject,
  getReviews,
  deleteReview,
  getQuotes,
  updateQuoteStatus
} from '../firebase/firebaseService';
import type { Project, QuoteRequest, Review } from '../firebase/firebaseService';
import { uploadToCloudinary } from '../firebase/cloudinaryConfig';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard = ({ isOpen, onClose }: AdminDashboardProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'quotes'>('projects');
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const sendQuoteDecisionEmail = async (
    quote: QuoteRequest,
    status: 'approved' | 'rejected'
  ) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const approvedTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED;
    const rejectedTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED;

    if (!serviceId || !publicKey) {
      throw new Error('EmailJS service or public key is missing.');
    }

    const templateId =
      status === 'approved' ? approvedTemplateId : rejectedTemplateId;

    if (!templateId) {
      throw new Error(`EmailJS template for ${status} is missing.`);
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_name: quote.name,
          to_email: quote.email,
          email: quote.email,
          phone: quote.phone,
          project_type: quote.projectType,
          budget: quote.budget || 'Not provided',
          deadline: quote.deadline || 'Not provided',
          status,
          admin_email: 'acadifyxofficial@gmail.com'
        },
        { publicKey }
      );
    } catch (emailError: unknown) {
      if (emailError && typeof emailError === 'object') {
        const errorObj = emailError as { status?: number; text?: string; message?: string };
        const details = [
          errorObj.status ? `status ${errorObj.status}` : '',
          errorObj.text || errorObj.message || ''
        ]
          .filter(Boolean)
          .join(' - ');

        throw new Error(details || 'EmailJS send failed.');
      }

      throw new Error('EmailJS send failed.');
    }
  };

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTechnologies, setFormTechnologies] = useState('');
  const [formRating, setFormRating] = useState('5');
  const [formDeliveryTime, setFormDeliveryTime] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formColorGradient, setFormColorGradient] = useState('from-blue-400 to-blue-600');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fetchedProjects, fetchedReviews, fetchedQuotes] = await Promise.all([
        getProjects(),
        getReviews(),
        getQuotes()
      ]);
      setProjects(fetchedProjects);
      setReviews(fetchedReviews);
      setQuotes(fetchedQuotes);
    } catch (error) {
      alert('Error loading dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteDecision = async (
    quote: QuoteRequest,
    status: 'approved' | 'rejected'
  ) => {
    try {
      setProcessingQuoteId(quote.id);
      await updateQuoteStatus(quote.id, status);
      await sendQuoteDecisionEmail(quote, status);
      await loadDashboardData();
      alert(`Quote ${status === 'approved' ? 'accepted' : 'declined'} successfully.`);
    } catch (error) {
      console.error('Error updating quote status:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown EmailJS error';
      alert(
        `Quote status updated, but email failed.\nReason: ${errorMessage}\nPlease check EmailJS config and .env values.`
      );
    } finally {
      setProcessingQuoteId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      await deleteReview(reviewId);
      await loadDashboardData();
      alert('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review. Please try again.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('');
    setFormDescription('');
    setFormTechnologies('');
    setFormRating('5');
    setFormDeliveryTime('');
    setFormImageUrl('');
    setFormColorGradient('from-blue-400 to-blue-600');
    setImageFile(null);
    setImagePreview('');
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    if (!formTitle || !formCategory || !formDescription) {
      alert('Please fill in all required fields');
      return;
    }

    if (!imageFile && !formImageUrl) {
      alert('Please select an image or provide an image URL');
      return;
    }

    try {
      setUploadingImage(true);
      
      let imageUrl = formImageUrl;
      
      // Upload image to Cloudinary if file is selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const projectData = {
        title: formTitle,
        category: formCategory,
        description: formDescription,
        technologies: formTechnologies.split(',').map(t => t.trim()).filter(t => t),
        rating: parseInt(formRating),
        deliveryTime: formDeliveryTime,
        imageUrl: imageUrl,
        colorGradient: formColorGradient
      };

      await addProject(projectData);
      await loadDashboardData();
      resetForm();
      alert('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormCategory(project.category);
    setFormDescription(project.description);
    setFormTechnologies(project.technologies.join(', '));
    setFormRating(project.rating.toString());
    setFormDeliveryTime(project.deliveryTime);
    setFormImageUrl(project.imageUrl);
    setFormColorGradient(project.colorGradient);
    setImagePreview(project.imageUrl);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      setUploadingImage(true);
      
      let imageUrl = formImageUrl;
      
      // Upload new image if file is selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const projectData = {
        title: formTitle,
        category: formCategory,
        description: formDescription,
        technologies: formTechnologies.split(',').map(t => t.trim()).filter(t => t),
        rating: parseInt(formRating),
        deliveryTime: formDeliveryTime,
        imageUrl: imageUrl,
        colorGradient: formColorGradient
      };

      await updateProject(editingProject.id, projectData);
      await loadDashboardData();
      resetForm();
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await loadDashboardData();
        alert('Project deleted successfully!');
      } catch (error) {
        alert('Error deleting project. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out',
      overflow: 'auto',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 2rem)',
        animation: 'scaleIn 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            Admin Dashboard
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f59e0b';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                backgroundColor: activeTab === 'projects' ? '#f59e0b' : '#f3f4f6',
                color: activeTab === 'projects' ? '#ffffff' : '#374151'
              }}
            >
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                backgroundColor: activeTab === 'quotes' ? '#f59e0b' : '#f3f4f6',
                color: activeTab === 'quotes' ? '#ffffff' : '#374151'
              }}
            >
              Quote Requests ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                backgroundColor: activeTab === 'reviews' ? '#f59e0b' : '#f3f4f6',
                color: activeTab === 'reviews' ? '#ffffff' : '#374151'
              }}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'projects' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                  Projects ({projects.length})
                </h3>
                {!isAddingProject && !editingProject && (
                  <button
                    onClick={() => setIsAddingProject(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={20} /> Add New Project
                  </button>
                )}
              </div>

              {(isAddingProject || editingProject) && (
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h4>
              
              {/* Image Upload Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Project Image *
                </label>
                
                {imagePreview ? (
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        setFormImageUrl('');
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  >
                    <ImageIcon size={48} style={{ color: '#9ca3af', marginBottom: '0.5rem' }} />
                    <span style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      Click to upload image
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      PNG, JPG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
                
                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                    Or paste image URL:
                  </span>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <input
                  type="text"
                  placeholder="Project Title *"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Category *"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <textarea
                  placeholder="Description *"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    gridColumn: '1 / -1',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={formTechnologies}
                  onChange={(e) => setFormTechnologies(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    gridColumn: '1 / -1',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Delivery Time (e.g., 7 days)"
                  value={formDeliveryTime}
                  onChange={(e) => setFormDeliveryTime(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
                <input
                  type="text"
                  placeholder="Color Gradient (e.g., from-blue-400 to-blue-600)"
                  value={formColorGradient}
                  onChange={(e) => setFormColorGradient(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    gridColumn: '1 / -1',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                  disabled={uploadingImage}
                  className="btn btn-primary"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    opacity: uploadingImage ? 0.6 : 1,
                    cursor: uploadingImage ? 'not-allowed' : 'pointer'
                  }}
                >
                  {uploadingImage ? (
                    <>
                      <Upload size={20} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save size={20} /> {editingProject ? 'Update' : 'Add'} Project
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  disabled={uploadingImage}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  Loading projects...
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                      No projects yet. Add your first project!
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        style={{
                          padding: '1.5rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.75rem',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '0.5rem',
                              border: '2px solid #e5e7eb'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                                {project.title}
                              </h4>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                {project.category}
                              </span>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                              {project.description}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              {project.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: '#e5e7eb',
                                    color: '#4b5563',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              ⭐ {project.rating}.0 | ⚡ {project.deliveryTime}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditProject(project)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fef3c7',
                              color: '#f59e0b',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'quotes' && (
            <>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                Quote Requests ({quotes.length})
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  Loading quote requests...
                </div>
              ) : quotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No quote requests yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <p style={{ fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                            {quote.name} ({quote.email})
                          </p>
                          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                            Phone: {quote.phone}
                          </p>
                          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                            Project Type: {quote.projectType}
                          </p>
                          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                            Budget: {quote.budget || 'Not provided'} | Deadline: {quote.deadline || 'Not provided'}
                          </p>
                          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            {quote.description}
                          </p>
                        </div>
                        <div style={{ minWidth: '220px' }}>
                          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Submitted: {new Date(quote.submittedAt).toLocaleString()}
                          </p>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor:
                              quote.status === 'approved' ? '#dcfce7'
                                : quote.status === 'rejected' ? '#fee2e2'
                                  : '#fef3c7',
                            color:
                              quote.status === 'approved' ? '#166534'
                                : quote.status === 'rejected' ? '#991b1b'
                                  : '#92400e'
                          }}>
                            {quote.status}
                          </span>

                          {quote.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                              <button
                                onClick={() => handleQuoteDecision(quote, 'approved')}
                                disabled={processingQuoteId === quote.id}
                                style={{
                                  padding: '0.55rem 0.9rem',
                                  border: 'none',
                                  borderRadius: '0.45rem',
                                  backgroundColor: '#10b981',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  opacity: processingQuoteId === quote.id ? 0.6 : 1
                                }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleQuoteDecision(quote, 'rejected')}
                                disabled={processingQuoteId === quote.id}
                                style={{
                                  padding: '0.55rem 0.9rem',
                                  border: 'none',
                                  borderRadius: '0.45rem',
                                  backgroundColor: '#ef4444',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  opacity: processingQuoteId === quote.id ? 0.6 : 1
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                User Reviews ({reviews.length})
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No reviews found.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', color: '#111827', marginBottom: '0.35rem' }}>
                          {review.name}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                          {review.college}
                        </p>
                        <p style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                          {review.project} | {review.rating}/5
                        </p>
                        <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.35rem' }}>
                          "{review.review}"
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                          Submitted: {review.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReviewId === review.id}
                        style={{
                          padding: '0.6rem',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: deletingReviewId === review.id ? 'not-allowed' : 'pointer',
                          opacity: deletingReviewId === review.id ? 0.6 : 1,
                          transition: 'all 0.3s'
                        }}
                        title="Delete review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;