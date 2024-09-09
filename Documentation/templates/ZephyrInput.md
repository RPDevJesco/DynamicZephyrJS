# Dynamic Input Component

The `DynamicInput` component is a flexible form input element designed for modern web applications. It allows for customizable behavior through optional attributes, with built-in patterns for common use cases like email, phone, and URL validation. The component automatically applies appropriate validation rules based on the provided pattern and displays error messages dynamically to guide users.

## Features

- **Predefined Patterns**: Easily validate common input types such as email, phone number, URL, etc.
- **Customizable Error Messages**: Default error messages are automatically applied based on the pattern but can be overridden with a custom message.
- **Flexible Validation**: Supports custom regular expressions for specialized input validation.
- **Dynamic Behavior**: Input fields validate automatically upon user interaction, with error feedback provided in real-time.
- **Optional Attributes**: Many attributes are optional and come with reasonable defaults to simplify usage.
- **Slider Support**: Handles `type="range"` inputs, providing a slider interface for users, with `min`, `max`, and `step` attributes to define its range.

## Usage

### Basic Usage

To use the `DynamicInput` component, simply specify the label, type of input, and any necessary validation patterns. If no pattern is specified, the default behavior is applied.

```html
<dynamic-input 
  label="Email" 
  type="email" 
  placeholder="Enter your email" 
  pattern="Email" 
  required>
</dynamic-input>
```

In this example, the component validates the email format automatically using the predefined `Email` pattern.

### Attributes

- **label**: A string to specify the label text for the input field. (Default: `"Enter Value"`)
- **type**: The type of input, such as `text`, `email`, `url`, `range`, etc. (Default: `"text"`)
- **placeholder**: A string representing the placeholder text for the input. (Default: `""`)
- **pattern**: Specifies a predefined validation pattern, such as `Email`, `Phone`, or `URL`. Custom regex patterns can also be supplied.
- **required**: Marks the field as required, ensuring it must be filled out before the form is submitted.
- **error-message**: Optional custom error message for invalid input. If not provided, a default message based on the pattern will be used.
- **min**: Minimum value for the `range` slider input. (Default: `0`, only applies to `type="range"`)
- **max**: Maximum value for the `range` slider input. (Default: `100`, only applies to `type="range"`)
- **step**: The increment value for the `range` slider input. (Default: `1`, only applies to `type="range"`)
- **value**: The initial value for the input. Optional for all input types.

### Predefined Patterns

The component includes several common patterns for validation. These patterns simplify the development process by allowing you to use intuitive strings rather than writing regular expressions.

- `Email`: Validates email addresses.
- `Phone`: Validates phone numbers.
- `URL`: Validates URLs.
- `Number`: Validates numeric inputs.
- `Alphanumeric`: Ensures only alphanumeric characters are entered.

### Example Usage

#### Email Input

```html
<dynamic-input 
  label="Email" 
  type="email" 
  placeholder="Enter your email" 
  pattern="Email" 
  required>
</dynamic-input>
```

#### Phone Number Input

```html
<dynamic-input 
  label="Phone" 
  type="tel" 
  placeholder="Enter your phone number" 
  pattern="Phone">
</dynamic-input>
```

#### Range Slider Input

```html
<dynamic-input 
  label="Volume Control" 
  type="range" 
  min="0" 
  max="100" 
  step="1" 
  value="50">
</dynamic-input>
```

#### Custom Pattern

For more specific input validation, you can provide a custom regex pattern:

```html
<dynamic-input 
  label="Custom Input" 
  type="text" 
  placeholder="Enter a value" 
  pattern="^[A-Za-z]+$" 
  error-message="Please enter only letters.">
</dynamic-input>
```

## Error Handling

The component automatically shows an error message if the user’s input does not match the specified pattern. The error message is displayed dynamically as the user interacts with the input field (e.g., on blur or form submission).

You can customize the error message using the `error-message` attribute. If no custom error message is provided, a default message appropriate to the pattern will be shown.

## Accessibility

The `DynamicInput` component ensures that form fields are accessible to all users, including those using screen readers. Each input is associated with its label, and error messages are displayed in an accessible manner.

## Conclusion

The `DynamicInput` component simplifies form input handling with built-in patterns for common validation use cases, customizable behavior, real-time error feedback, and slider functionality. Its flexibility makes it ideal for use in modern web applications, reducing the amount of custom validation logic needed while ensuring a user-friendly experience.