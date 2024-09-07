# DynamicFocusCard - ZephyrJS Custom Element

The `DynamicFocusCard` is a custom web component built with ZephyrJS, designed to create a dynamic focus area on an image. The component allows users to interactively zoom into a section of the image by hovering or touching, with smooth transitions for an enhanced user experience.

## Features

- **Interactive Zoom**: The component dynamically zooms in on a portion of the image as the user moves their mouse or touches the screen.
- **Focus Area**: A circular focus area highlights a specific part of the image, which follows the user's input.
- **Responsive Behavior**: Adjusts focus size and position based on user interaction.
- **Smooth Transitions**: The component includes smooth transition effects for moving the focus area and zooming in/out.
- **Customizable**: Several attributes can be configured to control the behavior and appearance of the component.


## Usage

Once the element is defined, you can use it in your HTML. Add an `img` tag inside the component to load an image.

```html
<zephyr-focus-card width="300" height="200" zoom-factor="2" focus-size="150">
  <img src="path-to-your-image.jpg" alt="Description of the image" />
</zephyr-focus-card>
```

### Attributes

- `width`: Sets the width of the component. Default is based on the image's natural width if not specified.
- `height`: Sets the height of the component. Default is based on the image's natural height if not specified.
- `zoom-factor`: Sets the zoom factor when hovering or touching. The default value is `2`.
- `focus-size`: Defines the diameter of the circular focus area. The default value is `100`.

### Example

```html
<zephyr-focus-card width="500" height="300" zoom-factor="3" focus-size="200">
  <img src="https://example.com/image.jpg" alt="Sample Image" />
</zephyr-focus-card>
```

## Events

The component listens to the following user interactions:

- `mousemove`: Tracks the mouse position to move the focus area accordingly.
- `touchmove`: Handles touch input for mobile devices.
- `mouseleave`: Resets the focus area to the center of the image when the user moves their mouse away.

## Methods

- `handleMouseMove(event)`: Updates the focus area based on the mouse's position.
- `handleTouchMove(event)`: Updates the focus area based on touch input.
- `updateFocusPosition(x, y)`: Updates the focus area position with normalized coordinates (x and y ranging from `0` to `1`).

## Development

The `DynamicFocusCard` component is built using the ZephyrJS base class, which provides state management and lifecycle hooks for custom elements. It leverages the `connectedCallback` method to set up event listeners and load the image asynchronously.

### Example of Event Listener Setup

```javascript
setupEventListeners() {
    this.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.addEventListener('touchmove', this.handleTouchMove.bind(this));
}
```

### Asynchronous Image Loading

The component automatically extracts the `src` and `alt` attributes from the contained `img` element and asynchronously loads the image.

```javascript
async loadImage() {
    // Image loading logic
}
```

## Conclusion

The `DynamicFocusCard` is an interactive and customizable component ideal for use in product showcases, educational tools, or any application requiring dynamic image exploration. Customize the zoom level, focus size, and component dimensions to suit your specific use case.
