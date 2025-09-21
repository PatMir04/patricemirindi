// ==========================================================================
// CONTACT FORM FUNCTIONALITY
// ==========================================================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.messageDiv = document.getElementById('form-message');

        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupValidation();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }

    setupValidation() {
        // Email validation pattern
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                this.validateEmail(e.target);
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        this.setSubmitState('loading');

        try {
            // Simulate form submission - replace with actual endpoint
            await this.submitForm(data);
            this.showMessage('Thank you! Your message has been sent successfully. I\'ll respond within 24-48 hours.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again or email me directly at patricemirindi@gmail.com', 'error');
        } finally {
            this.setSubmitState('default');
        }
    }

    async submitForm(data) {
        // For now, simulate a successful submission
        // In production, this would send to your serverless function or email service

        // Add timestamp and user agent for tracking
        const submissionData = {
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            source: 'PatriceMirindi.github.io'
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In production, you would:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(submissionData)
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Form submission failed');
        // }

        // For demo purposes, log the data
        console.log('Form data would be submitted:', submissionData);

        // Store in localStorage as backup
        const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        submissions.push(submissionData);
        localStorage.setItem('contact_submissions', JSON.stringify(submissions.slice(-10))); // Keep last 10
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Additional email validation
        const emailField = document.getElementById('email');
        if (emailField && !this.validateEmail(emailField)) {
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }

        // Field-specific validation
        switch (fieldName) {
            case 'name':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                }
                break;

            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;

            case 'message':
                if (value && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long.';
                }
                break;
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    validateEmail(field) {
        const email = field.value.trim();
        if (!email) return true; // Let required validation handle empty fields

        const isValid = this.isValidEmail(email);
        this.showFieldError(field, isValid ? '' : 'Please enter a valid email address.');
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add field styling
        if (message) {
            field.classList.add('error');

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = `
                color: var(--danger);
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('error');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Full Name',
            'email': 'Email',
            'organization': 'Organization',
            'subject': 'Subject',
            'message': 'Message',
            'budget': 'Budget'
        };
        return labels[fieldName] || fieldName;
    }

    setSubmitState(state) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        switch (state) {
            case 'loading':
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
                this.submitBtn.disabled = true;
                break;
            case 'default':
            default:
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                this.submitBtn.disabled = false;
                break;
        }
    }

    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';

        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage();
            }, 10000);
        }

        // Scroll to message
        this.messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    hideMessage() {
        this.messageDiv.style.display = 'none';
        this.messageDiv.className = 'form-message';
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contact-form')) {
        window.contactForm = new ContactForm();
    }
});

// Add contact form specific styles
const contactStyles = `
<style>
.form-group input.error,
.form-group textarea.error,
.form-group select.error {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.field-error {
    animation: fadeInUp 0.3s ease-out;
}

.form-message {
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.btn-loading {
    display: none;
    align-items: center;
    gap: 0.5rem;
}

.contact-method:hover .method-icon {
    background: var(--secondary-color);
    transform: scale(1.1);
}

.contact-method {
    transition: var(--transition-fast);
}

@media (max-width: 768px) {
    .contact-form {
        padding: var(--spacing-lg);
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
}
</style>
`;

// Inject contact styles
document.head.insertAdjacentHTML('beforeend', contactStyles);