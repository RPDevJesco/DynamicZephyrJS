import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class VisionAccessibilityAdjuster extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    constructor() {
        super();
        this.state = {
            fontSize: 16,
            contrast: 100,
            colorBlindMode: false,
            reducedMotion: false
        };
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.applyStyles();
    }

    handleFontSizeChange(event) {
        this.setState({ fontSize: parseInt(event.target.value) });
    }

    handleContrastChange(event) {
        this.setState({ contrast: parseInt(event.target.value) });
    }

    handleColorBlindToggle(event) {
        this.setState({ colorBlindMode: event.target.checked });
    }

    handleReducedMotionToggle(event) {
        this.setState({ reducedMotion: event.target.checked });
    }

    applyStyles() {
        const body = document.body;
        body.style.fontSize = `${this.state.fontSize}px`;
        body.style.filter = `contrast(${this.state.contrast}%) ${this.state.colorBlindMode ? 'grayscale(100%)' : ''}`;

        if (this.state.reducedMotion) {
            body.style.setProperty('--reduced-motion', 'reduce');
        } else {
            body.style.removeProperty('--reduced-motion');
        }

        console.log('Styles applied:', body.style.cssText);
        this.dispatchCustomEvent('stylesApplied', this.state);
    }

    async setState(newState) {
        await super.setState(newState);
        this.applyStyles();
    }
}

defineCustomElement('vision-accessibility-adjuster', VisionAccessibilityAdjuster);