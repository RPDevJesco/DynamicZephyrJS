# MarkdownShowcase Component

The `MarkdownShowcase` component is a custom web component built using `ZephyrJS` that allows users to navigate through different sections of markdown content, rendering one section at a time with a simple interface to navigate between sections.

## Features

- **Markdown Section Navigation**: Allows users to move between multiple sections of markdown content.
- **Rendering of Markdown**: Each section is rendered using a markdown renderer for formatting.
- **Custom Sections**: Accepts sections as a JSON array to dynamically render different pieces of content.
- **Next/Previous Navigation**: Built-in navigation buttons to move through sections.

## Usage

To use the `MarkdownShowcase` component, include it in your HTML and pass a `sections` attribute that contains an array of sections.

### Example

```html
<zephyr-markdown-showcase sections='[
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
]'></zephyr-markdown-showcase>
```

### Attributes

- **`sections`**: An array of objects representing different sections of markdown content. Each object should contain:
    - `header`: The section header (will be rendered as `<h3>`).
    - `content`: The markdown content for that section.

### Supported Markdown Features

- **Headers**: Renders markdown headers within each section.
- **Bold**: Supports `**bold text**`.
- **Italic**: Supports `*italic text*`.
- **Code Blocks**: Supports multi-line code blocks wrapped in triple backticks (```).
- **Inline Code**: Supports inline code using single backticks (`code`).

### Methods

- **`next()`**: Moves to the next section in the showcase.
- **`prev()`**: Moves to the previous section in the showcase.
- **`setState(newState)`**: Updates the internal state and triggers a re-render of the current section.

## Custom CSS

The component provides default styling for the showcase container and navigation buttons. You can customize the appearance of the content using the following CSS classes:

- `.showcase-container`: The main container for the markdown content.
- `.showcase-nav`: The container for the navigation buttons.
- `.showcase-next`, `.showcase-prev`: Styles for the next/previous buttons.