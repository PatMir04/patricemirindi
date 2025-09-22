/**
 * Professional Contact Form Handler
 * Handles form validation, submission, and user feedback
 * Integrates with Formspree for email delivery to patricemirindi@gmail.com
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.statusDiv = document.getElementById('form-status');
        this.formFields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            organization: document.getElementById('organization'),
            projectType: document.getElementById('project-type'),
            timeline: document.getElementById('timeline'),
            budget: document.getElementById('budget'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message'),
            newsletter: document.getElementById('newsletter')
        };
        
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupRealTimeValidation();
            this.addFormStyles();
        }
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.values(this.formFields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
        
        // Auto-resize textarea
        if (this.formFields.message) {
            this.formFields.message.addEventListener('input', (e) => {
                this.autoResizeTextarea(e.target);
            });
        }
    }

    setupRealTimeValidation() {
        // Email validation
        if (this.formFields.email) {
            this.formFields.email.addEventListener('input', (e) => {
                const email = e.target.value;
                if (email && !this.isValidEmail(email)) {
                    this.showFieldError(e.target, 'Please enter a valid email address');
                } else {
                    this.clearFieldError(e.target);
                }
            });
        }
        
        // Character count for message
        if (this.formFields.message) {
            this.addCharacterCounter(this.formFields.message, 1000);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showStatus('Please correct the errors above and try again.', 'error');
            return;
        }
        
        this.setSubmitting(true);
        
        try {
            const formData = new FormData(this.form);
            
            // Add additional data
            formData.append('_replyto', this.formFields.email.value);
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.handleSuccess();
            } else {
                const data = await response.json();
                this.handleError(data.errors || 'There was an error sending your message.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleError('Network error. Please check your connection and try again.');
        }
        
        this.setSubmitting(false);
    }

    validateForm() {
        let isValid = true;
        
        // Required fields validation
        const requiredFields = {
            name: 'Name is required',
            email: 'Email address is required',
            subject: 'Subject is required',
            message: 'Message is required'
        };
        
        Object.entries(requiredFields).forEach(([fieldName, errorMsg]) => {
            const field = this.formFields[fieldName];
            if (!field.value.trim()) {
                this.showFieldError(field, errorMsg);
                isValid = false;
            }
        });
        
        // Email format validation
        if (this.formFields.email.value && !this.isValidEmail(this.formFields.email.value)) {
            this.showFieldError(this.formFields.email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Message length validation
        if (this.formFields.message.value.length < 20) {
            this.showFieldError(this.formFields.message, 'Please provide more details (minimum 20 characters)');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const fieldName = field.getAttribute('id');
        const value = field.value.trim();
        
        // Clear previous errors
        this.clearFieldError(field);
        
        switch (fieldName) {
            case 'name':
                if (!value) {
                    this.showFieldError(field, 'Name is required');
                }
                break;
            case 'email':
                if (!value) {
                    this.showFieldError(field, 'Email is required');
                } else if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                }
                break;
            case 'subject':
                if (!value) {
                    this.showFieldError(field, 'Subject is required');
                }
                break;
            case 'message':
                if (!value) {
                    this.showFieldError(field, 'Message is required');
                } else if (value.length < 20) {
                    this.showFieldError(field, 'Please provide more details (minimum 20 characters)');
                }
                break;
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    addCharacterCounter(field, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = `0 / ${maxLength}`;
        field.parentNode.appendChild(counter);
        
        field.addEventListener('input', () => {
            const currentLength = field.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
            
            if (currentLength >= maxLength) {
                counter.classList.add('error');
            } else {
                counter.classList.remove('error');
            }
        });
    }

    handleSuccess() {
        this.showStatus(
            '✅ Thank you! Your message has been sent successfully. I\'ll respond within 24 hours.',
            'success'
        );
        
        // Reset form
        this.form.reset();
        
        // Clear any field errors
        Object.values(this.formFields).forEach(field => {
            if (field) this.clearFieldError(field);
        });
        
        // Scroll to status message
        this.statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Track successful submission (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submission', {
                'event_category': 'engagement',
                'event_label': 'contact_form'
            });
        }
    }

    handleError(errorMessage) {
        let message = '❌ Sorry, there was an error sending your message. ';
        
        if (typeof errorMessage === 'string') {
            message += errorMessage;
        } else if (Array.isArray(errorMessage)) {
            message += errorMessage.map(err => err.message || err).join(', ');
        } else {
            message += 'Please try again or contact me directly at patricemirindi@gmail.com.';
        }
        
        message += ' Alternatively, you can email me directly at patricemirindi@gmail.com.';
        
        this.showStatus(message, 'error');
    }

    showStatus(message, type) {
        this.statusDiv.innerHTML = message;
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.style.display = 'block';
        
        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusDiv.style.display = 'none';
            }, 10000);
        }
    }

    setSubmitting(isSubmitting) {
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.form.style.opacity = '0.7';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            this.form.style.opacity = '1';
        }
    }

    addFormStyles() {
        const styles = `
            <style>
            /* Professional Contact Form Styles */
            .contact-grid {
                display: grid;
                grid-template-columns: 1.2fr 0.8fr;
                gap: 4rem;
                align-items: start;
            }
            
            .contact-form-section {
                background: white;
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 15px 35px rgba(0, 64, 133, 0.1);
                border: 2px solid #F4F7FC;
                position: relative;
                overflow: hidden;
            }
            
            .contact-form-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(135deg, #004085, #FF6600);
            }
            
            .contact-form-section h2 {
                color: #004085;
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: bold;
            }
            
            .contact-form-section > p {
                color: #6C757D;
                margin-bottom: 3rem;
                font-size: 1.125rem;
                line-height: 1.6;
            }
            
            .professional-form {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .form-group label {
                font-weight: 600;
                color: #004085;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: 'Avenir', sans-serif;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                padding: 1rem 1.25rem;
                border: 2px solid #E2E8F0;
                border-radius: 12px;
                font-size: 1rem;
                font-family: 'Avenir', sans-serif;
                transition: all 0.3s ease;
                background: #F8FAFC;
                color: #1E293B;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #004085;
                background: white;
                box-shadow: 0 0 0 3px rgba(0, 64, 133, 0.1);
                transform: translateY(-1px);
            }
            
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #EF4444;
                background: #FEF2F2;
            }
            
            .form-group textarea {
                min-height: 120px;
                resize: vertical;
                line-height: 1.6;
            }
            
            .field-error {
                color: #EF4444;
                font-size: 0.875rem;
                font-weight: 500;
                margin-top: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-family: 'Avenir', sans-serif;
            }
            
            .field-error::before {
                content: '⚠';
                font-size: 0.75rem;
            }
            
            .character-counter {
                font-size: 0.8rem;
                color: #6C757D;
                text-align: right;
                margin-top: 0.25rem;
                font-family: 'Avenir', sans-serif;
            }
            
            .character-counter.warning {
                color: #F59E0B;
            }
            
            .character-counter.error {
                color: #EF4444;
            }
            
            .checkbox-group {
                margin: 1rem 0;
            }
            
            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
                color: #6C757D;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .checkbox-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                accent-color: #004085;
            }
            
            .form-actions {
                margin-top: 2rem;
                display: flex;
                justify-content: center;
            }
            
            .form-status {
                margin-top: 2rem;
                padding: 1.25rem;
                border-radius: 12px;
                font-weight: 500;
                text-align: center;
                display: none;
                font-family: 'Avenir', sans-serif;
                line-height: 1.6;
            }
            
            .form-status.success {
                background: #F0FDF4;
                color: #15803D;
                border: 2px solid #22C55E;
            }
            
            .form-status.error {
                background: #FEF2F2;
                color: #DC2626;
                border: 2px solid #EF4444;
            }
            
            /* Contact Info Section */
            .contact-info-section {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .contact-info-section h2 {
                color: #004085;
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .contact-methods-list {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .contact-method {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                padding: 2rem;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 64, 133, 0.1);
                border: 2px solid #F4F7FC;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .contact-method::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(135deg, #004085, #FF6600);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .contact-method:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0, 64, 133, 0.15);
                border-color: #FF6600;
            }
            
            .contact-method:hover::before {
                transform: scaleX(1);
            }
            
            .method-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #004085, #FF6600);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                flex-shrink: 0;
                box-shadow: 0 6px 20px rgba(0, 64, 133, 0.3);
            }
            
            .method-content h3 {
                color: #004085;
                margin-bottom: 0.5rem;
                font-size: 1.25rem;
                font-weight: bold;
            }
            
            .method-content p {
                margin-bottom: 0.5rem;
            }
            
            .method-content a {
                color: #004085;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s ease;
            }
            
            .method-content a:hover {
                color: #FF6600;
            }
            
            .method-note {
                font-size: 0.875rem;
                color: #6C757D;
                font-style: italic;
            }
            
            /* Stats Grid */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .stat-card {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 6px 20px rgba(0, 64, 133, 0.1);
                border: 2px solid #F4F7FC;
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0, 64, 133, 0.15);
                border-color: #FF6600;
            }
            
            .stat-number {
                display: block;
                font-size: 2rem;
                font-weight: bold;
                color: #004085;
                margin-bottom: 0.5rem;
                font-family: 'Avenir', sans-serif;
            }
            
            .stat-label {
                font-size: 0.875rem;
                color: #6C757D;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Services Overview */
            .services-overview {
                background: #F8FAFC;
                padding: 2rem;
                border-radius: 15px;
                border: 2px solid #E2E8F0;
            }
            
            .services-overview h3 {
                color: #004085;
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
            }
            
            .services-list {
                list-style: none;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .services-list li {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: #374151;
                font-weight: 500;
                padding: 0.75rem;
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            
            .services-list li:hover {
                background: white;
                transform: translateX(5px);
            }
            
            .services-list li i {
                color: #FF6600;
                font-size: 1.125rem;
                width: 20px;
                flex-shrink: 0;
            }
            
            /* Process Grid */
            .process-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 3rem;
            }
            
            .process-step {
                text-align: center;
                position: relative;
            }
            
            .step-number {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #004085, #FF6600);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0 auto 1.5rem;
                box-shadow: 0 8px 20px rgba(0, 64, 133, 0.3);
            }
            
            .step-content h3 {
                color: #004085;
                margin-bottom: 1rem;
                font-size: 1.25rem;
                font-weight: bold;
            }
            
            .step-content p {
                color: #6C757D;
                line-height: 1.6;
                margin: 0;
            }
            
            /* Responsive Design */
            @media (max-width: 1024px) {
                .contact-grid {
                    grid-template-columns: 1fr;
                    gap: 3rem;
                }
                
                .process-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
                
                .contact-form-section {
                    padding: 2rem;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                
                .process-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 480px) {
                .contact-form-section {
                    padding: 1.5rem;
                }
                
                .contact-method {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.contactFormHandler = new ContactFormHandler();
    console.log('Professional Contact Form initialized');
});