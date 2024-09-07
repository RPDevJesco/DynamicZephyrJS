# MarkdownRenderer Component

The `MarkdownRenderer` component is a custom web component built using `ZephyrJS` that parses and renders markdown content into HTML. It also provides syntax highlighting for various programming languages, including JavaScript, C, C++, Java, Python, HTML, and CSS.

## Features

- **Markdown Rendering**: Supports parsing and rendering of markdown content such as headers, bold, italic, code blocks, and lists.
- **Syntax Highlighting**: Highlights code snippets in markdown for supported languages.
- **Custom Sections**: Dynamically render multiple sections of markdown content.
- **Custom Styling**: Basic styling for markdown content such as headers, lists, paragraphs, and more.

### Example

```html
<zephyr-markdown-renderer sections='[
    {
        "header": "Introduction",
        "content": "This is an **example** markdown section. You can use `code` inline."
    },
    {
        "header": "Code Block Example",
        "content": "```js
console.log('Hello World');
```"
    }
]'></zephyr-markdown-renderer>
```

### Attributes

- **`sections`**: An array of objects representing different sections of markdown content. Each object should contain:
    - `header`: The section header (will be rendered as `<h2>`).
    - `content`: The markdown content for that section.

### Supported Markdown Features

- **Headers**: `#`, `##`, and `###` for `<h1>`, `<h2>`, and `<h3>` respectively.
- **Bold**: `**bold text**` or `__bold text__`
- **Italic**: `*italic text*` or `_italic text_`
- **Strikethrough**: `~~strikethrough~~`
- **Code Blocks**: ```language
 code content ```
- **Inline Code**: \`inline code\`
- **Lists**: `- item` or `* item`

### Supported Syntax Highlighting

The following languages are supported for code highlighting:
- **JavaScript** (`js`)
- **C** (`c`)
- **C++** (`cpp`)
- **Java** (`java`)
- **Python** (`py`)
- **HTML** (`html`)
- **CSS** (`css`)

### Methods

- **`parseMarkdown()`**: Converts markdown content into HTML and applies syntax highlighting.
- **`escapeHtml()`**: Escapes special HTML characters in the markdown content.

## Custom CSS

The component provides default styling for common markdown elements, such as headers, paragraphs, lists, and code blocks. You can customize the appearance of the content using the following CSS classes:

- `.markdown-container`: The main container for the markdown content.
- `.section-header`: Styles for section headers.
- `.keyword`, `.string`, `.comment`, `.function`, `.class`, `.number`: Syntax highlighting for code.