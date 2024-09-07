# PYTOKENS Class

The `PYTOKENS` class is a utility class designed to encapsulate key aspects of the Python programming language. It stores important Python tokens such as keywords, operators, types, and common built-in functions.

## Features

- **Keywords**: A list of essential Python keywords.
- **Operators**: Common operators including arithmetic, assignment, and comparison operators.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: Common Python data types such as `str`, `int`, `float`, and collections like `list`, `dict`, etc.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Built-in Functions**: Frequently used Python built-in functions like `print`, `input`, `len`, and more.

## Usage

To use the `PYTOKENS` class, simply create a new instance of the class:

```js
const tokens = new PYTOKENS();
console.log(tokens.keywords); // ['import', 'from', 'as', 'def', 'class', ...]
```

### Available Properties

- **`keywords`**: An array of Python keywords such as `import`, `class`, `if`, `else`, `def`, etc.
- **`operators`**: A list of Python operators including `=`, `+`, `-`, `*`, `/`, and more.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`unaryOperators`**: (Currently empty) A placeholder for unary operators.
- **`ternaryOperators`**: Ternary comparison operators like `==`, `<=`, `>=`, `!=`, `++`, `--`.
- **`types`**: A list of common Python data types such as `str`, `int`, `float`, `bool`, `list`, and more.
- **`func`**: The `(` and `)` symbols used for functions.
- **`index`**: The `[` and `]` symbols used for lists or indexing.
- **`string`**: The double, single, and backticks (`"`, `'`, `` ` ``) used for string literals.
- **`inBuilt`**: Common Python built-in functions like `print`, `input`, `open`, `range`, and more.

### Example

Here’s an example of how to use the class:

```js
const pytokens = new PYTOKENS();

// Access keywords
console.log(pytokens.keywords);  // ['import', 'from', 'as', 'def', 'class', ...]

// Access operators
console.log(pytokens.operators);  // ['=', '+', '-', '*', '/', '.', ',', '<', '>']

// Access data types
console.log(pytokens.types);  // ['str', 'int', 'float', 'bool', 'list', 'dict', ...]

// Access built-in functions
console.log(pytokens.inBuilt);  // ['print', 'input', 'open', 'range', 'len', 'str', ...]
```