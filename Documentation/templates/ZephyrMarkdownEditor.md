# MarkdownEditor Component

The `MarkdownEditor` component is a custom web component built using `ZephyrJS` that allows users to input markdown text and renders it as HTML. It also provides syntax highlighting for various programming languages, including JavaScript, C, C++, Java, Python, HTML, and CSS.

## Features

- **Markdown Editing**: Users can input markdown and see it rendered as HTML in real-time.
- **Syntax Highlighting**: Automatically highlights code snippets in the supported languages.
- **Live Preview**: Any changes made in the markdown input are immediately reflected in the rendered HTML.
- **Custom Sections**: Dynamically render multiple sections of markdown content.

### Example

```html
<zephyr-markdown-editor></zephyr-markdown-editor>
```

### Attributes

- **`markdown-content`**: The initial markdown content to be rendered in the editor.

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

- **`updateMarkdownInput()`**: Updates the markdown input and re-parses the content.
- **`parseMarkdown()`**: Converts markdown content into HTML and applies syntax highlighting.
- **`escapeHtml()`**: Escapes special HTML characters in the markdown content.

## Custom CSS

The component provides default styling for common markdown elements, such as headers, paragraphs, lists, and code blocks. You can customize the appearance of the content using the following CSS classes:

- `.markdown-container`: The main container for the markdown content.
- `.section-header`: Styles for section headers.
- `.keyword`, `.string`, `.comment`, `.function`, `.class`, `.number`: Syntax highlighting for code.