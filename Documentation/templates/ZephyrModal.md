# DynamicModalComponent

## Overview
`DynamicModalComponent` is a custom web component designed for an adaptive and interactive user experience. It offers dynamic resizing, multi-step transitions, auto-dismissing features, and more. The component is simple to use with just a few custom attributes and integrates dynamic UX/UI elements.

## Features
- **Responsive and Adaptive Layout**: Automatically adjusts size and position based on screen dimensions and content.
- **Interactive Header**: The header dynamically adjusts on user interaction (e.g., scrolling).
- **Content-Aware Transitions**: Automatically resizes and animates based on the content (e.g., images, forms, or videos).
- **Multi-State Views**: Supports different states (info, warning, confirmation), with seamless transitions between these states.
- **Auto-Dismiss with Exit Intent**: Detects when a user is about to leave and triggers an exit intent modal.
- **Multi-Step Forms**: Transitions between steps with a built-in progress indicator.
- **Auto-Size Adjustment**: Resizes dynamically when content inside the modal changes.
- **Interactive Shadow Layer**: Reacts to user interaction by lightening on hover.
- **Drag to Resize**: Allows users to resize the modal by dragging any corner or edge.

## Usage
To use the `DynamicModalComponent`, simply add the custom tag to your HTML and include the desired attributes.

### Example:
```html
<!-- Basic Modal -->
<zephyr-modal id="myModal" modal-type="info" modal-trigger="click">
    <h2 slot="header">Info Update</h2>
    <p>This is an interactive info modal.</p>
</zephyr-modal>

<!-- Info Modal -->
<zephyr-modal
        id="infoModal"
        modal-trigger="click"
        modal-type="info"
        modal-size="auto"
        modal-sticky-header="false"
        modal-background-blur="false"
        modal-exit-intent="false">
    <h2 slot="header">Info Update</h2>
    <p>This is an interactive info modal that dynamically adjusts to content and screen size.</p>
</zephyr-modal>

<!-- Warning Modal -->
<zephyr-modal
        id="warningModal"
        modal-trigger="click"
        modal-type="warning"
        modal-size="auto"
        modal-sticky-header="true"
        modal-background-blur="false"
        modal-exit-intent="true">
    <h2 slot="header">Warning Update</h2>
    <p>This is an interactive warning modal that dynamically adjusts to content and screen size.</p>
</zephyr-modal>

<!-- Confirmation Modal -->
<zephyr-modal
        id="confirmationModal"
        modal-trigger="click"
        modal-type="confirmation"
        modal-size="auto"
        modal-sticky-header="true"
        modal-background-blur="true"
        modal-exit-intent="false">
    <h2 slot="header">Confirmation Update</h2>
    <p>This is an interactive confirmation modal that dynamically adjusts to content and screen size.</p>
</zephyr-modal>
```

### Attributes:

- **modal-trigger**: Determines how the modal is triggered. Options: `hover`, `click`, `auto`.
- **modal-type**: Sets the modal type. Options: `info`, `warning`, `confirmation`.
- **modal-size**: Defines the modal size. Options: `auto`, `fullscreen`, `small`, `large`.
- **modal-sticky-header**: Keeps the header sticky during scrolling. Options: `true`, `false`.
- **modal-background-blur**: Blurs the background when the modal is active. Options: `true`, `false`.
- **modal-exit-intent**: Enables or disables the exit intent modal. Options: `true`, `false`.

## Customization
You can customize the component's appearance and behavior using CSS or JavaScript. The modal is designed to be flexible and work with any layout or design system.