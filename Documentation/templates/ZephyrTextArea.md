# Dynamic TextArea Component

The **Dynamic TextArea** component in ZephyrJS offers both **standard text input** and **rich text editing** capabilities, providing a flexible and customizable form element. With optional features like auto-resizing, character/word counting, validation, and a rich text toolbar, this component adapts to various use cases for modern web applications.

## Features

- **Standard and Rich Text Modes**: Easily switch between standard textarea and rich text editing by toggling the toolbar.
- **Auto-Resizing**: The textarea automatically adjusts its height based on content to eliminate the need for scrollbars.
- **Character and Word Counter**: Real-time character or word counting to give users feedback on input limits.
- **Customizable Validation**: Support for `minlength` and `maxlength` validation with dynamic error handling.
- **Rich Text Toolbar**: The rich text mode provides a toolbar for formatting text, such as bold, italic, underline, lists, and links.
- **Theming**: Fully customizable using CSS variables for layout, colors, and behavior.
- **Expand/Collapse Functionality**: Automatically expand the height of the textarea as the user types, if enabled.

## Usage

### Basic Usage

To use the `DynamicTextArea` component, simply include it in your HTML and specify optional attributes like label, placeholder, character counter, and maxlength for validation.

```html
<zephyr-textarea 
  label="Enter your message" 
  placeholder="Type here..." 
  maxlength="250">
</zephyr-textarea>
```

### Switching Between Rich Text and Standard Text Modes

Use the `toolbar` attribute to toggle between **rich text** and **standard textarea** modes:
- If `toolbar="true"`, the component renders a rich text editor with a toolbar for formatting.
- If `toolbar` is not supplied or set to `"false"`, the component behaves as a standard textarea.

#### Example: Rich Text Editor

```html
<zephyr-textarea 
  label="Write your post" 
  placeholder="Start typing..." 
  toolbar="true" 
  height="300px" 
  char-counter 
  maxlength="500">
</zephyr-textarea>
```

#### Example: Standard Textarea

```html
<zephyr-textarea 
  label="Enter your feedback" 
  placeholder="Type your message..." 
  char-counter 
  maxlength="250">
</zephyr-textarea>
```

### Optional Attributes

- **label**: Defines the label text for the textarea. Default: `"Enter Text"`.
- **placeholder**: Sets the placeholder text when the textarea is empty.
- **minlength**: Minimum number of characters required.
- **maxlength**: Maximum number of characters allowed.
- **toolbar**: Boolean attribute. If `true`, enables rich text editing. If `false` or omitted, it defaults to standard textarea behavior.
- **height**: Sets the initial height of the textarea or editor. Default: `"300px"`.
- **expand**: Boolean attribute to enable auto-resizing of the textarea as the user types.
- **char-counter**: Boolean attribute to enable the real-time character counter.
- **word-counter**: Boolean attribute to enable the real-time word counter.

### Validation and Error Handling

The component supports validation for `minlength` and `maxlength`. If the user's input exceeds the defined limits, the component will dynamically display an error message.

```html
<zephyr-textarea 
  label="Your Comment" 
  placeholder="Enter at least 10 characters..." 
  minlength="10" 
  maxlength="500">
</zephyr-textarea>
```

### Character and Word Counting

Enable the character or word counter to display real-time feedback on the user's input length:

#### Character Counter Example:
```html
<zephyr-textarea 
  label="Description" 
  placeholder="Enter a description" 
  char-counter 
  maxlength="300">
</zephyr-textarea>
```

#### Word Counter Example:
```html
<zephyr-textarea 
  label="Summary" 
  placeholder="Summarize your content" 
  word-counter>
</zephyr-textarea>
```

## Accessibility

The `DynamicTextArea` component includes ARIA attributes to ensure that the form fields are accessible to all users, including those using screen readers. Rich text mode also supports keyboard shortcuts (e.g., `Ctrl+B` for bold, `Ctrl+I` for italic).

## Browser Support

The component is designed to work in all evergreen browsers that support web components.

## Conclusion

The **Dynamic TextArea** component provides a versatile solution for handling both **standard text input** and **rich text editing** in a user-friendly, accessible, and customizable manner. With support for validation, auto-resizing, and real-time feedback, it's an ideal choice for modern web applications.