import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class AdaptiveGridLayout extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    constructor() {
        super();
        this.state = {
            columnCount: this.calculateColumnCount(),
        };
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }

    connectedCallback() {
        super.connectedCallback();
        this.observer.observe(this, { childList: true, subtree: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.observer.disconnect();
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        this.updateGridLayout();
    }

    calculateColumnCount() {
        const contentTypes = this.getContentTypes();
        const screenWidth = window.innerWidth;

        const visualContent = contentTypes.images + contentTypes.videos + contentTypes.embedded;
        const textualContent = contentTypes.texts + contentTypes.headings + contentTypes.lists;
        const complexContent = contentTypes.tables + contentTypes.forms;

        if (screenWidth > 1200) {
            if (visualContent > textualContent) {
                return 3;
            } else if (complexContent > 0) {
                return 2;
            } else {
                return 2;
            }
        } else if (screenWidth > 800) {
            return 2;
        } else {
            return 1;
        }
    }

    getContentTypes() {
        const contentTypes = {
            texts: 0,
            images: 0,
            videos: 0,
            headings: 0,
            lists: 0,
            tables: 0,
            forms: 0,
            audio: 0,
            embedded: 0,
            custom: 0
        };

        this.querySelectorAll('*').forEach(element => {
            const tagName = element.tagName.toLowerCase();
            if (['img'].includes(tagName)) {
                contentTypes.images++;
            } else if (['video'].includes(tagName)) {
                contentTypes.videos++;
            } else if (['p', 'span', 'div'].includes(tagName)) {
                contentTypes.texts++;
            } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
                contentTypes.headings++;
            } else if (['ul', 'ol', 'li'].includes(tagName)) {
                contentTypes.lists++;
            } else if (['table'].includes(tagName)) {
                contentTypes.tables++;
            } else if (['form', 'input', 'textarea', 'select'].includes(tagName)) {
                contentTypes.forms++;
            } else if (['audio'].includes(tagName)) {
                contentTypes.audio++;
            } else if (['iframe'].includes(tagName)) {
                contentTypes.embedded++;
            } else if (tagName.includes('-')) {
                contentTypes.custom++;
            }
        });

        return contentTypes;
    }

    handleMutations(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                this.updateGridLayout();
            }
        }
    }

    updateGridLayout() {
        const columnCount = this.state.columnCount;
        const grid = this._shadowRoot.querySelector('.grid');
        if (grid) {
            grid.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
        }
    }

    async componentDidMount() {
        this.updateGridLayout();
        window.addEventListener('resize', this.updateGridLayout.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGridLayout.bind(this));
    }

    async loadTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .grid {
                    display: grid;
                    gap: 16px;
                }
                .grid-item {
                    background-color: var(--body-bg, #fff);
                    padding: 16px;
                    border-radius: 8px;
                    min-height: 150px; /* Ensure grid items have a minimum height */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            <div class="grid">
                <slot></slot>
            </div>
        `;
        return template;
    }
}

// Define the custom element
defineCustomElement('zephyr-grid-layout', AdaptiveGridLayout);