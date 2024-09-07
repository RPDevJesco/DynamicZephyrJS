import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicButton extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['type', 'value', 'name', 'checked', 'group', 'text-position', 'clicked-text', 'toggle-on-text', 'toggle-off-text'];
    }

    constructor() {
        super();
        this.state = {
            type: 'button',
            value: '',
            name: '',
            checked: false,
            group: '',
            isHovered: false,
            isPressed: false,
            textPosition: 'inside',
            clickedText: '',
            isClicked: false,
            toggleOnText: 'ON',
            toggleOffText: 'OFF',
        };
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.addEventListener('mouseover', () => this.setState({ isHovered: true }));
        this.addEventListener('mouseout', () => this.setState({ isHovered: false }));
        this.addEventListener('mousedown', () => this.setState({ isPressed: true }));
        this.addEventListener('mouseup', () => this.setState({ isPressed: false }));
        this.setupEventHandlers();
        this.render();
    }

    setupEventHandlers() {
        const zephyrChangeHandler = this.getAttribute('onzephyr-change');
        if (zephyrChangeHandler) {
            this.addEventListener('zephyr-change', (event) => {
                const handlerFunction = new Function('event', zephyrChangeHandler);
                handlerFunction.call(this, event);
            });
        }
        const zephyrClickHandler = this.getAttribute('onzephyr-click');
        if (zephyrClickHandler) {
            this.addEventListener('zephyr-click', (event) => {
                const handlerFunction = new Function('event', zephyrClickHandler);
                handlerFunction.call(this, event);
            });
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'checked':
                this.setState({ checked: newValue !== null });
                break;
            case 'type':
                this.setState({ type: newValue || 'button' });
                break;
            case 'group':
                this.setState({ group: newValue });
                break;
            case 'text-position':
                this.setState({ textPosition: newValue || 'inside' });
                break;
            case 'clicked-text':
                this.setState({ clickedText: newValue });
                break;
            case 'toggle-on-text':
                this.setState({ toggleOnText: newValue });
                break;
            case 'toggle-off-text':
                this.setState({ toggleOffText: newValue });
                break;
            default:
                this.setState({ [name]: newValue });
        }
        this.render();
    }

    handleClick(event) {
        event.preventDefault();
        const { type, name, value, checked, group, clickedText, isClicked } = this.state;

        let newChecked = checked;
        switch (type) {
            case 'checkbox':
                newChecked = !checked;
                break;
            case 'radio':
                if (!checked) {
                    newChecked = true;
                    this.uncheckOthersInGroup();
                }
                break;
            case 'toggle':
                newChecked = !checked;
                break;
            case 'button':
                // Toggle isClicked state for standard buttons
                this.setState({ isClicked: !isClicked });
                break;
        }
        this.setState({ checked: newChecked });

        if (group) {
            this.updateGroup();
        }

        const newIsClicked = type === 'button' ? !isClicked : isClicked;
        const displayValue = newIsClicked && clickedText ? clickedText : value;

        // Dispatch the custom zephyr-change event
        const zephyrChangeEvent = new CustomEvent('zephyr-change', {
            bubbles: true,
            composed: true,
            detail: { type, name, value: displayValue, checked: newChecked, group }
        });
        this.dispatchEvent(zephyrChangeEvent);

        // Dispatch the custom zephyr-click event
        const zephyrClickEvent = new CustomEvent('zephyr-click', {
            bubbles: true,
            composed: true,
            detail: { type, name, value: displayValue, checked: newChecked, group }
        });
        this.dispatchEvent(zephyrClickEvent);

        this.render();
    }

    uncheckOthersInGroup() {
        const { group } = this.state;
        if (group) {
            document.querySelectorAll(`zephyr-button[group="${group}"]`).forEach(button => {
                if (button !== this && button.getAttribute('type') === 'radio') {
                    button.removeAttribute('checked');
                    if (button.setState) {
                        button.setState({ checked: false });
                        button.render();
                    }
                }
            });
        }
    }

    updateGroup() {
        const { group, type, checked, value } = this.state;
        const event = new CustomEvent('group-update', {
            bubbles: true,
            composed: true,
            detail: { group, type, checked, value, button: this }
        });
        this.dispatchEvent(event);
    }

    render() {
        if (!this._shadowRoot || !this.template) return;

        // Clear existing content
        while (this._shadowRoot.firstChild) {
            this._shadowRoot.removeChild(this._shadowRoot.firstChild);
        }

        // Clone the template content
        const content = this.template.content.cloneNode(true);

        // Get the button wrapper, button, and text container from the cloned content
        const wrapper = content.querySelector('.button-wrapper');
        const button = content.querySelector('.dynamic-button');
        const textContainer = content.querySelector('.text-container');

        if (!wrapper || !button || !textContainer) return;

        const { type, value, name, checked, group, isHovered, isPressed, textPosition, clickedText, isClicked, toggleOnText, toggleOffText } = this.state;

        const buttonClasses = [
            'dynamic-button',
            `type-${type}`,
            checked ? 'checked' : '',
            group ? 'grouped' : '',
            isHovered ? 'hovered' : '',
            isPressed ? 'pressed' : '',
            type === 'button' && isClicked ? 'clicked' : ''
        ].filter(Boolean).join(' ');

        button.className = buttonClasses;
        button.setAttribute('name', name);
        button.setAttribute('value', value);
        button.setAttribute('role', type === 'toggle' ? 'switch' : type);
        if (group) {
            button.setAttribute('group', group);
        }

        // Set text content
        let displayText = isClicked && clickedText ? clickedText : value;
        if (type === 'toggle') {
            displayText = checked ? toggleOnText : toggleOffText;
        } else {
            displayText = isClicked && clickedText ? clickedText : value;
        }
        textContainer.textContent = displayText;

        // Position text
        wrapper.className = `button-wrapper text-${textPosition}`;

        if (type === 'checkbox' || type === 'radio') {
            button.setAttribute('aria-checked', checked.toString());
            button.textContent = ''; // Clear button text for checkbox and radio
        } else if (textPosition === 'inside') {
            button.textContent = displayText;
            textContainer.textContent = ''; // Clear text container for inside positioning on standard buttons
        } else {
            button.textContent = ''; // Clear button text for external text positioning on standard buttons
        }

        // Adjust order of elements based on text position
        if (textPosition === 'right' || textPosition === 'below' || type === 'toggle') {
            wrapper.appendChild(button);
            wrapper.appendChild(textContainer);
        } else {
            wrapper.appendChild(textContainer);
            wrapper.appendChild(button);
        }

        if (type === 'checkbox' || type === 'radio' || textPosition === 'inside' || type === 'toggle') {
            this.resizeButtonToFitText(button, textContainer);
        }

        button.onclick = this.handleClick.bind(this);

        // Append the modified content to the shadow root
        this._shadowRoot.appendChild(content);
    }

    resizeButtonToFitText(button, textContainer) {
        // Reset button size
        button.style.width = 'auto';
        button.style.height = 'auto';

        // Get the text dimensions
        const textWidth = textContainer.offsetWidth;
        const textHeight = textContainer.offsetHeight;

        // Set button size with some padding
        button.style.width = `${textWidth + 20}px`;
        button.style.height = `${textHeight + 10}px`;
    }
}

defineCustomElement('zephyr-button', DynamicButton);