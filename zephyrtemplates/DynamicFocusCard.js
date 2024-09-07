import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicFocusCard extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    constructor() {
        super();
        this.state = {
            width: 300,
            height: 200,
            zoomFactor: 2,
            focusSize: 100,
            imageSrc: '',
            imageAlt: '',
            imageLoaded: false,
            error: null
        };
        this._imageContainer = null;
        this._focusArea = null;
        this._loadingMessage = null;
        this._image = null;
    }

    static get observedAttributes() {
        return ['width', 'height', 'zoom-factor', 'focus-size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'width':
            case 'height':
            case 'focus-size':
                this.setState({ [name]: parseInt(newValue, 10) });
                break;
            case 'zoom-factor':
                this.setState({ zoomFactor: parseFloat(newValue) });
                break;
        }
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.render();
        this.setupEventListeners();
        await this.loadImage();
    }

    setupEventListeners() {
        this.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.addEventListener('touchend', this.handleMouseLeave.bind(this));
    }

    async loadImage() {
        const imgElement = this.querySelector('img');
        if (imgElement) {
            this.setState({ imageSrc: imgElement.src, imageAlt: imgElement.alt });
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        if (!this.state.width) this.setState({ width: img.naturalWidth });
                        if (!this.state.height) this.setState({ height: img.naturalHeight });
                        this.setState({ imageLoaded: true });
                        resolve();
                    };
                    img.onerror = () => {
                        console.error('Failed to load image');
                        reject(new Error('Failed to load image'));
                    };
                    img.src = this.state.imageSrc;
                });
                this.updateImageVisibility();
                this.render(); // Re-render after image is loaded
            } catch (error) {
                console.error('Error loading image:', error);
                this.setState({ error: error.message });
            }
        } else {
            console.error('No image element found');
            this.setState({ error: 'No image element found' });
        }
    }

    handleMouseMove(event) {
        if (!this._imageContainer || !this._focusArea) return;

        const rect = this.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        this.updateZoom(x, y);
    }

    handleTouchMove(event) {
        event.preventDefault();
        if (!this._imageContainer || !this._focusArea) return;

        const touch = event.touches[0];
        const rect = this.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;

        this.updateZoom(x, y);
    }

    handleMouseLeave() {
        if (!this._imageContainer || !this._focusArea) return;

        this._imageContainer.style.transform = 'scale(1)';
        this._focusArea.style.opacity = '0';
    }

    updateZoom(x, y) {
        const { zoomFactor } = this.state;
        const focusX = `${x * 100}%`;
        const focusY = `${y * 100}%`;

        this._imageContainer.style.transform = `scale(${zoomFactor})`;
        this._imageContainer.style.transformOrigin = `${focusX} ${focusY}`;
        this._focusArea.style.left = focusX;
        this._focusArea.style.top = focusY;
        this._focusArea.style.opacity = '1';
    }

    updateImageVisibility() {
        if (this._image) {
            this._image.style.display = this.state.imageLoaded ? 'block' : 'none';
        }
        if (this._loadingMessage) {
            this._loadingMessage.style.display = this.state.imageLoaded ? 'none' : 'block';
        }
    }

    render() {
        const { width, height, focusSize, imageSrc, imageAlt, imageLoaded, error } = this.state;

        // Clear existing content
        this._shadowRoot.innerHTML = '';

        // Create and append style element
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                overflow: hidden;
                width: ${width}px;
                height: ${height}px;
                position: relative;
            }
            .image-container {
                width: 100%;
                height: 100%;
                transition: transform 0.2s ease-out;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .focus-area {
                position: absolute;
                width: ${focusSize}px;
                height: ${focusSize}px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                pointer-events: none;
                transition: all 0.2s ease-out;
                transform: translate(-50%, -50%);
                opacity: 0;
            }
            .error-message, .loading-message {
                color: red;
                text-align: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
            }
        `;
        this._shadowRoot.appendChild(style);

        // Create and append image container
        this._imageContainer = document.createElement('div');
        this._imageContainer.className = 'image-container';
        this._image = document.createElement('img');
        this._image.src = imageSrc;
        this._image.alt = imageAlt;
        this._imageContainer.appendChild(this._image);
        this._shadowRoot.appendChild(this._imageContainer);

        // Create and append focus area
        this._focusArea = document.createElement('div');
        this._focusArea.className = 'focus-area';
        this._shadowRoot.appendChild(this._focusArea);

        // Add error or loading message if necessary
        if (error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = error;
            this._shadowRoot.appendChild(errorMessage);
        } else if (!imageLoaded) {
            this._loadingMessage = document.createElement('div');
            this._loadingMessage.className = 'loading-message';
            this._loadingMessage.textContent = 'Loading image...';
            this._shadowRoot.appendChild(this._loadingMessage);
        }

        this.updateImageVisibility();
    }
}

defineCustomElement('zephyr-focus-card', DynamicFocusCard);