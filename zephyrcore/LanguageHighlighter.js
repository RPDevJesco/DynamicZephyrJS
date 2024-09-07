import JSTOKENS from '../zephyrcore/JSTOKENS.js';
import CPPTOKENS from '../zephyrcore/CPPTOKENS.js';
import CTOKENS from '../zephyrcore/CTOKENS.js';
import HTMLTOKENS from '../zephyrcore/HTMLTOKENS.js';
import CSSTOKENS from '../zephyrcore/CSSTOKENS.js';
import JAVATOKENS from '../zephyrcore/JAVATOKENS.js';
import PYTOKENS from '../zephyrcore/PYTOKENS.js';

export class LanguageHighlighter {
    constructor(tokens) {
        this.tokens = tokens;
    }

    parseMarkdown(input) {
        let html = input
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>');

        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || ''}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        return html;
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    unescapeHtml(escaped) {
        if (typeof escaped !== 'string') {
            return '';
        }
        return escaped
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&");
    }

    createPattern(tokensArray) {
        if (tokensArray && tokensArray.length) {
            return new RegExp(`\\b(${tokensArray.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');
        }
        return null;
    }

    applySyntaxHighlighting(code) {
        if (typeof code !== 'string' || code.trim() === '') {
            return '';
        }
        return this.highlightSyntax(code);
    }

    highlightSyntax(code) {
        // This method should be overridden by subclasses
        return code;
    }
}

export class DefaultHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
    }

    highlightSyntax(code) {
        // Escape HTML entities
        let result = this.escapeHtml(code);

        // Preserve line breaks
        result = result.replace(/\n/g, '<br>');

        // Highlight URLs
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        result = result.replace(urlPattern, '<a href="$1" class="url">$1</a>');

        // Preserve indentation
        result = result.replace(/^( +)/gm, match => `<span class="indentation">${'&nbsp;'.repeat(match.length)}</span>`);

        return result;
    }
}

// Subclass for C / C++
export class CHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
        this.ctokens = new CTOKENS(); // Assuming CTOKENS is available in the scope
    }

    highlightSyntax(code) {
        // Unescape the code first
        code = this.unescapeHtml(code);

        const patterns = [
            { pattern: /(#\s*\w+)\b/g, className: 'preprocessor' },
            { pattern: this.createKeywordPattern(this.ctokens.keywords), className: 'keyword' },
            { pattern: this.createKeywordPattern(this.ctokens.types), className: 'type' },
            { pattern: this.createKeywordPattern(this.ctokens.inBuilt), className: 'function' },
            { pattern: this.createOperatorPattern([
                    ...this.ctokens.operators,
                    ...this.ctokens.unaryOperators,
                    ...this.ctokens.ternaryOperators
                ]), className: 'operator' },
            { pattern: /\b(\d+(?:\.\d+)?)\b/g, className: 'number' },
            { pattern: /("(?:[^"\\]|\\.)*")/g, className: 'string' },
            { pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'comment' },
            { pattern: /(<[^>]*>)/g, className: 'include' }
        ];

        let result = '';
        let lastIndex = 0;

        while (lastIndex < code.length) {
            let earliestMatch = null;
            let earliestPattern = null;

            for (const { pattern, className } of patterns) {
                pattern.lastIndex = lastIndex;
                const match = pattern.exec(code);
                if (match && (!earliestMatch || match.index < earliestMatch.index)) {
                    earliestMatch = match;
                    earliestPattern = { pattern, className };
                }
            }

            if (earliestMatch) {
                result += this.escapeHtml(code.slice(lastIndex, earliestMatch.index));
                result += `<span class="${earliestPattern.className}">${this.escapeHtml(earliestMatch[0])}</span>`;
                lastIndex = earliestPattern.pattern.lastIndex;
            } else {
                result += this.escapeHtml(code.slice(lastIndex));
                break;
            }
        }

        return result;
    }

    createKeywordPattern(keywords) {
        return new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    }

    createOperatorPattern(operators) {
        const escapedOperators = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        return new RegExp(`(${escapedOperators.join('|')})`, 'g');
    }
}

// Subclass for Java
export class JavaHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
        this.javatokens = new JAVATOKENS();
    }

    highlightSyntax(code) {
        // Unescape the code first
        code = this.unescapeHtml(code);

        const patterns = [
            { pattern: this.createKeywordPattern(this.javatokens.keywords), className: 'keyword' },
            { pattern: this.createKeywordPattern(this.javatokens.inBuilt), className: 'function' },
            { pattern: this.createOperatorPattern(this.javatokens.operators), className: 'operator' },
            { pattern: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: 'class' }, // Class names
            { pattern: /\b([a-z][a-zA-Z0-9_]*)\s*(?=\()/g, className: 'function' }, // Method calls
            { pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'comment' },
            { pattern: /("(?:[^"\\]|\\.)*")/g, className: 'string' },
            { pattern: /\b(\d+(?:\.\d+)?)\b/g, className: 'number' },
        ];

        let result = '';
        let lastIndex = 0;

        while (lastIndex < code.length) {
            let earliestMatch = null;
            let earliestPattern = null;

            for (const { pattern, className } of patterns) {
                pattern.lastIndex = lastIndex;
                const match = pattern.exec(code);
                if (match && (!earliestMatch || match.index < earliestMatch.index)) {
                    earliestMatch = match;
                    earliestPattern = { pattern, className };
                }
            }

            if (earliestMatch) {
                result += this.escapeHtml(code.slice(lastIndex, earliestMatch.index));
                result += `<span class="${earliestPattern.className}">${this.escapeHtml(earliestMatch[0])}</span>`;
                lastIndex = earliestPattern.pattern.lastIndex;
            } else {
                result += this.escapeHtml(code.slice(lastIndex));
                break;
            }
        }

        return result;
    }

    createKeywordPattern(keywords) {
        return new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    }

    createOperatorPattern(operators) {
        const escapedOperators = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        return new RegExp(`(${escapedOperators.join('|')})`, 'g');
    }
}

// Subclass for JavaScript
export class JavaScriptHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
        this.jstokens = new JSTOKENS();
    }

    highlightSyntax(code) {
        const patterns = [
            { pattern: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm, className: 'comment' },
            { pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, className: 'string' },
            { pattern: this.createKeywordPattern(this.jstokens.keywords), className: 'keyword' },
            { pattern: this.createKeywordPattern(this.jstokens.types), className: 'type' },
            { pattern: this.createKeywordPattern(this.jstokens.inBuilt), className: 'built-in' },
            { pattern: /\b(\d+(?:\.\d+)?)\b/g, className: 'number' },
            { pattern: this.createOperatorPattern([...this.jstokens.operators, ...this.jstokens.ternaryOperators]), className: 'operator' },
            { pattern: /\b([a-zA-Z_$]\w*)\s*(?=\()/g, className: 'function' },
            { pattern: /\b([A-Z][a-zA-Z0-9_$]*)\b/g, className: 'class' }
        ];

        let result = '';
        let lastIndex = 0;

        while (lastIndex < code.length) {
            let earliestMatch = null;
            let earliestPattern = null;

            for (const { pattern, className } of patterns) {
                pattern.lastIndex = lastIndex;
                const match = pattern.exec(code);
                if (match && (!earliestMatch || match.index < earliestMatch.index)) {
                    earliestMatch = match;
                    earliestPattern = { pattern, className };
                }
            }

            if (earliestMatch) {
                result += this.escapeHtml(code.slice(lastIndex, earliestMatch.index));
                result += `<span class="${earliestPattern.className}">${this.escapeHtml(earliestMatch[0])}</span>`;
                lastIndex = earliestPattern.pattern.lastIndex;
            } else {
                result += this.escapeHtml(code.slice(lastIndex));
                break;
            }
        }

        // Highlight indentation
        result = result.replace(/^(\s+)/gm, match => `<span class="indentation">${match}</span>`);

        return result;
    }

    createKeywordPattern(keywords) {
        return new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    }

    createOperatorPattern(operators) {
        const escapedOperators = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        return new RegExp(`(${escapedOperators.join('|')})`, 'g');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Subclass for Python
export class PythonHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
        this.pytokens = new PYTOKENS();
    }

    highlightSyntax(code) {
        const patterns = [
            { pattern: /(#.*$)/gm, className: 'comment' },
            { pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, className: 'string' },
            { pattern: this.createKeywordPattern(this.pytokens.keywords), className: 'keyword' },
            { pattern: this.createKeywordPattern(this.pytokens.inBuilt), className: 'function' },
            { pattern: this.createKeywordPattern(this.pytokens.types), className: 'type' },
            { pattern: /\b(\d+(?:\.\d+)?)\b/g, className: 'number' },
            { pattern: this.createOperatorPattern([...this.pytokens.operators, ...this.pytokens.ternaryOperators]), className: 'operator' },
            { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/g, className: 'function' }
        ];

        let result = '';
        let lastIndex = 0;

        while (lastIndex < code.length) {
            let earliestMatch = null;
            let earliestPattern = null;

            for (const { pattern, className } of patterns) {
                pattern.lastIndex = lastIndex;
                const match = pattern.exec(code);
                if (match && (!earliestMatch || match.index < earliestMatch.index)) {
                    earliestMatch = match;
                    earliestPattern = { pattern, className };
                }
            }

            if (earliestMatch) {
                result += this.escapeHtml(code.slice(lastIndex, earliestMatch.index));
                result += `<span class="${earliestPattern.className}">${this.escapeHtml(earliestMatch[0])}</span>`;
                lastIndex = earliestPattern.pattern.lastIndex;
            } else {
                result += this.escapeHtml(code.slice(lastIndex));
                break;
            }
        }

        // Highlight indentation
        result = result.replace(/^(\s+)/gm, match => `<span class="indentation">${match}</span>`);

        return result;
    }

    createKeywordPattern(keywords) {
        return new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    }

    createOperatorPattern(operators) {
        const escapedOperators = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        return new RegExp(`(${escapedOperators.join('|')})`, 'g');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Subclass for HTML
export class HTMLHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
        this.htmltokens = new HTMLTOKENS();
    }

    highlightSyntax(code) {
        // Unescape the code first
        code = this.unescapeHtml(code);

        const tagPattern = /(<\/?[\w\s="/.':;#-\/\?]+>)/gi;
        const attributePattern = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi;

        let result = code.replace(tagPattern, (match) => {
            let highlighted = match.replace(attributePattern, (attrMatch, attrName, attrValue) => {
                return `${attrName}="<span class="string">${this.escapeHtml(attrValue)}</span>"`;
            });
            return `<span class="tag">${highlighted}</span>`;
        });

        return result;
    }
}

// Subclass for CSS
export class CSSHighlighter extends LanguageHighlighter {
    constructor(tokens) {
        super(tokens);
    }

    highlightSyntax(code) {
        const patterns = [
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
            { pattern: /([@][\w-]+)/g, className: 'at-rule' },
            { pattern: /([{}])/g, className: 'punctuation' },
            { pattern: /([\w-]+\s*)(?=:)/g, className: 'property' },
            { pattern: /:[\s]*([^;}\n]+)/g, className: 'value' },
            { pattern: /((\.|\#)?[\w-]+)(?=[^\w-])/g, className: 'selector' }
        ];

        let result = '';
        let lastIndex = 0;

        while (lastIndex < code.length) {
            let earliestMatch = null;
            let earliestPattern = null;

            for (const { pattern, className } of patterns) {
                pattern.lastIndex = lastIndex;
                const match = pattern.exec(code);
                if (match && (!earliestMatch || match.index < earliestMatch.index)) {
                    earliestMatch = match;
                    earliestPattern = { pattern, className };
                }
            }

            if (earliestMatch) {
                result += this.escapeHtml(code.slice(lastIndex, earliestMatch.index));
                const [fullMatch, captureGroup] = earliestMatch;
                const highlightedText = captureGroup ? captureGroup : fullMatch;
                result += `<span class="${earliestPattern.className}">${this.escapeHtml(highlightedText)}</span>`;
                if (captureGroup) {
                    result += this.escapeHtml(fullMatch.slice(captureGroup.length));
                }
                lastIndex = earliestPattern.pattern.lastIndex;
            } else {
                result += this.escapeHtml(code.slice(lastIndex));
                break;
            }
        }

        // Highlight indentation
        result = result.replace(/^(\s+)/gm, match => `<span class="indentation">${match}</span>`);

        return result;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}