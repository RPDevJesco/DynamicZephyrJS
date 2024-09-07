# CPPTOKENS Class

The `CPPTOKENS` class is a utility class designed to encapsulate key aspects of the C++ programming language. It stores important C++ tokens such as keywords, operators, types, and common built-in functions.

## Features

- **Keywords**: A list of essential C++ keywords.
- **Operators**: Common operators including arithmetic, assignment, and comparison operators.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: Common C++ data types like `int`, `float`, `char`, and `class`.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Built-in Functions**: Common C++ standard library functions such as `cout`.

## Usage

To use the `CPPTOKENS` class, simply create a new instance of the class:

```js
const tokens = new CPPTOKENS();
console.log(tokens.keywords); // ['new', 'undefined', 'null', 'if', 'for', ...]
```

### Available Properties

- **`keywords`**: An array of C++ keywords such as `new`, `if`, `for`, `return`, etc.
- **`operators`**: A list of C++ operators including `=`, `+`, `-`, `*`, `/`, `::`, `>`, `:`, etc.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`unaryOperators`**: (Currently empty) A placeholder for unary operators like `!` or `~`.
- **`ternaryOperators`**: Ternary comparison operators like `==`, `<=`, `>=`, `!=`, `++`, `--`, `>>`, `<<`.
- **`types`**: A list of common C++ data types including `class`, `int`, `float`, `char`, and `string`.
- **`func`**: The `(` and `)` symbols used for functions.
- **`index`**: The `[` and `]` symbols used for arrays or indexing.
- **`curlyBraces`**: The `{` and `}` symbols for defining code blocks.
- **`string`**: The double, single, and backticks (`"`, `'`, `` ` ``) used for string and character literals.
- **`inBuilt`**: A list of common C++ standard functions like `cout`.

### Example

Here’s an example of how to use the class:

```js
const cpptokens = new CPPTOKENS();

// Access keywords
console.log(cpptokens.keywords);  // ['new', 'if', 'for', 'return', ...]

// Access operators
console.log(cpptokens.operators);  // ['=', '+', '-', '*', '/', '.', ',', '>', ':', '::']

// Access data types
console.log(cpptokens.types);  // ['class', 'int', 'float', 'char', 'string']

// Access in-built functions
console.log(cpptokens.inBuilt);  // ['cout']
``