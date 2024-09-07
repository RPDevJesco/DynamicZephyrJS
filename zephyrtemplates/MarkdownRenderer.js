import ZephyrJS, { defineCustomElement } from '../zephyrcore/zephyr.js';
import { JavaScriptHighlighter, CHighlighter, JavaHighlighter, PythonHighlighter, HTMLHighlighter, CSSHighlighter, DefaultHighlighter } from '../zephyrcore/LanguageHighlighter.js';
import JSTOKENS from '../zephyrcore/JSTOKENS.js';
import CPPTOKENS from '../zephyrcore/CPPTOKENS.js';
import CTOKENS from '../zephyrcore/CTOKENS.js';
import HTMLTOKENS from '../zephyrcore/HTMLTOKENS.js';
import CSSTOKENS from '../zephyrcore/CSSTOKENS.js';
import JAVATOKENS from '../zephyrcore/JAVATOKENS.js';
import PYTOKENS from '../zephyrcore/PYTOKENS.js';

export default class MarkdownRenderer extends ZephyrJS {
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
            renderedHtml: ''
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
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'sections') {
            try {
                const sections = this.customJSONParse(newValue);
                this.setState({ sections });
                this.parseMarkdown();
            } catch (error) {
                console.error('Error parsing sections:', error);
                this.setState({ renderedHtml: 'Error parsing sections. Please check the console.' });
            }
        }
    }

    customJSONParse(str) {
        str = str.replace(/\\n/g, '___NEWLINE___');
        str = str.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            code = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            code = code.replace(/___NEWLINE___/g, '\\n');
            return `\`\`\`${lang}\\n${code}\`\`\``;
        });
        str = str.replace(/___NEWLINE___/g, '\\n');
        return JSON.parse(str);
    }

    parseMarkdown() {
        let renderedHtml = '<div class="markdown-content">';
        this.state.sections.forEach(section => {
            renderedHtml += `<h2 class="section-header">${this.escapeHtml(section.header)}</h2>`;
            renderedHtml += this.renderMarkdownContent(section.content);
        });
        renderedHtml += '</div>';
        this.setState({ renderedHtml });
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

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    render() {
        const style = document.createElement('style');
        style.textContent = `
            .markdown-container {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: var(--spacing-large, 20px);
                color: var(--markdown-bg);
                line-height: 1.6;
            }
            .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                margin-top: 24px;
                margin-bottom: 16px;
                font-weight: 600;
                line-height: 1.25;
            }
            .markdown-content h1 { font-size: 2em; }
            .markdown-content h2 { font-size: 1.5em; }
            .markdown-content h3 { font-size: 1.25em; }
            .markdown-content ul {
                padding-left: 2em;
                margin-bottom: 16px;
            }
            .markdown-content li {
                margin-bottom: 8px;
                list-style-type: disc;
            }
            .markdown-content p {
                margin-bottom: 16px;
            }
            .section-header {
                color: var(--dark-text);
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
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
        `;

        const container = document.createElement('div');
        container.className = 'markdown-container';
        container.innerHTML = this.state.renderedHtml;

        this._shadowRoot.innerHTML = '';
        this._shadowRoot.appendChild(style);
        this._shadowRoot.appendChild(container);
    }
}

defineCustomElement('zephyr-markdown-renderer', MarkdownRenderer);