# CSSTOKENS Class

The `CSSTOKENS` class is a utility class designed to encapsulate key aspects of the CSS (Cascading Style Sheets) language. It stores important CSS tokens such as keywords, operators, types, properties, and common built-in functions.

## Features

- **Keywords**: A list of essential CSS at-rules and directives.
- **Operators**: Common operators used in CSS such as colons and periods.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: Common HTML elements targeted by CSS rules.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Properties**: A comprehensive list of CSS properties such as `background`, `color`, `display`, etc.
- **Built-in Functions**: Common CSS functions such as `attr` and `calc`.

## Usage

To use the `CSSTOKENS` class, simply create a new instance of the class:

```js
const tokens = new CSSTOKENS();
console.log(tokens.keywords); // ['@charset', '@import', '@font-face', ...]
```

### Available Properties

- **`keywords`**: An array of CSS at-rules and directives such as `@import`, `@font-face`, `@media`, etc.
- **`operators`**: Common CSS operators including `:`, `::`, and `.`.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`types`**: A list of common HTML elements (`div`, `span`, `input`, `body`) that CSS can target.
- **`properties`**: A list of CSS properties such as `background`, `color`, `display`, `border`, etc.
- **`func`**: The `(` and `)` symbols used for functions.
- **`index`**: The `[` and `]` symbols used for attribute selectors.
- **`curlyBraces`**: The `{` and `}` symbols for defining CSS rule blocks.
- **`string`**: The double and single quotes (`"`, `'`) used for strings.
- **`inBuilt`**: Commonly used CSS functions such as `attr` and `calc`.
- **`values`**: Frequently used CSS values like `flex`, `grid`, `solid`, `screen`, etc.

### Example

Here’s an example of how to use the class:

```js
const csstokens = new CSSTOKENS();

// Access keywords
console.log(csstokens.keywords);  // ['@charset', '@import', '@font-face', ...]

// Access operators
console.log(csstokens.operators);  // [':', '::', '.']

// Access properties
console.log(csstokens.properties);  // ['background', 'color', 'display', 'border', ...]

// Access in-built functions
console.log(csstokens.inBuilt);  // ['attr', 'calc']
```