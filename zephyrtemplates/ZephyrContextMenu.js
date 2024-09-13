import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class ZephyrContextMenu extends ZephyrJS {
    static isCoreTemplate = true;

    constructor() {
        super();
        this.state = {
            items: [],
            visible: false,
            x: 0,
            y: 0
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick.bind(this));
    }

    show(x, y, items) {
        this.setState({ items, x, y, visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    handleItemClick(item) {
        this.hide();
        this.dispatchCustomEvent('menuItemSelected', { item });
    }

    handleOutsideClick(event) {
        if (this.state.visible && !this._shadowRoot.contains(event.target)) {
            this.hide();
        }
    }
}

defineCustomElement('zephyr-context-menu', ZephyrContextMenu);