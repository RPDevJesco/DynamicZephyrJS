/**
 * ZephyrJS is a base class for creating custom HTML elements with shadow DOM, state management,
 * and data binding capabilities.
 */
export default class ZephyrJS extends HTMLElement {
    static baseUrl = '';

    /**
     * Sets the base URL for loading templates.
     * If a CDN link is provided, it is used as is.
     * If a relative path is provided, it's treated as a local path.
     */
    static setBaseURL(url) {
        if (url.startsWith('http')) {
            // CDN or full URL
            ZephyrJS.baseUrl = url.endsWith('/') ? url : url + '/';
        } else {
            // Local relative path
            ZephyrJS.baseUrl = new URL(url, window.location.origin).href;
        }
    }

    /**
     * Initializes the custom element, sets up shadow DOM, state management, and data bindings.
     */
    constructor() {
        super(); // Call the parent class's constructor

        // Create a shadow DOM and attach it to the element
        this._shadowRoot = this.attachShadow({ mode: 'open' });

        // Initialize a map to store bindings between state properties and DOM elements
        this._bindings = new Map();

        // Initialize a list to store added event listeners for cleanup
        this._eventListeners = [];

        // Create a proxy for the component's state to track changes and update bindings automatically
        this._state = {};
        this.state = new Proxy(this._state, {
            set: (target, property, value) => {
                if (typeof target[property] === 'function') {
                    console.error(`Cannot set computed property "${property}"`);
                    return false;
                }
                const prevState = { ...target };
                target[property] = value;
                this.updateBindings(); // Update bindings whenever the state changes
                // Call componentDidUpdate if defined
                this.componentDidUpdate && this.componentDidUpdate(prevState);
                return true;
            }
        });

        const className = this.constructor.name.toLowerCase();
        if (this.constructor.isCoreTemplate) {
            this.templateUrl = `${ZephyrJS.baseUrl}/zephyrtemplates/templates/${className}.html`;
        } else {
            this.templateUrl = `./templates/${className}.html`;
        }

        this.renderBlocking = this.constructor.renderBlocking || false;
    }

    /**
     * Called when the element is added to the document's DOM.
     * Loads the template, renders the component, and calls componentDidMount if defined.
     */
    async connectedCallback() {
        try {
            if (this.renderBlocking) {
                await this.performRenderBlockingTasks();
            }
            this.template = await this.loadTemplate(); // Load the template asynchronously
            await this.render(); // Render the component
            this.componentDidMount && this.componentDidMount(); // Call componentDidMount if defined
        } catch (error) {
            console.error('Error during component initialization', error);
            this.componentDidCatch && this.componentDidCatch(error);
        }
    }

    /**
     * Called when the element is removed from the document's DOM.
     * Calls componentWillUnmount if defined and cleans up event listeners and other resources.
     */
    disconnectedCallback() {
        try {
            this.componentWillUnmount && this.componentWillUnmount(); // Call componentWillUnmount if defined
            this.cleanupEventListeners(); // Clean up all event listeners
        } catch (error) {
            console.error('Error during component unmounting', error);
        }
    }

    /**
     * Observe attributes for changes and sync them to state.
     */
    static get observedAttributes() {
        return this.attributesList || [];
    }

