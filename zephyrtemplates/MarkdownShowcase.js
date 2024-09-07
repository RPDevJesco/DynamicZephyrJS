import ZephyrJS, { defineCustomElement } from '../zephyrcore/zephyr.js';
import JSTOKENS from '../zephyrcore/JSTOKENS.js';
import CPPTOKENS from '../zephyrcore/CPPTOKENS.js';
import CTOKENS from '../zephyrcore/CTOKENS.js';
import HTMLTOKENS from '../zephyrcore/HTMLTOKENS.js';
import CSSTOKENS from '../zephyrcore/CSSTOKENS.js';
import JAVATOKENS from '../zephyrcore/JAVATOKENS.js';
import PYTOKENS from '../zephyrcore/PYTOKENS.js';
import { JavaScriptHighlighter, CHighlighter, JavaHighlighter, PythonHighlighter, HTMLHighlighter, CSSHighlighter, DefaultHighlighter } from '../zephyrcore/LanguageHighlighter.js';

export default class MarkdownShowcase extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['sections'];
    }

    constructor() {
        super();
        this.state = {
            sections: [],
            currentSectionIndex: 0
        };
        this.highlighters = this.initializeHighlighters();
    }

    initializeHighlighters() {
        return {
            'js': new JavaScriptHighlighter(new JSTOKENS()),
            'c': new CHighlighter(new CTOKENS()),
            'cpp': new CHighlighter(new CPPTOKENS()),
            'java': new JavaHighlighter(new JAVATOKENS()),
            'py': new PythonHighlighter(new PYTOKENS()),
            'html': new HTMLHighlighter(new HTMLTOKENS()),
            'css': new CSSHighlighter(new CSSTOKENS()),
            'default': new DefaultHighlighter()
        };
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('MarkdownShowcase connected');
        this.renderContent();
        this._shadowRoot.addEventListener('click', this.handleNavigation.bind(this));
    }

    handleNavigation(event) {
        if (event.target.classList.contains('nav-prev')) {
            console.log('Previous button clicked');
            this.prevSection();
        } else if (event.target.classList.contains('nav-next')) {
            console.log('Next button clicked');
            this.nextSection();
        }
    }

    prevSection() {
        if (this.state.currentSectionIndex > 0) {
            this.setState({ currentSectionIndex: this.state.currentSectionIndex - 1 });
        }
    }

    nextSection() {
        if (this.state.currentSectionIndex < this.state.sections.length - 1) {
            this.setState({ currentSectionIndex: this.state.currentSectionIndex + 1 });
        }
    }

    setState(newState) {
        Object.assign(this.state, newState);
        this.renderContent();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute changed: ${name}`, newValue);
        if (name === 'sections') {
            try {
                const sections = JSON.parse(newValue);
                console.log('Parsed sections:', sections);
                this.state.sections = sections;
                this.state.currentSectionIndex = 0;
                this.renderContent();
            } catch (error) {
                console.error('Error parsing sections:', error);
            }
        }
    }

    renderMarkdownContent(content) {
        let html = content
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                const highlighter = this.highlighters[lang] || this.highlighters['default'];
                return `<pre><code class="language-${lang || ''}">${highlighter.highlightSyntax(code.trim())}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers (excluding H2 as it's used for section headers)
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            // Bold and Italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Lists
            .replace(/^\s*(-|\*)\s(.*)$/gm, '<li>$2</li>')
            .replace(/<\/li>\s*<li>/g, '</li><li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[hl]|<p|<\/p|<ul|<\/ul|<li|<\/li|<pre)(.+)/gm, '<p>$1</p>');

        // Wrap lists in <ul> tags
        html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

        return html;
    }

    renderContent() {
        console.log('Rendering content', this.state);
        const currentSection = this.state.sections[this.state.currentSectionIndex];
        const content = `
            <style>
                .showcase-container {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: var(--spacing-large, 20px);
                    color: var(--markdown-bg);
                    line-height: 1.6;
                }
                .section h3 {
                    color: var(--dark-text);
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                pre {
                    background-color: #f4f4f4;
                    border: 1px solid #ddd;
                    border-radius: var(--border-radius);
                    padding: var(--spacing-small, 10px);
                    overflow-x: auto;
                }
                code {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 0.9em;
                }
                ul {
                    padding-left: 20px;
                }
                li {
                    margin-bottom: 5px;
                }
                .navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .nav-button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .nav-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                .keyword { color: var(--markdown-keyword); }
                .string { color: var(--markdown-string); }
                .number { color: var(--markdown-number); }
                .function { color: var(--markdown-function); }
                .comment { color: var(--markdown-comment); }
                .method { color: var(--markdown-method); }
                .tag { color: var(--markdown-tag); }
                .attribute { color: var(--markdown-attribute); }
                .at-rule { color: var(--markdown-at-rule); }
                .punctuation { color: var(--markdown-punctuation); }
                .property { color: var(--markdown-property); }
                .value { color: var(--markdown-value); }
                .selector { color: var(--markdown-selector); }
                .indentation { color: var(--markdown-indentation); }
            </style>
            <div class="showcase-container">
                <div class="section">
                    <h3>${this.escapeHtml(currentSection.header)}</h3>
                    <div class="content">${this.renderMarkdownContent(currentSection.content)}</div>
                </div>
                <div class="navigation">
                    <button class="nav-button nav-prev" ${this.state.currentSectionIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button class="nav-button nav-next" ${this.state.currentSectionIndex === this.state.sections.length - 1 ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;

        console.log('Generated content:', content);

        if (this._shadowRoot) {
            this._shadowRoot.innerHTML = content;
            console.log('Content set to shadow root');
        } else {
            console.error('Shadow root not available');
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    render() {
        console.log('Render method called');
        this.renderContent();
        return '';
    }
}

defineCustomElement('zephyr-markdown-showcase', MarkdownShowcase);