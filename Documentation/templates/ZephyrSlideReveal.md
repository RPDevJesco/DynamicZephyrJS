# SlideReveal Web Component

`SlideReveal` is a custom web component built using ZephyrJS, providing a draggable reveal effect between two images or content areas. It allows for horizontal and vertical sliding to reveal a portion of the underlying content based on user input.

## Features

- **Orientation Control**: Supports both horizontal and vertical reveal, dynamically adjustable using attributes.
- **Draggable Handle**: Users can drag a handle to control the reveal percentage interactively.
- **Customizable Reveal Percentage**: Control how much of the content is revealed via a `reveal-percentage` attribute.

## Usage

To use the `SlideReveal` component, first import it and define it in your HTML.

```html
<zephyr-slide-reveal orientation="horizontal" reveal-percentage="50">
    <img slot="background" src="https://wallpapers.com/images/featured/cute-anime-profile-pictures-k6h3uqxn6ei77kgl.jpg" alt="Background Image">
    <img slot="foreground" src="https://steamuserimages-a.akamaihd.net/ugc/1772705834411379245/CBDFB33FBE959A7229DEF55CE3221EAA372E436B/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" alt="Foreground Image">
</zephyr-slide-reveal>

<zephyr-slide-reveal width="800px" height="400px" orientation="horizontal" reveal-percentage="50">
    <img slot="background" src="https://wallpapers.com/images/featured/cute-anime-profile-pictures-k6h3uqxn6ei77kgl.jpg" alt="Background Image">
    <img slot="foreground" src="https://steamuserimages-a.akamaihd.net/ugc/1772705834411379245/CBDFB33FBE959A7229DEF55CE3221EAA372E436B/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" alt="Foreground Image">
</zephyr-slide-reveal>
```

### Attributes

- `orientation`: Controls the sliding direction. Can be either `horizontal` or `vertical`. Default is `horizontal`.
- `reveal-percentage`: Defines the percentage of the content to be revealed. The value is between `0` and `100`. Default is `50`.
- `width`: Defines the width of the image. If not set, it will automatically be set to default values.
- `height`: Defines the height of the image. If not set, it will automatically be set to default values.

### Slots

- `background`: The background content that will be revealed.
- `foreground`: The foreground content that will be partially hidden and revealed based on the drag handle position.

## Methods

- **startDragging**: Initializes the drag action when the user presses or touches the drag handle.
- **drag**: Handles the actual dragging action and updates the reveal percentage based on user input.
- **updateReveal**: Adjusts the content's visibility based on the current `revealPercentage` and `orientation`.

## Styling

The `SlideReveal` component uses a drag handle that can be styled via the shadow DOM. You can customize the appearance of the handle and the transition effects.

### Example Styling

```css
zephyr-slide-reveal .drag-handle {
  background-color: #333;
  transition: left 0.3s ease, top 0.3s ease;
}
```

## Events

The component emits no custom events, but you can listen to DOM changes (like `attributeChangedCallback`) to react to changes in orientation or reveal percentage.