import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Globe } from 'lucide-react';
import { apiService } from '../../services/apiService';
import styles from './ContactForm.module.css';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Your distinguished name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please provide a name of at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'An email address is required to correspond.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please specify a valid email format (e.g. name@domain.com).';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'A message detailing your inquiry is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a brief detail of at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await apiService.submitContactInquiry(formData.name, formData.email, formData.message);
      if (response.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      {/* Background visual glows */}
      <div className={styles.glowOverlay}>
        <div className={styles.glowGold}></div>
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>04 / CORRESPONDENCE</span>
          <h2 className={styles.sectionTitle}>Initiate Collaboration</h2>
          <div className={styles.titleDivider}></div>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Direct Connections */}
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>Let us curate something remarkable together.</h3>
            <p className={styles.infoText}>
              Whether you wish to commission a bespoke web portal, discuss digital strategy, or inquire about advisory partnerships—reach out. The desk is always open for exceptional projects.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <Mail size={16} className="gold-text" />
                </div>
                <div>
                  <span className={styles.infoLabel}>DIRECT MAIL</span>
                  <a href="mailto:valerius@example.com" className={styles.infoValue}>
                    valerius@example.com
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <MapPin size={16} className="gold-text" />
                </div>
                <div>
                  <span className={styles.infoLabel}>LOCATION</span>
                  <span className={styles.infoValue}>Worldwide / Remote</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <Globe size={16} className="gold-text" />
                </div>
                <div>
                  <span className={styles.infoLabel}>AVAILABILITY</span>
                  <span className={styles.infoValue}>Open for select commissions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Card / Form */}
          <div className={styles.formContainer}>
            <div className={styles.formGlassCard}>
              {isSuccess ? (
                /* Animated Success Display */
                <div className={styles.successScreen}>
                  <div className={styles.successIconWrapper}>
                    <CheckCircle size={48} className={`${styles.successIcon} gold-text`} />
                  </div>
                  <h3 className={styles.successTitle}>Transmission Received</h3>
                  <p className={styles.successText}>
                    Thank you for reaching out. Your distinguished inquiry has been successfully transmitted. I will review your parameters and correspond shortly.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)} 
                    className="outline-button"
                    style={{ marginTop: '10px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${styles.input} ${formData.name ? styles.hasValue : ''} ${errors.name ? styles.inputError : ''}`}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <label htmlFor="name" className={styles.label}>Your Name</label>
                      {errors.name && (
                        <span id="name-error" className={styles.errorText}>
                          <AlertCircle size={10} /> {errors.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${styles.input} ${formData.email ? styles.hasValue : ''} ${errors.email ? styles.inputError : ''}`}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      <label htmlFor="email" className={styles.label}>Email Address</label>
                      {errors.email && (
                        <span id="email-error" className={styles.errorText}>
                          <AlertCircle size={10} /> {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`${styles.textarea} ${formData.message ? styles.hasValue : ''} ${errors.message ? styles.inputError : ''}`}
                        required
                        rows={5}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      ></textarea>
                      <label htmlFor="message" className={styles.label}>Project Details / Inquiry</label>
                      {errors.message && (
                        <span id="message-error" className={styles.errorText}>
                          <AlertCircle size={10} /> {errors.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gold-button"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isSubmitting ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <>
                        Send Inquiry <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
