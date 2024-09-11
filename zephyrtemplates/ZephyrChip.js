import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

class ZephyrChip extends ZephyrJS {
    static isCoreTemplate = true;
    static attributesList = ['label', 'icon', 'closable', 'selected', 'color', 'draggable'];

    constructor() {
        super();
        this.state = {
            label: '',
            icon: null,
            closable: false,
            selected: false,
            color: 'default',
            draggable: false
        };

        this.defineComputedProperty('chipClasses', () => {
            return `zephyr-chip ${this.state.selected ? 'selected' : ''} ${this.state.color} ${this.state.draggable ? 'draggable' : ''}`;
        });
    }

    componentDidMount() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupContextMenu();
    }

    setupEventListeners() {
        this.addEventListener('click', this.handleClick);
        if (this.state.closable) {
            this._shadowRoot.querySelector('.chip-close')?.addEventListener('click', this.handleClose);
        }
    }

    setupDragAndDrop() {
        if (this.state.draggable) {
            this.setAttribute('draggable', 'true');
            this.addEventListener('dragstart', this.handleDragStart);
            this.addEventListener('dragend', this.handleDragEnd);
        }
    }

    setupContextMenu() {
        this.addEventListener('contextmenu', this.handleContextMenu);
    }

    handleClick(event) {
        if (!event.target.classList.contains('chip-close')) {
            this.setState({ selected: !this.state.selected });
            this.dispatchCustomEvent('chipSelect', { selected: this.state.selected });
        }
    }

    handleClose(event) {
        event.stopPropagation();
        this.dispatchCustomEvent('chipClose', {});
        this.remove();
    }

    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', this.state.label);
        this.classList.add('dragging');
    }

    handleDragEnd(event) {
        this.classList.remove('dragging');
    }

    handleContextMenu(event) {
        event.preventDefault();
        this.dispatchCustomEvent('chipContextMenu', { x: event.clientX, y: event.clientY });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'draggable') {
            this.setupDragAndDrop();
        }
    }
}

defineCustomElement('zephyr-chip', ZephyrChip);

export default ZephyrChip;