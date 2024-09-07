# HTMLTOKENS Class

The `HTMLTOKENS` class is a utility class designed to encapsulate key aspects of the HTML (HyperText Markup Language). It stores important HTML tokens such as keywords (HTML elements), operators, common attributes, and more.

## Features

- **HTML Elements**: A list of essential HTML elements.
- **Operators**: Common operators used in HTML such as `/`, `<`, `>`, and `=`.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Attributes**: Commonly used HTML attributes like `id`, `class`, `src`, and more.

## Usage

To use the `HTMLTOKENS` class, simply create a new instance of the class:

```js
const tokens = new HTMLTOKENS();
console.log(tokens.keywords); // ['html', 'head', 'title', 'body', 'div', ...]
```

### Available Properties

- **`keywords`**: An array of HTML elements such as `div`, `span`, `p`, `a`, `img`, etc.
- **`operators`**: A list of HTML operators including `/`, `<`, `>`, and `=`.
- **`EOL`**: Symbols that represent the end of a line, such as `\n`.
- **`types`**: (Currently empty) A placeholder for HTML data types.
- **`func`**: The `(` and `)` symbols for functions (although not commonly used in HTML).
- **`string`**: The double, single, and backticks (`"`, `'`, `` ` ``) used for string literals in attributes.
- **`inBuilt`**: A comprehensive list of HTML attributes like `id`, `class`, `src`, `href`, `onclick`, etc.

### Example

Here’s an example of how to use the class:

```js
const htmltokens = new HTMLTOKENS();

// Access keywords
console.log(htmltokens.keywords);  // ['html', 'head', 'title', 'body', 'div', ...]

// Access operators
console.log(htmltokens.operators);  // ['/', '<', '>', '=']

// Access built-in attributes
console.log(htmltokens.inBuilt);  // ['id', 'class', 'src', 'href', 'alt', ...]
```