    /**
     * Called when an observed attribute changes. Syncs the attribute to the state.
     * @param {string} name - The name of the attribute.
     * @param {any} oldValue - The old value of the attribute.
     * @param {any} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (this._state[name] !== undefined) {
            this._state[name] = newValue;
        }
    }

    /**
     * Load the HTML template from the specified URL.
     * @returns {Promise<HTMLElement>} - The loaded template.
     */
    async loadTemplate() {
        try {
            if (!this.templateUrl) return null;

            const response = await fetch(this.templateUrl);
            if (!response.ok) throw new Error(`Failed to load template: ${response.statusText}`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('template');
            if (!template) {
                throw new Error('Template file does not contain a <template> element');
            }
            return template;
        } catch (error) {
            console.error('Error loading template', error);
            throw error;
        }
    }

    /**
     * Bind event listeners to elements with the 'on' attribute and store them for cleanup.
     */
    bindEvents() {
        this._shadowRoot.querySelectorAll('[on]').forEach(element => {
            const eventBinding = element.getAttribute('on');
            const matches = eventBinding.match(/(\w+):"?{{(\w+)}}"?/);
            if (matches) {
                const [, eventName, methodName] = matches;
                if (typeof this[methodName] === 'function') {
                    const boundMethod = this[methodName].bind(this);
                    element.addEventListener(eventName, boundMethod);
                    this._eventListeners.push({ element, eventName, boundMethod });
                } else {
                    console.warn(`Method "${methodName}" not defined`);
                }
            }
        });
    }

    /**
     * Update the text content and value of elements bound to state properties.
     */
    updateBindings() {
        this._bindings.forEach((binding, key) => {
            binding.elements.forEach(element => {
                if (element.type === 'checkbox') {
                    element.checked = this.state[key];
                } else if (element.type === 'radio') {
                    element.checked = (element.value === this.state[key]);
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                    element.value = this.state[key];
                } else {
                    element.textContent = this.state[key];
                }
            });
        });
    }

    /**
     * Render the component by attaching the template content to the shadow DOM.
     */
    async render() {
        if (this.template) {
            this._shadowRoot.innerHTML = ''; // Clear the shadow DOM
            const content = this.template.content.cloneNode(true); // Clone the template content

            // Append styles if defined
            if (this.constructor.styles) {
                const styleElement = document.createElement('style');
                styleElement.textContent = this.constructor.styles;
                this._shadowRoot.appendChild(styleElement);
            }

            await this.processBindings(content); // Process data bindings in the template
            this._shadowRoot.appendChild(content); // Append the template content to the shadow DOM
            this.bindEvents(); // Bind events to the elements
            this.updateBindings(); // Update bindings with the current state
            this.renderSlots(); // Render slot content
        }
    }

    /**
     * Process data bindings in the template content.
     * @param {HTMLElement} content - The template content.
     * @param {object} scope - The scope for evaluating expressions.
     */
    async processBindings(node, scope = {}) {
        // If the node is an Element, process it
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;

            // Handle z-for directive
            if (element.hasAttribute('z-for')) {
                const attrValue = element.getAttribute('z-for');
                const [itemName, arrayName] = attrValue.split(' in ').map(s => s.trim());
                const array = this.evaluateExpression(arrayName, scope);
                if (Array.isArray(array)) {
                    const parent = element.parentNode;
                    for (const item of array) {
                        const clone = element.cloneNode(true);
                        clone.removeAttribute('z-for');

                        // Create a new scope including the loop variable
                        const newScope = { ...scope, [itemName]: item };

                        await this.processBindings(clone, newScope);
                        parent.insertBefore(clone, element);
                    }
                    parent.removeChild(element);
                    return; // Stop processing this element since it's replaced
                } else {
                    console.warn(`Expected array for z-for directive, got: ${array}`);
                }
                return;
            }

            // Process attributes with expressions
            for (const attr of Array.from(element.attributes)) {
                const attrName = attr.name;
                const attrValue = attr.value;

                // Handle event bindings
                if (attrName.startsWith('on-')) {
                    const eventName = attrName.substring(3);
                    const handlerExpression = attrValue;

                    // Capture the current scope for the event handler
                    const currentScope = { ...scope };
                    element.addEventListener(eventName, (event) => {
                        this.evaluateExpression(handlerExpression, { event, ...currentScope });
                    });
                    element.removeAttribute(attrName);
                    continue;
                }

                // Handle attributes with expressions
                if (attrValue.includes('{{')) {
                    attr.value = attrValue.replace(/{{(.*?)}}/g, (match, expression) => {
                        return this.evaluateExpression(expression.trim(), scope);
                    });
                }
            }

            // Process child nodes
            for (const child of Array.from(element.childNodes)) {
                await this.processBindings(child, scope);
            }

            // Initialize nested custom elements if any
            if (customElements.get(element.localName)) {
                await customElements.whenDefined(element.localName);
                element.connectedCallback && element.connectedCallback();
            }
        }
        // If the node is a Text node, process text content
        else if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node;
            if (textNode.textContent.includes('{{')) {
                textNode.textContent = textNode.textContent.replace(/{{(.*?)}}/g, (match, expression) => {
                    return this.evaluateExpression(expression.trim(), scope);
                });
            }
        }
        // Handle other node types if necessary
    }


    /**
     * Evaluate an expression within the component's context.
     * @param {string} expression - The expression to evaluate.
     * @param {object} scope - Additional variables to include in the scope.
     * @returns {*} - The result of the evaluated expression.
     */
    evaluateExpression(expression, scope = {}) {
        try {
            const componentMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                .filter(prop => typeof this[prop] === 'function' && prop !== 'constructor');
            const methods = {};
            componentMethods.forEach(method => {
                methods[method] = this[method].bind(this);
            });
            const args = { ...this.state, ...methods, ...scope };
            const argNames = Object.keys(args);
            const argValues = Object.values(args);

            const func = new Function(...argNames, `return (${expression});`);
            return func(...argValues);
        } catch (error) {
            console.error(`Error evaluating expression: "${expression}"`, error);
            return '';
        }
    }

    /**
     * Render the slot content by appending assigned nodes to their respective slots.
     */
    renderSlots() {
        const slotElements = this._shadowRoot.querySelectorAll('slot');
        slotElements.forEach(slot => {
            const name = slot.getAttribute('name');
            const assignedNodes = this.querySelectorAll(`[slot="${name}"]`);
            assignedNodes.forEach(node => slot.appendChild(node.cloneNode(true))); // Append assigned nodes to the slot
        });
    }

    /**
     * Set the state properties and trigger bindings update.
     * @param {object} newState - The new state to be merged with the existing state.
     * @returns {Promise<void>} - A promise that resolves when the state is updated and bindings are refreshed.
     */
    async setState(newState) {
        const prevState = { ...this.state };
        const nextState = { ...this.state, ...newState };

        // Check if component should update
        if (this.shouldComponentUpdate && !this.shouldComponentUpdate(nextState, prevState)) {
            return;
        }

        Object.keys(newState).forEach(key => {
            if (typeof this._state[key] !== 'function') {
                this.state[key] = newState[key];
            }
        });

        this.updateBindings();

        // Call componentDidUpdate if defined
        this.componentDidUpdate && this.componentDidUpdate(prevState);
    }

    /**
     * Define a computed property that automatically recalculates based on state changes.
     * @param {string} name - The name of the computed property.
     * @param {function} computeFn - The function to compute the property's value.
     */
    defineComputedProperty(name, computeFn) {
        Object.defineProperty(this.state, name, {
            get: computeFn,
            enumerable: true,
            configurable: true
        });
    }

    /**
     * Dispatch a custom event from the element.
     * @param {string} eventName - The name of the event.
     * @param {object} detail - The detail object to be attached to the event.
     */
    dispatchCustomEvent(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Apply a theme to the element using CSS variables.
     * @param {object} theme - The theme object containing CSS variable values.
     */
    applyTheme(theme) {
        for (const [key, value] of Object.entries(theme)) {
            this.style.setProperty(`--${key}`, value);
        }
    }

    /**
     * Clean up all event listeners added by the component.
     */
    cleanupEventListeners() {
        this._eventListeners.forEach(({ element, eventName, boundMethod }) => {
            element.removeEventListener(eventName, boundMethod);
        });
        this._eventListeners = []; // Clear the event listeners list
    }

    /**
     * Perform render blocking tasks. Override in subclasses to provide specific tasks.
     */
    async performRenderBlockingTasks() {
        // Default implementation does nothing. Subclasses should override this method.
        return Promise.resolve();
    }

    /**
     * Set ARIA attributes for accessibility.
     * @param {string} attr - The ARIA attribute name.
     * @param {string} value - The value of the ARIA attribute.
     */
    setAriaAttribute(attr, value) {
        this.setAttribute(`aria-${attr}`, value);
    }

    /**
     * Save the current state to localStorage.
     */
    saveStateToLocalStorage() {
        localStorage.setItem(this.constructor.name, JSON.stringify(this._state));
    }

    /**
     * Load the state from localStorage.
     */
    loadStateFromLocalStorage() {
        const savedState = localStorage.getItem(this.constructor.name);
        if (savedState) {
            this.setState(JSON.parse(savedState));
        }
    }

    /**
     * Automatically register the custom element with a default name.
     */
    static autoDefine() {
        const elementName = 'zephyr-' + this.name.toLowerCase();
        if (!customElements.get(elementName)) {
            customElements.define(elementName, this);
        }
    }
}

/**
 * Define a custom element with the specified name and class.
 * @param {string} name - The name of the custom element.
 * @param {class} elementClass - The class representing the custom element.
 */
function defineCustomElement(name, elementClass) {
    if (!customElements.get(name)) {
        customElements.define(name, elementClass); // Register the custom element with the browser
    }
}

export { ZephyrJS, defineCustomElement }; // Export the ZephyrJS class and defineCustomElement function
