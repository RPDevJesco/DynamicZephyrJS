import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicForm extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['config'];
    }

    constructor() {
        super();
        this._state = {
            config: {},
            currentStep: 0,
            formData: {},
            errors: {},
            isValid: false
        };
        this._steps = [];
        this._eventHandlers = {};

        this.setConfig = this.setConfig.bind(this);
        this.render = this.render.bind(this);
    }

    async connectedCallback() {
        await super.connectedCallback();
        console.log('DynamicForm connected');
        if (this.hasAttribute('config')) {
            try {
                const config = JSON.parse(this.getAttribute('config'));
                this.setConfig(config);
            } catch (error) {
                console.error('Error parsing config attribute:', error);
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'config') {
            try {
                const config = JSON.parse(newValue);
                this.setConfig(config);
            } catch (error) {
                console.error('Invalid JSON configuration:', error);
            }
        }
    }

    setConfig(config) {
        console.log('Setting config:', config);
        this._state.config = config;
        this._steps = config.steps || [{ fields: config.fields || [] }];
        this._eventHandlers = config.events || {};
        console.log('Steps after setConfig:', this._steps);
        console.log('Event handlers:', this._eventHandlers);
        this.render();
    }

    render() {
        if (!this._shadowRoot) {
            console.error('Shadow root not available');
            return;
        }

        console.log('Rendering form, current step:', this._state.currentStep);
        console.log('Steps:', this._steps);

        const { currentStep } = this._state;
        const step = this._steps[currentStep];

        if (!step) {
            console.error('No step found for index:', currentStep);
            return;
        }

        this._shadowRoot.innerHTML = `
        <style>
            /* ... existing styles ... */
        </style>
        <div class="progress-bar">
            <div class="progress" style="width: ${(currentStep / (this._steps.length - 1)) * 100}%"></div>
        </div>
        <form>
            <div class="form-step">
                ${this.renderFields(step.fields)}
            </div>
            <div class="navigation">
                ${currentStep > 0 ? '<zephyr-button type="button" class="prev-button">Previous</zephyr-button>' : ''}
                ${currentStep < this._steps.length - 1
            ? '<zephyr-button type="button" class="next-button">Next</zephyr-button>'
            : '<zephyr-button type="submit" class="submit-button">Submit</zephyr-button>'
        }
            </div>
        </form>
    `;

        console.log('Rendered form data:', this._state.formData);
        this.attachEventListeners();

        // Set initial values after rendering
        Object.entries(this._state.formData).forEach(([name, value]) => {
            this.updateField(name, value, this._state.errors[name]);
        });
    }

    renderFields(fields) {
        if (!fields || !Array.isArray(fields)) {
            console.error('Invalid fields configuration:', fields);
            return '';
        }

        return fields.map(field => {
            const { type, name, label, pattern, ...props } = field;
            const value = this._state.formData[name] || '';
            const error = this._state.errors[name];

            let component;
            switch (type) {
                case 'textarea':
                    component = `<zephyr-textarea label="${label}" name="${name}" ${this.getPropsString(props)}>${value}</zephyr-textarea>`;
                    break;
                case 'button':
                    component = `<zephyr-button name="${name}" ${this.getPropsString(props)}>${label}</zephyr-button>`;
                    break;
                default:
                    const patternAttr = pattern ? `pattern="${pattern}"` : '';
                    component = `<zephyr-input type="${type}" label="${label}" name="${name}" value="${value}" ${patternAttr} ${this.getPropsString(props)}></zephyr-input>`;
            }

            return `
            <div class="form-field">
                ${component}
                ${error ? `<div class="error-message">${error}</div>` : ''}
            </div>
        `;
        }).join('');
    }

    getPropsString(props) {
        return Object.entries(props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }

    attachEventListeners() {
        const form = this._shadowRoot.querySelector('form');

        form.addEventListener('zephyr-input-change', this.handleInputChange.bind(this));
        form.addEventListener('zephyr-textarea-change', this.handleInputChange.bind(this));

        form.addEventListener('submit', this.handleSubmit.bind(this));

        const prevButton = this._shadowRoot.querySelector('.prev-button');
        const nextButton = this._shadowRoot.querySelector('.next-button');

        if (prevButton) {
            prevButton.addEventListener('click', this.prevStep.bind(this));
        }

        if (nextButton) {
            nextButton.addEventListener('click', this.nextStep.bind(this));
        }
    }

    handleInputChange(event) {
        console.log('Raw event:', event); // Debugging
        const { name, value, isValid, errorMessage } = event.detail;

        if (!name) {
            console.error('Input event missing name:', event);
            return;
        }

        this._state.formData[name] = value;
        if (isValid !== undefined) {
            this._state.errors[name] = errorMessage || '';
        } else {
            this.validateField(name, value);
        }

        console.log('Updated form data:', this._state.formData); // Debugging

        if (this._eventHandlers.onInput) {
            const customEvent = {
                target: { name, value },
                formData: { ...this._state.formData },
                errors: { ...this._state.errors }
            };
            this._eventHandlers.onInput(customEvent);
        }

        this.updateField(name, value, this._state.errors[name]);
    }

    validateField(name, value) {
        const field = this._steps[this._state.currentStep].fields.find(f => f.name === name);
        if (!field) return;

        let error = '';

        if (field.required && value.trim() === '') {
            error = `${field.label} is required`;
        } else if (field.pattern) {
            // The pattern validation will be handled by the zephyr-input component
            // We can add custom error messages here if needed
            if (field.patternError) {
                error = field.patternError;
            }
        } else if (field.minLength && value.length < field.minLength) {
            error = `${field.label} must be at least ${field.minLength} characters`;
        } else if (field.maxLength && value.length > field.maxLength) {
            error = `${field.label} must be no more than ${field.maxLength} characters`;
        }

        if (error) {
            this._state.errors[name] = error;
        } else {
            delete this._state.errors[name];
        }

        this.updateFieldError(name, error);
        this.render(); // Re-render to show/hide error messages immediately
    }

    updateFieldError(name, error) {
        const errorElement = this._shadowRoot.querySelector(`[name="${name}"] + .error-message`);
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

    updateField(name, value, error) {
        const field = this._shadowRoot.querySelector(`[name="${name}"]`);
        if (field) {
            if (field.tagName.toLowerCase() === 'zephyr-textarea') {
                field.setValue(value);
            } else {
                field.value = value;
            }

            // Update error message
            let errorElement = this._shadowRoot.querySelector(`[name="${name}"] + .error-message`);
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            errorElement.textContent = error || '';
            errorElement.style.display = error ? 'block' : 'none';

            // Ensure the field maintains focus if it was focused before
            if (document.activeElement === field) {
                field.focus();
            }
        }
    }

    validateStep() {
        const currentFields = this._steps[this._state.currentStep].fields;
        currentFields.forEach(field => {
            this.validateField(field.name, this._state.formData[field.name] || '');
        });

        return Object.keys(this._state.errors).length === 0;
    }

    prevStep() {
        if (this._state.currentStep > 0) {
            this._state.currentStep--;
            this.render();
            if (this._eventHandlers.onStepChange) {
                this._eventHandlers.onStepChange({ step: this._state.currentStep });
            }
        }
    }

    nextStep() {
        if (this.validateStep()) {
            if (this._state.currentStep < this._steps.length - 1) {
                this._state.currentStep++;
                this.render();
                if (this._eventHandlers.onStepChange) {
                    this._eventHandlers.onStepChange({ step: this._state.currentStep });
                }
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.validateStep()) {
            this._state.isValid = true;
            console.log('Form submitted with data:', this._state.formData);
            if (this._eventHandlers.onSubmit) {
                this._eventHandlers.onSubmit({ formData: this._state.formData });
            }
        } else {
            this._state.isValid = false;
            if (this._eventHandlers.onValidationFailed) {
                this._eventHandlers.onValidationFailed({ errors: this._state.errors });
            }
        }
    }

    getFormData() {
        return this._state.formData;
    }

    resetForm() {
        this._state.formData = {};
        this._state.errors = {};
        this._state.currentStep = 0;
        this._state.isValid = false;
        this.render();
        if (this._eventHandlers.onReset) {
            this._eventHandlers.onReset();
        }
    }

    updateFormData(name, value) {
        this._state.formData[name] = value;
        this.validateField(name, value);
        this.render();
    }
}

defineCustomElement('zephyr-form', DynamicForm);