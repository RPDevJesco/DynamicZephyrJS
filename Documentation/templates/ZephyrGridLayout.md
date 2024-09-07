# AdaptiveGridLayout Web Component

`AdaptiveGridLayout` is a custom web component built using ZephyrJS. It provides a dynamic grid layout that adjusts the number of columns based on the screen size and the type of content within the grid.

## Features

- **Responsive Layout**: Automatically adjusts the number of columns based on screen width.
- **Content-Aware Layout**: The grid dynamically calculates the column count based on the type of content (text, images, video, etc.).
- **Mutation Observer**: Reacts to changes in the DOM (like added or removed elements) and updates the layout accordingly.

## Usage

To use the `AdaptiveGridLayout` component, first import it and define it in your HTML.

```html
<zephyr-grid-layout>
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <div class="grid-item">Item 3</div>
</zephyr-grid-layout>
```

### Attributes

There are no attributes to set for this component, but it dynamically calculates the number of columns based on the screen width and content type.

### Grid Styling

- `.grid`: This is the container for the grid items. It uses CSS Grid Layout to create the adaptive column structure.
- `.grid-item`: These are the individual items within the grid. You can style these as needed using custom properties (e.g., `--body-bg`).

## Methods

- **calculateColumnCount**: Determines the number of columns based on content type and screen width.
- **updateGridLayout**: Updates the grid layout by setting the `gridTemplateColumns` property.
- **getContentTypes**: Identifies the types of content in the grid (text, images, videos, etc.).

## Responsive Behavior

The component adapts to the following screen sizes:

- **Large Screens (> 1200px)**: 3 columns for visual content, 2 columns for textual or complex content.
- **Medium Screens (800px - 1200px)**: 2 columns.
- **Small Screens (< 800px)**: 1 column.