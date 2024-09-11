import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

class ZephyrToast extends ZephyrJS {
    static isCoreTemplate = true;
    static attributesList = ['message', 'action', 'duration'];

    constructor() {
        super();
        this.state = {
            message: '',
            action: 'Undo',
            duration: 5000,
            visible: false
        };
    }

    componentDidMount() {
        this._shadowRoot.querySelector('.toast-action').addEventListener('click', this.handleAction.bind(this));
    }

    show() {
        this.setState({ visible: true });
        this.timeout = setTimeout(() => this.hide(), this.state.duration);
    }

    hide() {
        this.setState({ visible: false });
        clearTimeout(this.timeout);
    }

    handleAction() {
        this.dispatchCustomEvent('toastAction', {});
    }
}

defineCustomElement('zephyr-toast', ZephyrToast);

export default ZephyrToast;