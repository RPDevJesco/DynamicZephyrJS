# CTOKENS Class

The `CTOKENS` class is a utility class designed to encapsulate key aspects of the C programming language. It stores important C tokens such as keywords, operators, types, and common built-in functions.

## Features

- **Keywords**: A list of essential C keywords.
- **Operators**: Common operators including arithmetic, assignment, and comparison operators.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: Primitive and complex data types in C.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Built-in Functions**: Common C standard library functions such as `printf`, `scanf`, and more.

## Usage

To use the `CTOKENS` class, simply create a new instance of the class:

```js
const tokens = new CTOKENS();
console.log(tokens.keywords); // ['for', 'while', 'break', 'goto', 'if', ...]
```

### Available Properties

- **`keywords`**: An array of C keywords such as `for`, `while`, `if`, `return`, etc.
- **`operators`**: A list of C operators including `=`, `+`, `-`, `*`, `/`, `<`, `>`, etc.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`unaryOperators`**: (Currently empty) A placeholder for unary operators like `!` or `~`.
- **`ternaryOperators`**: Ternary comparison operators like `==`, `<=`, `>=`, `!=`, `++`, `--`.
- **`types`**: A comprehensive list of data types, including primitive types (`int`, `float`, `char`) and complex types (`struct`, `union`).
- **`func`**: The `(` and `)` symbols used for functions.
- **`index`**: The `[` and `]` symbols used for arrays or indexing.
- **`curlyBraces`**: The `{` and `}` symbols for defining code blocks.
- **`string`**: The double and single quotes (`"` and `'`) used for string and character literals.
- **`inBuilt`**: A list of commonly used standard C library functions like `printf`, `scanf`, `strcat`, etc.

### Example

Here’s an example of how to use the class:

```js
const ctokens = new CTOKENS();

// Access keywords
console.log(ctokens.keywords);  // ['for', 'while', 'break', 'goto', 'if', ...]

// Access operators
console.log(ctokens.operators);  // ['=', '+', '-', '*', '/', '.', ',', '<', '>']

// Access data types
console.log(ctokens.types);  // ['auto', 'extern', 'short', 'float', 'signed', '_Alignas', ...]

// Access in-built functions
console.log(ctokens.inBuilt);  // ['printf', 'scanf', 'abort', 'abs', 'acos', ...]
```