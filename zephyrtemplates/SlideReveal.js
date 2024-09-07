import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class SlideReveal extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['orientation', 'reveal-percentage', 'width', 'height'];
    }

    constructor() {
        super();
        this.state = {
            orientation: 'horizontal',
            revealPercentage: 50,
            isDragging: false,
            width: 'auto',
            height: 'auto',
            imageWidth: 0,
            imageHeight: 0
        };

        this.startDragging = this.startDragging.bind(this);
        this.drag = this.drag.bind(this);
        this.stopDragging = this.stopDragging.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        requestAnimationFrame(() => {
            this.setupEventListeners();
            this.loadImages();
            this.updateReveal();
        });
    }

    setupEventListeners() {
        this.addEventListener('mousedown', this.startDragging);
        this.addEventListener('touchstart', this.startDragging);
        window.addEventListener('mousemove', this.drag);
        window.addEventListener('touchmove', this.drag);
        window.addEventListener('mouseup', this.stopDragging);
        window.addEventListener('touchend', this.stopDragging);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('mousedown', this.startDragging);
        this.removeEventListener('touchstart', this.startDragging);
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('touchmove', this.drag);
        window.removeEventListener('mouseup', this.stopDragging);
        window.removeEventListener('touchend', this.stopDragging);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name) {
            case 'orientation':
                this.setState({ orientation: newValue });
                break;
            case 'reveal-percentage':
                this.setState({ revealPercentage: parseFloat(newValue) });
                break;
            case 'width':
                this.setState({ width: newValue || 'auto' });
                break;
            case 'height':
                this.setState({ height: newValue || 'auto' });
                break;
        }
        this.updateReveal();
    }

    loadImages() {
        const backgroundImg = this.querySelector('[slot="background"]');
        const foregroundImg = this.querySelector('[slot="foreground"]');

        if (backgroundImg && foregroundImg) {
            backgroundImg.addEventListener('load', this.handleImageLoad);
            foregroundImg.addEventListener('load', this.handleImageLoad);

            if (backgroundImg.complete) this.handleImageLoad({ target: backgroundImg });
            if (foregroundImg.complete) this.handleImageLoad({ target: foregroundImg });
        }
    }

    handleImageLoad(event) {
        const { naturalWidth, naturalHeight } = event.target;
        this.setState({
            imageWidth: Math.max(this.state.imageWidth, naturalWidth),
            imageHeight: Math.max(this.state.imageHeight, naturalHeight)
        });
        this.updateDimensions();
        this.updateReveal();
    }

    updateDimensions() {
        if (this.state.width === 'auto' && this.state.height === 'auto') {
            this.style.width = `${this.state.imageWidth}px`;
            this.style.height = `${this.state.imageHeight}px`;
        } else if (this.state.width === 'auto') {
            const aspectRatio = this.state.imageWidth / this.state.imageHeight;
            const height = parseFloat(this.state.height);
            this.style.width = `${height * aspectRatio}px`;
            this.style.height = this.state.height;
        } else if (this.state.height === 'auto') {
            const aspectRatio = this.state.imageWidth / this.state.imageHeight;
            const width = parseFloat(this.state.width);
            this.style.width = this.state.width;
            this.style.height = `${width / aspectRatio}px`;
        } else {
            this.style.width = this.state.width;
            this.style.height = this.state.height;
        }
    }

    startDragging(event) {
        event.preventDefault();
        this.setState({ isDragging: true });
    }

    drag(event) {
        if (!this.state.isDragging) return;

        const rect = this.getBoundingClientRect();
        const x = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
        const y = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;

        let percentage;
        if (this.state.orientation === 'horizontal') {
            percentage = ((x - rect.left) / rect.width) * 100;
        } else {
            percentage = ((y - rect.top) / rect.height) * 100;
        }

        percentage = Math.max(0, Math.min(100, percentage));
        this.setState({ revealPercentage: percentage });
        this.updateReveal();
    }

    stopDragging() {
        this.setState({ isDragging: false });
    }

    updateReveal() {
        const foreground = this._shadowRoot.querySelector('.foreground');
        const handle = this._shadowRoot.querySelector('.drag-handle');

        if (foreground && handle) {
            if (this.state.orientation === 'horizontal') {
                foreground.style.clipPath = `inset(0 ${100 - this.state.revealPercentage}% 0 0)`;
                handle.style.left = `calc(${this.state.revealPercentage}% - 2px)`;
                handle.style.top = '0';
                handle.style.height = '100%';
                handle.style.width = '4px';
            } else {
                foreground.style.clipPath = `inset(0 0 ${100 - this.state.revealPercentage}% 0)`;
                handle.style.top = `calc(${this.state.revealPercentage}% - 2px)`;
                handle.style.left = '0';
                handle.style.width = '100%';
                handle.style.height = '4px';
            }
        }
    }

    render() {
        this._shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    overflow: hidden;
                }
                .image-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .background, .foreground {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .foreground {
                    clip-path: inset(0 50% 0 0);
                }
                .drag-handle {
                    position: absolute;
                    background-color: #fff;
                    cursor: ${this.state.orientation === 'horizontal' ? 'ew-resize' : 'ns-resize'};
                    z-index: 10;
                    box-shadow: 0 0 5px rgba(0,0,0,0.5);
                }
                ::slotted(img) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
            </style>
            <div class="image-container">
                <div class="background">
                    <slot name="background"></slot>
                </div>
                <div class="foreground">
                    <slot name="foreground"></slot>
                </div>
                <div class="drag-handle"></div>
            </div>
        `;
    }
}

defineCustomElement('zephyr-slide-reveal', SlideReveal);