# ZephyrJS Base Class

`ZephyrJS` is a base class designed for creating custom HTML elements that leverage shadow DOM, state management, and data binding capabilities. It provides a foundational framework to streamline the development of web components, with built-in support for rendering, state handling, and lifecycle management.

## Features

- **Shadow DOM**: Encapsulates the component’s styles and markup within a shadow DOM to prevent style bleeding.
- **State Management**: State is automatically managed through a proxy and bound to the DOM, ensuring UI updates are reactive.
- **Data Binding**: Allows for easy binding of state variables to the DOM, including form elements, text, and computed properties.
- **Template Loading**: Supports loading external HTML templates via URL or local paths.
- **Lifecycle Hooks**: Hooks like `connectedCallback` and `disconnectedCallback` allow for custom behavior when components are added or removed from the DOM.
- **Event Binding**: Simplifies the process of binding events to elements with automatic cleanup when components are unmounted.

## Usage

### Creating a Custom Element

To create a custom element using `ZephyrJS`, extend the base class:

```js
import ZephyrJS, { defineCustomElement } from "./path/to/zephyr.js";

class MyCustomComponent extends ZephyrJS {
    constructor() {
        super();
        // Initialize your state and component-specific logic here
    }
}

// Register your custom element
defineCustomElement('my-custom-component', MyCustomComponent);
```

### State Management

State is managed via a proxy that automatically updates the DOM whenever state variables are changed. Bindings are created using the `updateBindings` method.

```js
this.state = { message: 'Hello World' };
this.setState({ message: 'New Message' });  // Updates DOM bound to message
```

### Data Binding

Elements in your template can be bound to state properties using the `{{property}}` syntax:

```html
<input type="text" bind="{{message}}" />
<p>{{message}}</p>
```

### Template Loading

ZephyrJS can load templates dynamically from a CDN or a local path. The base URL is customizable:

```js
ZephyrJS.setBaseURL('https://cdn.example.com/templates/');
```

### Lifecycle Methods

- `connectedCallback`: Triggered when the component is added to the DOM.
- `disconnectedCallback`: Triggered when the component is removed from the DOM.
- `attributeChangedCallback`: Observes changes to specific attributes and syncs them to state.

### Event Binding

ZephyrJS automatically binds events specified using the `on` attribute in the template:

```html
<button on="click:{{handleClick}}">Click Me</button>
```

In your class:

```js
handleClick() {
    console.log('Button clicked!');
}
```

## Example

Here's an example of how to create a simple custom component using ZephyrJS:

```js
class HelloWorldComponent extends ZephyrJS {
    constructor() {
        super();
        this.state = { name: 'ZephyrJS' };
    }

    async connectedCallback() {
        this.template = await this.loadTemplate();
        await this.render();
    }
}

// Register the custom element
defineCustomElement('hello-world', HelloWorldComponent);
```

### HTML

```html
<hello-world></hello-world>
```

### Template

```html
<template id="hello-world-template">
  <style>
    p {
      color: blue;
    }
  </style>
  <p>Hello, {{name}}!</p>
</template>
```

## Methods

- **`setState(newState)`**: Updates the component's state and triggers DOM updates.
- **`defineComputedProperty(name, computeFn)`**: Defines a computed property that recalculates based on other state properties.
- **`dispatchCustomEvent(eventName, detail)`**: Dispatches a custom event from the component.
- **`applyTheme(theme)`**: Applies a theme to the component using CSS variables.

## License

This project is licensed under the MIT License.