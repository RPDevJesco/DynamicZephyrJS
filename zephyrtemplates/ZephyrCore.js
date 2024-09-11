export const Themes = Object.freeze({
    DEFAULT: 'default',
    SHELBY: 'shelby',
    COOL_WINTER: 'cool-winter',
    DARK: 'dark',
    ELEGANT: 'elegant',
    FANTASY: 'fantasy',
    HEAVEN: 'heaven',
    HELLFIRE: 'hellfire',
    HIGH_CONTRAST: 'high-contrast',
    HIGH_TECH: 'high-tech',
    LIGHT: 'light',
    MINIMALIST: 'minimalist',
    NEON: 'neon',
    PASTEL: 'pastel',
    RETRO_FUTURISM: 'retro-futurism',
    VINTAGE: 'vintage',
    WARM_AUTUMN: 'warm-autumn'
});

export function setTheme(themeName) {
    if (Object.values(Themes).includes(themeName)) {
        document.documentElement.setAttribute('data-theme', themeName);
    } else {
        console.warn(`Theme ${themeName} is not defined.`);
    }
}

// Expose setTheme to the global scope
window.Themes = Themes;
window.setTheme = setTheme;

// Import all core templates
import DynamicInput from "../zephyrtemplates/DynamicInput.js";
import DynamicTextArea from "../zephyrtemplates/DynamicTextArea.js";
import DynamicButton from "../zephyrtemplates/DynamicButton.js";
import MarkdownRenderer from "../zephyrtemplates/MarkdownRenderer.js";
import MarkdownEditor from "../zephyrtemplates/MarkdownEditor.js";
import MarkdownShowcase from "../zephyrtemplates/MarkdownShowcase.js";
import DynamicFocusCard from "../zephyrtemplates/DynamicFocusCard.js";
import SlideReveal from "../zephyrtemplates/SlideReveal.js";
import AdaptiveGridLayout from "../zephyrtemplates/AdaptiveGridLayout.js";
import DynamicCard from "../zephyrtemplates/DynamicCard.js";
import DataTable from "../zephyrtemplates/DataTable.js";
import DynamicModalComponent from "../zephyrtemplates/DynamicModalComponent.js";
import DynamicForm from "../zephyrtemplates/DynamicForm.js";
import ZephyrChip from "../zephyrtemplates/ZephyrChip.js";
import ZephyrToast from "../zephyrtemplates/ZephyrToast.js";
import ZephyrContextMenu from "../zephyrtemplates/ZephyrContextMenu.js";
import ZephyrChipContainer from "../zephyrtemplates/ZephyrChipContainer.js";