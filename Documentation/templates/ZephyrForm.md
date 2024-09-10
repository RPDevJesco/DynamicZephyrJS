# DynamicForm Component

The `DynamicForm` component is a versatile, configurable form built using ZephyrJS that supports multi-step forms, field validation, and dynamic rendering. Below are the key features, installation steps, and usage instructions for this component.

## Features

- **Multi-step Form**: Supports forms with multiple steps and configurable navigation (Next/Previous).
- **Dynamic Fields**: Renders various form fields (`input`, `textarea`, `button`) dynamically based on configuration.
- **Validation**: Built-in validation for required fields, pattern matching, and length constraints.
- **Customizable Events**: Handles custom events such as `onInput`, `onStepChange`, and `onSubmit`.
- **Form Data Management**: Provides methods for handling form data, validation errors, and resets.
- **Progress Bar**: Displays the current step progression in a form.

## Usage

To use the `DynamicForm` component, define the form configuration through a `config` attribute in JSON format. Here’s an example:

```html
<zephyr-form id="myForm"></zephyr-form>
```

### JavaScript Usage Example

```js
<script>
    document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('myForm');

    customElements.whenDefined('zephyr-form').then(() => {
    console.log('zephyr-form is defined');

    form.setConfig({
    steps: [
        {
            fields: [
                { type: 'text', name: 'name', label: 'Name', required: true, pattern: 'Alphanumeric' },
                { type: 'email', name: 'email', label: 'Email', required: true, pattern: 'Email' },
                { type: 'textarea', name: 'message', label: 'Message', required: true, minLength: 10 }
            ]
        }
            ],
            events: {
                onSubmit: (event) => {
                    console.log('Form submitted:', event.formData);
                },
                onValidationFailed: (event) => {
                    console.log('Validation failed:', event.errors);
                },
                onStepChange: (event) => {
                    console.log('Step changed:', event.step);
                },
                onInput: (event) => {
                    console.log('Input changed:', event.target.name, event.target.value);
                    console.log('Current form data:', event.formData);
                },
                onReset: () => {
                    console.log('Form reset');
                }
            }
        });
    });
});
</script>
```

## Event Handling

- **onInput**: Triggered whenever input changes in a form field.
- **onStepChange**: Triggered when the form navigation changes to a different step.
- **onSubmit**: Triggered when the form is successfully submitted.
- **onValidationFailed**: Triggered when form validation fails.

## Methods

- `getFormData()`: Retrieves the current form data.
- `resetForm()`: Resets the form data and errors.
- `updateFormData(name, value)`: Updates a specific field's value programmatically.

## Custom Validation

The component allows you to define custom validation rules by specifying patterns and error messages in the `config` object.

```json
{
    "type": "text",
    "name": "email",
    "label": "Email",
    "pattern": "^[^@]+@[^@]+\.[a-zA-Z]{2,}$",
    "patternError": "Please enter a valid email address"
}
```

## Conclusion

The `DynamicForm` component offers a powerful way to handle multi-step forms with dynamic behavior and validation. Customize your forms using the flexible configuration and event system.
