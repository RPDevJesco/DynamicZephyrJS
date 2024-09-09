# ZephyrJS Select Dropdown Component

The **Zephyr Select Dropdown** component is a flexible and customizable form element built using the ZephyrJS framework. It provides dynamic options, allows for user interaction, and is fully themable via CSS variables. This dropdown supports various use cases, including single and multiple selections, search functionality, and error handling, all within a responsive, accessible design.

## Features

- **Dynamic Option Generation**: Options can be provided statically as an array or dynamically fetched from an API.
- **Customizable Appearance**: Easily customized using CSS variables for dropdown colors, borders, and padding. Custom icons can be used for the dropdown arrow.
- **Default Value**: Specify a default option that is pre-selected when the dropdown is rendered.
- **Searchable Dropdown**: Search functionality (optional) to filter options in real-time for large data sets.
- **Error Handling**: Built-in validation for required fields with dynamic error messaging.
- **Multiple Selection**: Enable multiple selections with checkboxes for each option.
- **Lazy Loading**: For large datasets, options can be loaded incrementally as the user scrolls.

## Attributes

- **label**: The label that will appear above the dropdown. Default: `"Select an option"`.
- **options**: An array of options, each containing `value` and `label`.
- **default-option**: The option that is selected by default. Default: `""` (none selected).
- **multiple**: Boolean to enable multiple selections. Default: `false`.
- **searchable**: Enables search functionality within the dropdown. Default: `false`.
- **required**: Specifies if the dropdown must be selected before form submission. Default: `false`.
- **error-message**: Custom error message for validation failure. Default: `"Please select an option."`.
- **disabled**: Disables the dropdown. Default: `false`.

## CSS Variables

- **--select-bg**: Background color of the dropdown.
- **--select-border**: Border color of the dropdown.
- **--select-arrow**: URL or SVG for the dropdown arrow icon.
- **--select-text-color**: Color of the selected text.
- **--select-option-hover-bg**: Background color for hovered options.
- **--select-option-selected-bg**: Background color for selected options.
- **--select-disabled-bg**: Background color when the dropdown is disabled.

## Events

- **change**: Fired when an option is selected or changed.
- **open**: Fired when the dropdown is opened.
- **close**: Fired when the dropdown is closed.
- **search**: Fired when the user types into the search box (if enabled).

## Example Usage

### Basic Usage

```html
<zephyr-select 
  label="Choose a Country" 
  options='[{"value": "us", "label": "USA"}, {"value": "ca", "label": "Canada"}, {"value": "uk", "label": "UK"}]' 
  default-option="us" 
  required>
</zephyr-select>
```

### Multi-Select Example

```html
<zephyr-select 
  label="Select Your Hobbies" 
  options='[{"value": "reading", "label": "Reading"}, {"value": "sports", "label": "Sports"}, {"value": "travel", "label": "Traveling"}]' 
  multiple>
</zephyr-select>
```

### Searchable Dropdown Example

```html
<zephyr-select 
  label="Search for a City" 
  options='[{"value": "ny", "label": "New York"}, {"value": "la", "label": "Los Angeles"}, {"value": "chi", "label": "Chicago"}]' 
  searchable>
</zephyr-select>
```

## Component Lifecycle

1. **Initial Render**: The component renders a closed dropdown with the label and placeholder for the default option.
2. **Interaction**: When clicked, the dropdown opens, showing all available options.
3. **Option Selection**: Once an option is selected, the dropdown closes and the selected value is displayed.
4. **Validation**: If `required` is set and no option is selected, an error message will display.
5. **Events**: Events like `change` and `open` are triggered for custom behavior.

## Conclusion

The **Zephyr Select Dropdown** component is designed to provide a smooth, user-friendly experience with flexible customization and dynamic behavior. Its support for multiple selection, search, and lazy loading makes it adaptable for a wide range of projects. The built-in validation and error handling ensure that user input is handled effectively and securely.