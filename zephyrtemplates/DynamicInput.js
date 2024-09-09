import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicInput extends ZephyrJS {
    static get isCoreTemplate() {
        return false;
    }

    static get observedAttributes() {
        return ['label', 'type', 'placeholder', 'pattern', 'required', 'error-message', 'min', 'max', 'step'];
    }

    constructor() {
        super();
        this._state = {
            label: 'Enter Value',
            type: 'text',
            placeholder: '',
            pattern: '',
            required: false,
            errorMessage: '',
            value: '',
            min: 0,
            max: 100,
            step: 1,
            isValid: true,
            showError: false
        };

        this.patterns = {
            Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            Phone: /^\+?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
            URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            Number: /^\d+$/,
            Alphanumeric: /^[a-zA-Z0-9]+$/
        };

        this.defaultErrorMessages = {
            Email: 'Please enter a valid email address.',
            Phone: 'Please enter a valid phone number.',
            URL: 'Please enter a valid URL.',
            Number: 'Please enter a valid number.',
            Alphanumeric: 'Please enter only letters and numbers.',
            required: 'This field is required.'
        };

        this._uniqueId = `input-${Math.random().toString(36).substr(2, 9)}`;
        this._initialized = false;
    }

    connectedCallback() {
        if (!this._initialized) {
            this.updateStateFromAttributes();
            this.render();
            this._initialized = true;
        }
    }

    updateStateFromAttributes() {
        this._state = {
            ...this._state,
            label: this.getAttribute('label') || this._state.label,
            type: this.getAttribute('type') || this._state.type,
            placeholder: this.getAttribute('placeholder') || this._state.placeholder,
            pattern: this.getAttribute('pattern') || this._state.pattern,
            required: this.hasAttribute('required'),
            errorMessage: this.getAttribute('error-message') || '',
            value: this.getAttribute('value') || this._state.value,
            ...(this._state.type === 'range' ? {
                min: this.getAttribute('min') || 0,
                max: this.getAttribute('max') || 100,
                step: this.getAttribute('step') || 1
            } : {})
        };
    }

    validateInput(value) {
        if (this._state.required && !value) {
            return this.defaultErrorMessages.required;
        }

        if (this._state.pattern) {
            const pattern = this.patterns[this._state.pattern] || new RegExp(this._state.pattern);
            if (!pattern.test(value)) {
                return this._state.errorMessage || this.defaultErrorMessages[this._state.pattern] || 'Invalid input';
            }
        }

        return '';
    }

    handleInput(event) {
        const value = event.target.value;
        const errorMessage = this.validateInput(value);
        const isValid = !errorMessage;

        this._state.value = value;
        this._state.isValid = isValid;
        this._state.errorMessage = errorMessage;
        this._state.showError = !!errorMessage;

        this.updateValidationUI(isValid, errorMessage);

        if (this._state.type === 'range') {
            this._shadowRoot.querySelector(`#${this._uniqueId}-value`).textContent = value;
        }
    }

    updateValidationUI(isValid, errorMessage) {
        const input = this._shadowRoot.querySelector(`#${this._uniqueId}`);
        const errorDiv = this._shadowRoot.querySelector('.error');

        input.style.borderColor = isValid ? '#ccc' : 'red';

        if (errorDiv) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = isValid ? 'none' : 'block';
        } else if (!isValid) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.className = 'error';
            newErrorDiv.textContent = errorMessage;
            this._shadowRoot.appendChild(newErrorDiv);
        }
    }

    render() {
        const { label, type, placeholder, required, value, min, max, step } = this._state;

        if (type === 'range') {
            this._shadowRoot.innerHTML = `
                <style>
                    :host { display: block; font-family: Arial, sans-serif; margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; }
                    input[type="range"] { width: 100%; }
                    .range-value { margin-top: 5px; font-weight: bold; }
                    .error { color: red; font-size: 0.8em; margin-top: 5px; display: none; }
                </style>
                <label for="${this._uniqueId}">${label}</label>
                <input
                    id="${this._uniqueId}"
                    type="range"
                    min="${min}"
                    max="${max}"
                    step="${step}"
                    value="${value}"
                    ${required ? 'required' : ''}
                >
                <div class="range-value" id="${this._uniqueId}-value">${value}</div>
                <div class="error"></div>
            `;
        } else {
            this._shadowRoot.innerHTML = `
                <style>
                    :host { display: block; font-family: Arial, sans-serif; margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; }
                    input { 
                        width: 100%; 
                        padding: 8px; 
                        border: 2px solid #ccc; 
                        border-radius: 4px; 
                        outline: none;
                    }
                    input:focus { border-color: #007bff; }
                    .error { color: red; font-size: 0.8em; margin-top: 5px; display: none; }
                </style>
                <label for="${this._uniqueId}">${label}</label>
                <input
                    id="${this._uniqueId}"
                    type="${type}"
                    placeholder="${placeholder}"
                    value="${value}"
                    ${required ? 'required' : ''}
                >
                <div class="error"></div>
            `;
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        const input = this._shadowRoot.querySelector(`#${this._uniqueId}`);
        input.addEventListener('input', this.handleInput.bind(this));
    }
}

defineCustomElement('zephyr-input', DynamicInput);