// Frutas y Verduras Uce - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initPostalCodeForms();
    initContactForm();
    handlePostalCodeDisplay();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
}

/**
 * Initialize postal code forms with validation
 */
function initPostalCodeForms() {
    // Hero form
    const heroForm = document.getElementById('postal-form-hero');
    if (heroForm) {
        heroForm.addEventListener('submit', handlePostalCodeSubmit);
    }
    
    // CTA form
    const ctaForm = document.getElementById('postal-form-cta');
    if (ctaForm) {
        ctaForm.addEventListener('submit', handlePostalCodeSubmit);
    }
}

/**
 * Handle postal code form submission
 * @param {Event} event - Form submit event
 */
function handlePostalCodeSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const postalCodeInput = form.querySelector('input[name="postalCode"]');
    const postalCode = postalCodeInput.value.trim();
    
    // Validate postal code (4-6 digits)
    if (validatePostalCode(postalCode)) {
        // Redirect to about.html with postal code parameter
        window.location.href = `about.html?cp=${encodeURIComponent(postalCode)}`;
    } else {
        showToast('Por favor, ingresa un código postal válido (4-6 dígitos)', 'error');
        
        // Add error styling to input
        postalCodeInput.classList.add('border-red-500', 'focus:ring-red-500');
        postalCodeInput.setAttribute('aria-invalid', 'true');
        
        // Remove error styling after user starts typing
        postalCodeInput.addEventListener('input', function() {
            this.classList.remove('border-red-500', 'focus:ring-red-500');
            this.setAttribute('aria-invalid', 'false');
        }, { once: true });
        
        // Focus on the input for accessibility
        postalCodeInput.focus();
    }
}

/**
 * Validate postal code format (4-6 digits)
 * @param {string} postalCode - The postal code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePostalCode(postalCode) {
    const regex = /^\d{4,6}$/;
    return regex.test(postalCode);
}

/**
 * Display accessible toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success', 'error', 'info')
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;
    
    // Set toast classes based on type
    let bgColor, borderColor, iconClass;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-50 border-green-200';
            borderColor = 'text-green-600';
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-50 border-red-200';
            borderColor = 'text-red-600';
            iconClass = 'fas fa-exclamation-circle';
            break;
        default:
            bgColor = 'bg-blue-50 border-blue-200';
            borderColor = 'text-blue-600';
            iconClass = 'fas fa-info-circle';
    }
    
    toast.className = `${bgColor} border rounded-lg p-4 shadow-lg mb-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    toast.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="${iconClass} ${borderColor}"></i>
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0">
                <button class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                        onclick="closeToast('${toastId}')"
                        aria-label="Cerrar notificación">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeToast(toastId);
    }, 5000);
}

/**
 * Close toast notification
 * @param {string} toastId - The ID of the toast to close
 */
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

/**
 * Handle postal code display on about page
 */
function handlePostalCodeDisplay() {
    // Only run on about.html page
    if (!window.location.pathname.includes('about.html')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const postalCode = urlParams.get('cp');
    
    if (postalCode && validatePostalCode(postalCode)) {
        const displayElement = document.getElementById('postal-code-display');
        const valueElement = document.getElementById('postal-code-value');
        
        if (displayElement && valueElement) {
            valueElement.textContent = postalCode;
            displayElement.classList.remove('hidden');
        }
    }
}

/**
 * Initialize contact form with validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Real-time validation for form fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitText.classList.remove('hidden');
        submitLoading.classList.add('hidden');
        
        // Show success message
        showToast('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Specific field validations
    if (value && fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un correo electrónico válido';
        }
    }
    
    if (value && fieldName === 'firstName' && value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (value && fieldName === 'lastName' && value.length < 2) {
        isValid = false;
        errorMessage = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (value && fieldName === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    // Show/hide error
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

/**
 * Show field error message
 * @param {HTMLElement} field - The field with error
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (!errorElement) return;
    
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);
    } else {
        errorElement.classList.add('hidden');
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Clear field error styling
 * @param {HTMLElement} field - The field to clear error from
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement && !errorElement.classList.contains('hidden')) {
        // Only clear if user is actively typing
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.setAttribute('aria-invalid', 'false');
    }
}