import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicCard extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    constructor() {
        super();
        this.state = {
            flipped: false,
            expanded: false,
            active: true,
            frontImage: '',
            backImage: '',
            flipOn: 'both' // 'hover', 'click', or 'both'
        };
    }

    static get observedAttributes() {
        return ['data-flip', 'data-expand', 'data-active', 'front-image', 'back-image', 'data-flip-on'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'data-flip':
                this.state.flipped = newValue !== 'false';
                break;
            case 'data-expand':
                this.state.expanded = newValue !== 'false';
                break;
            case 'data-active':
                this.state.active = newValue !== 'false';
                break;
            case 'front-image':
                this.state.frontImage = newValue || '';
                break;
            case 'back-image':
                this.state.backImage = newValue || '';
                break;
            case 'data-flip-on':
                this.state.flipOn = newValue || 'both';
                break;
        }
        this.updateComponent();
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListeners();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListeners();
    }

    addEventListeners() {
        if (this.state.flipOn === 'click' || this.state.flipOn === 'both') {
            this.addEventListener('click', this.handleClick);
        }
        if (this.state.flipOn === 'hover' || this.state.flipOn === 'both') {
            this.addEventListener('mouseenter', this.handleHover);
            this.addEventListener('mouseleave', this.handleHover);
        }
    }

    removeEventListeners() {
        this.removeEventListener('click', this.handleClick);
        this.removeEventListener('mouseenter', this.handleHover);
        this.removeEventListener('mouseleave', this.handleHover);
    }

    handleClick = () => {
        if (this.state.flipOn === 'click' || this.state.flipOn === 'both') {
            this.toggleFlip();
        }
    }

    handleHover = (event) => {
        if (this.state.flipOn === 'hover' || this.state.flipOn === 'both') {
            this.state.flipped = event.type === 'mouseenter';
            this.updateComponent();
        }
    }

    toggleFlip() {
        this.state.flipped = !this.state.flipped;
        this.updateComponent();
    }

    updateComponent() {
        this.render();
    }

    createStyles() {
        return `
            :host {
                display: block;
                perspective: 1000px;
                width: 300px;
                height: 200px;
            }
            .card {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                transition: transform 0.6s;
                cursor: pointer;
            }
            .card.flipped {
                transform: rotateY(180deg);
            }
            .front, .back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
                padding: 20px;
                box-sizing: border-box;
                background-color: var(--background-color, #ffffff);
                color: var(--text-color, #000000);
            }
            .back {
                transform: rotateY(180deg);
            }
            .image {
                width: 100%;
                height: 100px;
                background-size: cover;
                background-position: center;
                border-radius: 10px 10px 0 0;
            }
            .status-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: ${this.state.active ? 'green' : 'red'};
            }
        `;
    }

    render() {
        const cardClass = `card ${this.state.flipped ? 'flipped' : ''}`;

        this._shadowRoot.innerHTML = `
            <style>${this.createStyles()}</style>
            <div class="${cardClass}">
                <div class="front">
                    ${this.state.frontImage ? `<div class="image" style="background-image: url(${this.state.frontImage});"></div>` : ''}
                    <div class="status-indicator"></div>
                    <slot name="front"></slot>
                </div>
                <div class="back">
                    ${this.state.backImage ? `<div class="image" style="background-image: url(${this.state.backImage});"></div>` : ''}
                    <slot name="back"></slot>
                </div>
            </div>
        `;
    }
}

defineCustomElement('zephyr-card', DynamicCard);