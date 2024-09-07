# JAVATOKENS Class

The `JAVATOKENS` class is a utility class designed to encapsulate key aspects of the Java programming language. It stores important Java tokens such as keywords, operators, types, and common built-in functions.

## Features

- **Keywords**: A list of essential Java keywords.
- **Operators**: Common operators including arithmetic, assignment, and comparison operators.
- **End of Line (EOL) Symbols**: Includes symbols used to denote the end of a line or statement.
- **Types**: Java primitive and reference data types.
- **Function Syntax**: Symbols for function declaration and invocation.
- **Built-in Functions**: Common Java standard library classes such as `System`, `String`, and `Scanner`.

## Usage

To use the `JAVATOKENS` class, simply create a new instance of the class:

```js
const tokens = new JAVATOKENS();
console.log(tokens.keywords); // ['for', 'while', 'break', 'goto', 'if', ...]
```

### Available Properties

- **`keywords`**: An array of Java keywords such as `for`, `while`, `return`, `abstract`, `try`, etc.
- **`operators`**: A list of Java operators including `=`, `+`, `-`, `*`, `/`, `.` and more.
- **`EOL`**: Symbols that represent the end of a line, such as `;` and `\n`.
- **`unaryOperators`**: (Currently empty) A placeholder for unary operators like `!` or `~`.
- **`ternaryOperators`**: Ternary comparison operators like `==`, `<=`, `>=`, `!=`, `++`, `--`.
- **`types`**: A list of common Java data types such as `int`, `float`, `double`, `byte`, and `class`.
- **`func`**: The `(` and `)` symbols used for functions.
- **`index`**: The `[` and `]` symbols used for arrays or indexing.
- **`curlyBraces`**: The `{` and `}` symbols for defining code blocks.
- **`string`**: The double and single quotes (`"`, `'`) used for string and character literals.
- **`inBuilt`**: Common Java classes like `System`, `String`, and `Scanner`.

### Example

Here’s an example of how to use the class:

```js
const javatokens = new JAVATOKENS();

// Access keywords
console.log(javatokens.keywords);  // ['for', 'while', 'break', 'goto', 'if', ...]

// Access operators
console.log(javatokens.operators);  // ['=', '+', '-', '*', '/', '.', ',', '<', '>', ':']

// Access data types
console.log(javatokens.types);  // ['int', 'float', 'char', 'long', 'double', 'class', ...]

// Access in-built functions
console.log(javatokens.inBuilt);  // ['System', 'String', 'Scanner']
```