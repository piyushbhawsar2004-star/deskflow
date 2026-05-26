import { useState } from 'react';
import './CreateTicketModal.css';

function CreateTicketModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onCreate(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button 
            className="btn-close"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          {errors.submit && (
            <div className="form-error">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              maxLength="200"
              className={errors.subject ? 'input-error' : ''}
            />
            <div className="field-meta">
              {errors.subject && (
                <span className="error-message">{errors.subject}</span>
              )}
              <span className="char-count">{formData.subject.length}/200</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the issue"
              rows="6"
              maxLength="5000"
              className={errors.description ? 'input-error' : ''}
            />
            <div className="field-meta">
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
              <span className="char-count">{formData.description.length}/5000</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Customer Email *</label>
            <input
              id="email"
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="customer@example.com"
              className={errors.customerEmail ? 'input-error' : ''}
            />
            {errors.customerEmail && (
              <span className="error-message">{errors.customerEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketModal;
