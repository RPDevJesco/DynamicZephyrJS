# JSTOKENS Class

The `JSTOKENS` class is a utility class designed to encapsulate key aspects of the JavaScript programming language. It stores important JavaScript tokens such as keywords, operators, types, and common built-in functions.

## Features

- **Keywords**: A list of essential JavaScript keywords.
- **Operators**: Common operators including arithmetic, assignment, and comparison operators.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: JavaScript variable types and declarations.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Built-in Functions**: Common JavaScript built-in objects such as `console` and the `this` keyword.

## Usage

To use the `JSTOKENS` class, simply create a new instance of the class:

```js
const tokens = new JSTOKENS();
console.log(tokens.keywords); // ['new', 'undefined', 'null', 'if', 'for', ...]
```

### Available Properties

- **`keywords`**: An array of JavaScript keywords such as `new`, `if`, `for`, `return`, `async`, etc.
- **`operators`**: A list of JavaScript operators including `=`, `+`, `-`, `*`, `/`, and more.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`unaryOperators`**: (Currently empty) A placeholder for unary operators like `!` or `~`.
- **`ternaryOperators`**: Ternary comparison operators like `==`, `<=`, `>=`, `!=`, `++`, `--`, `===`.
- **`types`**: JavaScript variable declarations like `var`, `const`, `let`, and types like `function`, `class`.
- **`func`**: The `(` and `)` symbols used for function calls.
- **`index`**: The `[` and `]` symbols used for arrays or indexing.
- **`curlyBraces`**: The `{` and `}` symbols for defining code blocks.
- **`string`**: The double, single, and backticks (`"`, `'`, `` ` ``) used for string literals.
- **`inBuilt`**: Common JavaScript built-in objects like `console` and `this`.

### Example

Here’s an example of how to use the class:

```js
const jstokens = new JSTOKENS();

// Access keywords
console.log(jstokens.keywords);  // ['new', 'if', 'for', 'return', 'async', ...]

// Access operators
console.log(jstokens.operators);  // ['=', '+', '-', '*', '/', '.', ',', '<', '>', ':']

// Access data types
console.log(jstokens.types);  // ['var', 'const', 'let', 'function', 'class', 'constructor']

// Access built-in objects
console.log(jstokens.inBuilt);  // ['console', 'this']
```