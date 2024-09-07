import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";
import { JavaScriptHighlighter, CHighlighter, JavaHighlighter, PythonHighlighter, HTMLHighlighter, CSSHighlighter, DefaultHighlighter } from '../zephyrcore/LanguageHighlighter.js';
import JSTOKENS from '../zephyrcore/JSTOKENS.js';
import CPPTOKENS from '../zephyrcore/CPPTOKENS.js';
import CTOKENS from '../zephyrcore/CTOKENS.js';
import HTMLTOKENS from '../zephyrcore/HTMLTOKENS.js';
import CSSTOKENS from '../zephyrcore/CSSTOKENS.js';
import JAVATOKENS from '../zephyrcore/JAVATOKENS.js';
import PYTOKENS from '../zephyrcore/PYTOKENS.js';

const languageMapping = {
    js: JSTOKENS,
    cpp: CPPTOKENS,
    c: CTOKENS,
    html: HTMLTOKENS,
    css: CSSTOKENS,
    java: JAVATOKENS,
    py: PYTOKENS
};

export default class MarkdownEditor extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get renderBlocking() {
        return false;
    }

    constructor() {
        super();
        this.state = {
            markdownInput: '',
            renderedHtml: ''
        };
        this.languageHighlighters = this.initializeHighlighters();
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.hasAttribute('markdown-content')) {
            this.state.markdownInput = this.getAttribute('markdown-content');
            this.updateMarkdownInput({ target: { value: this.state.markdownInput } });
        }
    }

    componentDidMount() {
        this.parseMarkdown();
    }

    initializeHighlighters() {
        const highlighters = {};
        for (const [lang, tokens] of Object.entries(languageMapping)) {
            highlighters[lang] = this.createHighlighter(lang, tokens);
        }
        return highlighters;
    }

    createHighlighter(language, tokens) {
        switch (language) {
            case 'js':
                return new JavaScriptHighlighter(tokens);
            case 'c':
                return new CHighlighter(tokens);
            case 'cpp':
                return new CHighlighter(tokens);
            case 'java':
                return new JavaHighlighter(tokens);
            case 'py':
                return new PythonHighlighter(tokens);
            case 'html':
                return new HTMLHighlighter(tokens);
            case 'css':
                return new CSSHighlighter(tokens);
            default:
                return new DefaultHighlighter(tokens);
        }
    }

    updateMarkdownInput(event) {
        this.setState({ markdownInput: event.target.value });
        this.parseMarkdown();
    }

    parseMarkdown() {
        let html = this.state.markdownInput
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>');

        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || ''}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        this.setState({ renderedHtml: html });
        this.applySyntaxHighlighting();
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    applySyntaxHighlighting() {
        const codeBlocks = this.shadowRoot.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const langClass = block.className.match(/language-(\w+)/);
            if (langClass && this.languageHighlighters[langClass[1]]) {
                const highlighter = this.languageHighlighters[langClass[1]];
                const code = block.innerHTML;
                let highlightedCode = highlighter.highlightSyntax(code);
                highlightedCode = highlightedCode.replace(/(<)(?!\/?(span|\/span))(.*?>)/g, '&lt;$3');
                block.innerHTML = highlightedCode;
            }
        });
    }

    updateBindings() {
        super.updateBindings();
        const outputElement = this.shadowRoot.querySelector('#output');
        if (outputElement) {
            outputElement.innerHTML = this.state.renderedHtml;
        }
    }
}

defineCustomElement('zephyr-markdown-editor', MarkdownEditor);