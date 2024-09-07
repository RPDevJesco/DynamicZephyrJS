# ZephyrJS Button Component

The ZephyrJS Button Component is a versatile and customizable button element for web applications. It supports various button types, text positioning, and dynamic interactions, making it suitable for a wide range of user interface designs.

## Features

- Supports multiple button types: standard, checkbox, toggle and radio
- Flexible text positioning: inside, left, right, above, and below the button
- Grouping functionality for radio buttons
- Toggle text on click (for standard buttons)
- Customizable styling
- Accessibility support with ARIA attributes
- Event dispatching for change and click events

## Usage

### Basic Usage

```html
<zephyr-button type="button" value="Click me"></zephyr-button>
```

### Attributes
- `type`: Specifies the button type (button, checkbox, radio)
- `value`: Sets the button text or value
- `name`: Assigns a name to the button (useful for form submissions)
- `checked`: Sets the checked state for checkbox and radio buttons
- `group`: Groups radio buttons together
- `text-position`: Positions the text relative to the button (inside, left, right, above, below)
- `clicked-text`: Specifies alternate text to display when the button is clicked
- `toggle-on-text`: Specifies alternate text to display when the toggle is on
- `toggle-off-text`: Specifies alternate text to display when the toggle is off
- 
### Text Positioning

```html
<zephyr-button type="button" value="Left Text" text-position="left"></zephyr-button>
<zephyr-button type="button" value="Right Text" text-position="right"></zephyr-button>
<zephyr-button type="button" value="Above Text" text-position="above"></zephyr-button>
<zephyr-button type="button" value="Below Text" text-position="below"></zephyr-button>
```

### Checkbox and Radio Buttons

```html
<!-- Toggle button with text on the right -->
<zephyr-button type="toggle" toggle-on-text="ON" toggle-off-text="OFF" text-position="right"></zephyr-button>
<!-- Standard button with text inside -->
<zephyr-button type="button" value="Click me"></zephyr-button>

<!-- Button with text on the left -->
<zephyr-button type="button" value="Left Text" text-position="right"></zephyr-button>

<!-- Button with clicked text -->
<zephyr-button type="button" value="Click Me!" clicked-text="Clicked!!!" text-position="above"></zephyr-button>

<!-- Checkbox with text on the right -->
<zephyr-button type="checkbox" value="Agree" text-position="right"></zephyr-button>

<!-- Radio button group with text below -->
<zephyr-button type="radio" value="Option 1" text-position="below" group="options"></zephyr-button>
<zephyr-button type="radio" value="Option 2" text-position="below" group="options"></zephyr-button>
```

### Toggle Text on Click

```html
<zephyr-button type="button" value="Click me" clicked-text="Clicked!"></zephyr-button>
```

## Styling

The component comes with default styling, but you can easily customize its appearance by overriding the CSS variables or adding your own styles.

## Events

The component dispatches custom 'change' and 'click' events. You can listen for these events to perform actions based on user interactions.

```html
<!-- Toggle button with text on the right and event binding -->
<zephyr-button
        id="myButton"
        type="toggle"
        value="Click me!"
        toggle-on-text="ON"
        toggle-off-text="OFF"
        text-position="right"
        onzephyr-change="setMyTheme(event)">
</zephyr-button>
```
```javascript
function setMyTheme(event) {
    const isDarkMode = event.detail.checked;
    if (isDarkMode) {
        setTheme(Themes.HELLFIRE);
    } else {
        setTheme(Themes.FANTASY);
    }
}
```

## Accessibility

The component includes appropriate ARIA attributes to ensure accessibility for all users.

## Browser Support

This component uses modern web technologies and should work in all evergreen browsers.