import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DynamicTextArea extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['label', 'placeholder', 'minlength', 'maxlength', 'toolbar', 'height', 'expand', 'char-counter', 'word-counter'];
    }

    constructor() {
        super();
        this._state = {
            label: 'Enter Text',
            placeholder: '',
            minlength: 0,
            maxlength: 1000,
            value: '',
            height: '300px',
            toolbar: false,  // Toolbar as a boolean
            expand: true,
            charCounter: false,
            wordCounter: false,
            errorMessage: '',
        };

        this._uniqueId = `textarea-${Math.random().toString(36).substr(2, 9)}`;
        this._initialized = false;
    }

    connectedCallback() {
        if (!this._initialized) {
            this.updateStateFromAttributes();
            this.render();
            if (this._state.toolbar) {
                this.initRichTextEditor();
            }
            this._initialized = true;
        }
    }

    updateStateFromAttributes() {
        this._state = {
            ...this._state,
            label: this.getAttribute('label') || this._state.label,
            placeholder: this.getAttribute('placeholder') || this._state.placeholder,
            minlength: this.getAttribute('minlength') || this._state.minlength,
            maxlength: this.getAttribute('maxlength') || this._state.maxlength,
            height: this.getAttribute('height') || this._state.height,
            toolbar: this.hasAttribute('toolbar') && this.getAttribute('toolbar') !== 'false',  // Parse toolbar as boolean
            expand: this.hasAttribute('expand'),
            charCounter: this.hasAttribute('char-counter'),
            wordCounter: this.hasAttribute('word-counter'),
        };
    }

    initRichTextEditor() {
        const editor = this._shadowRoot.querySelector(`#${this._uniqueId}-editor`);
        editor.contentEditable = true;
        editor.style.height = this._state.height;

        // Add toolbar functionality
        this._shadowRoot.querySelectorAll('.toolbar-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const command = event.target.dataset.command;
                if (command === 'createLink') {
                    const url = prompt('Enter the link URL:');
                    document.execCommand(command, false, url);
                } else {
                    document.execCommand(command, false, null);
                }
            });
        });
    }

    handleInput() {
        const editor = this._shadowRoot.querySelector(`#${this._uniqueId}-editor`);
        if (this._state.toolbar) {
            this._state.value = editor.innerHTML;  // Store the formatted HTML content for rich text
        } else {
            this._state.value = editor.value;  // Store the plain text content for standard text
        }

        // Auto-resize functionality
        if (this._state.expand) {
            editor.style.height = 'auto';
            editor.style.height = editor.scrollHeight + 'px';
        }

        // Handle character/word counter
        if (this._state.charCounter || this._state.wordCounter) {
            this.updateCounter();
        }
    }

    updateCounter() {
        const counterEl = this._shadowRoot.querySelector('.counter');
        if (this._state.charCounter) {
            counterEl.textContent = `${this._state.value.length}/${this._state.maxlength} characters`;
        } else if (this._state.wordCounter) {
            const wordCount = this._state.value.split(/\s+/).filter(Boolean).length;
            counterEl.textContent = `${wordCount} words`;
        }
    }

    render() {
        const { label, placeholder, toolbar, charCounter, wordCounter } = this._state;

        // Toolbar buttons for rich text
        const toolbarButtons = `
            <button class="toolbar-button" data-command="bold">Bold</button>
            <button class="toolbar-button" data-command="italic">Italic</button>
            <button class="toolbar-button" data-command="underline">Underline</button>
            <button class="toolbar-button" data-command="insertUnorderedList">UL</button>
            <button class="toolbar-button" data-command="insertOrderedList">OL</button>
            <button class="toolbar-button" data-command="createLink">Link</button>
        `;

        if (toolbar) {
            // Render rich text editor
            this._shadowRoot.innerHTML = `
                <style>
                    :host { display: block; font-family: Arial, sans-serif; margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; }
                    .editor { 
                        width: 100%; 
                        padding: 8px; 
                        border: 2px solid #ccc; 
                        border-radius: 4px; 
                        outline: none; 
                        background-color: white;
                        overflow-y: auto;
                        min-height: ${this._state.height};
                    }
                    .editor:focus { border-color: #007bff; }
                    .toolbar {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 10px;
                    }
                    .toolbar-button {
                        cursor: pointer;
                        padding: 5px 10px;
                        background-color: #f1f1f1;
                        border: none;
                        border-radius: 3px;
                    }
                    .counter { font-size: 0.8em; margin-top: 5px; }
                </style>

                <label for="${this._uniqueId}-editor">${label}</label>
                <div class="toolbar">${toolbarButtons}</div>
                <div id="${this._uniqueId}-editor" class="editor" placeholder="${placeholder}"></div>
                ${charCounter || wordCounter ? '<div class="counter"></div>' : ''}
            `;
        } else {
            // Render standard textarea
            this._shadowRoot.innerHTML = `
                <style>
                    :host { display: block; font-family: Arial, sans-serif; margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; }
                    textarea {
                        width: 100%; 
                        padding: 8px; 
                        border: 2px solid #ccc; 
                        border-radius: 4px; 
                        outline: none;
                        resize: none;
                    }
                    textarea:focus { border-color: #007bff; }
                    .counter { font-size: 0.8em; margin-top: 5px; }
                </style>

                <label for="${this._uniqueId}-editor">${label}</label>
                <textarea 
                    id="${this._uniqueId}-editor" 
                    placeholder="${placeholder}" 
                    maxlength="${this._state.maxlength}"
                    minlength="${this._state.minlength}"
                    rows="4">${this._state.value}</textarea>
                ${charCounter || wordCounter ? '<div class="counter"></div>' : ''}
            `;
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        const editor = this._shadowRoot.querySelector(`#${this._uniqueId}-editor`);
        editor.addEventListener('input', this.handleInput.bind(this));
    }
}

defineCustomElement('zephyr-textarea', DynamicTextArea);