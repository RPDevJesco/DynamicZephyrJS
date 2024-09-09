import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicModalComponent extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['modal-trigger', 'modal-type', 'modal-size', 'modal-sticky-header', 'modal-background-blur', 'modal-exit-intent'];
    }

    constructor() {
        super();
        this.state = {
            isOpen: false,
            modalType: null,
            modalTrigger: 'click',
            modalSize: 'auto',
            stickyHeader: false,
            backgroundBlur: true,
            exitIntent: false,
            currentStep: 0,
            totalSteps: 0,
        };
        this._isUpdating = false;

        this.defineComputedProperty('progressPercentage', () => {
            return this.state.totalSteps > 0 ? (this.state.currentStep / this.state.totalSteps) * 100 : 0;
        });

        // Bind methods
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('modal-type')) {
            console.error('modal-type is required for zephyr-modal');
        }
        this.setupTrigger();
        this.render();
    }

    setupButtons() {
        const closeButton = this._shadowRoot.querySelector('.close-button');
        const okButton = this._shadowRoot.querySelector('.ok-button');
        const cancelButton = this._shadowRoot.querySelector('.cancel-button');

        if (closeButton) {
            closeButton.addEventListener('click', this.closeModal);
        }
        if (okButton) {
            okButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('modal-ok'));
                this.closeModal();
            });
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('modal-cancel'));
                this.closeModal();
            });
        }

        this.updateButtonVisibility();
    }

    updateButtonVisibility() {
        const footer = this._shadowRoot.querySelector('.modal-footer');
        if (footer) {
            footer.style.display = this.state.exitIntent ? 'flex' : 'none';
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this._isUpdating) return;

        switch (name) {
            case 'modal-trigger':
                this.state.modalTrigger = newValue || 'click';
                this.setupTrigger();
                break;
            case 'modal-type':
                this.state.modalType = newValue;
                break;
            case 'modal-size':
                this.state.modalSize = newValue || 'auto';
                break;
            case 'modal-sticky-header':
                this.state.stickyHeader = newValue === 'true';
                break;
            case 'modal-background-blur':
                this.state.backgroundBlur = newValue !== 'false';
                break;
            case 'modal-exit-intent':
                this.state.exitIntent = newValue === 'true';
                this.updateButtonVisibility();
                break;
        }
        this.updateRendering();
    }

    setupTrigger() {
        this.removeEventListener('mouseenter', this.openModal);
        this.removeEventListener('mouseleave', this.closeModal);
        this.removeEventListener('click', this.toggleModal);

        switch (this.state.modalTrigger) {
            case 'hover':
                this.addEventListener('mouseenter', this.openModal);
                this.addEventListener('mouseleave', this.closeModal);
                break;
            case 'click':
                this.addEventListener('click', this.toggleModal);
                break;
            case 'auto':
                this.openModal();
                break;
        }
    }

    openModal() {
        this.state.isOpen = true;
        this.updateRendering();
        if (this.state.exitIntent) {
            this.setupExitIntent();
        }
    }

    closeModal() {
        this.state.isOpen = false;
        this.updateRendering();
    }

    toggleModal() {
        this.state.isOpen = !this.state.isOpen;
        this.updateRendering();
    }

    setupExitIntent() {
        document.addEventListener('mouseleave', this.handleExitIntent.bind(this));
    }

    handleExitIntent(e) {
        if (e.clientY <= 0) {
            this.openModal();
        }
    }

    nextStep() {
        if (this.state.currentStep < this.state.totalSteps - 1) {
            this.state.currentStep++;
            this.updateProgressBar();
        }
    }

    prevStep() {
        if (this.state.currentStep > 0) {
            this.state.currentStep--;
            this.updateProgressBar();
        }
    }

    updateProgressBar() {
        const progressBarFill = this._shadowRoot.querySelector('.progress-bar-fill');
        if (progressBarFill) {
            progressBarFill.style.width = `${this.state.progressPercentage}%`;
        }
    }

    updateRendering() {
        if (this._isUpdating) return;
        this._isUpdating = true;

        const modalElement = this._shadowRoot.querySelector('.modal-content');
        if (modalElement) {
            modalElement.style.display = this.state.isOpen ? 'block' : 'none';
        }

        if (this.state.isOpen) {
            this.style.display = 'block';  // Show the entire component
            this.setAttribute('modal-type', this.state.modalType || 'info');
            this.setAttribute('modal-size', this.state.modalSize || 'auto');
            this.toggleAttribute('modal-sticky-header', this.state.stickyHeader);
            this.toggleAttribute('modal-background-blur', this.state.backgroundBlur);
            this.updateProgressBar();
            this.updateButtonVisibility();
            requestAnimationFrame(() => this.adjustSize());
        } else {
            this.style.display = 'none';  // Hide the entire component
        }

        this._isUpdating = false;
    }

    adjustSize() {
        const content = this._shadowRoot.querySelector('.modal-content');
        if (!content) return;

        const computedStyle = window.getComputedStyle(content);
        const width = content.offsetWidth + parseInt(computedStyle.marginLeft) + parseInt(computedStyle.marginRight);
        const height = content.offsetHeight + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);

        content.style.width = `${width}px`;
        content.style.height = `${height}px`;
    }

    render() {
        super.render();
        this.updateRendering();
        this.setupButtons();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up event listeners
        this.removeEventListener('mouseenter', this.openModal);
        this.removeEventListener('mouseleave', this.closeModal);
        this.removeEventListener('click', this.toggleModal);
    }
}

// Define the custom element
defineCustomElement('zephyr-modal', DynamicModalComponent);