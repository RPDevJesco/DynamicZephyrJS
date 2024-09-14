import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class ZephyrNavigation extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['type', 'collapsible', 'animation', 'items', 'active-class', 'truncate', 'tab-content-selector', 'accordion-speed'];
    }

    constructor() {
        super();
        // Set default state values
        this.state = {
            type: 'navbar',
            collapsible: false,
            animation: 'smooth',
            items: [],
            activeClass: 'active',
            truncate: false,
            tabContentSelector: '',
            accordionSpeed: '0.3s',
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Update state based on attribute changes
        console.log(`Attribute changed: ${name} from ${oldValue} to ${newValue}`);
        switch (name) {
            case 'type':
                this.state.type = newValue || 'navbar';
                break;
            case 'collapsible':
                this.state.collapsible = newValue !== null;
                break;
            case 'animation':
                this.state.animation = newValue || 'smooth';
                break;
            case 'items':
                try {
                    this.state.items = JSON.parse(newValue) || [];
                } catch (error) {
                    console.error('Invalid JSON for items attribute:', error, 'Value:', newValue);
                    this.state.items = [];
                }
                break;
            case 'active-class':
                this.state.activeClass = newValue || 'active';
                break;
            case 'truncate':
                this.state.truncate = newValue !== null;
                break;
            case 'tab-content-selector':
                this.state.tabContentSelector = newValue || '';
                break;
            case 'accordion-speed':
                this.state.accordionSpeed = newValue || '0.3s';
                break;
        }
        this.render(); // Re-render the component when attributes change
    }

    async connectedCallback() {
        await super.connectedCallback();
        // Additional setup if needed
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Set up event listeners or additional initialization based on type
        switch (this.state.type) {
            case 'tabs':
                this.setupTabs();
                break;
            case 'accordion':
                this.setupAccordion();
                break;
            // Add cases for other types if needed
        }
    }

    setupTabs() {
        const tabLinks = this._shadowRoot.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.activateTab(link.getAttribute('data-target'));
            });
        });
    }

    activateTab(targetId) {
        const contentSelector = this.state.tabContentSelector;
        const contentContainer = document.querySelector(contentSelector);
        if (contentContainer) {
            const allContent = contentContainer.children;
            for (const content of allContent) {
                content.style.display = 'none';
            }
            const targetContent = contentContainer.querySelector(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        }
        // Update active class
        const tabLinks = this._shadowRoot.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove(this.state.activeClass);
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add(this.state.activeClass);
            }
        });
    }

    setupAccordion() {
        const accordionItems = this._shadowRoot.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                this.toggleAccordionItem(item);
            });
        });
    }

    toggleAccordionItem(item) {
        const content = item.querySelector('.accordion-content');
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        content.style.transition = `all ${this.state.accordionSpeed}`;
    }

    async render() {
        // Clear the shadow DOM
        this._shadowRoot.innerHTML = '';

        // Generate the navigation HTML based on type
        let navContent = '';
        switch (this.state.type) {
            case 'navbar':
                navContent = this.renderNavbar();
                break;
            case 'sidebar':
                navContent = this.renderSidebar();
                break;
            case 'breadcrumb':
                navContent = this.renderBreadcrumb();
                break;
            case 'tabs':
                navContent = this.renderTabs();
                break;
            case 'accordion':
                navContent = this.renderAccordion();
                break;
            default:
                navContent = this.renderNavbar(); // Default to navbar
                break;
        }

        // Create a template
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* Include default styles or load from an external stylesheet */
                ${this.getStyles()}
            </style>
            ${navContent}
        `;

        // Append the template content to the shadow DOM
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // Call super render to process bindings
        //await super.render();

        // Initialize navigation functionality
        this.initializeNavigation();
    }

    getStyles() {
        // Return CSS styles based on type and state
        return `
            /* Common styles */
            .active { font-weight: bold; }

            /* Navbar styles */
            ${this.state.type === 'navbar' ? `
            nav.navbar { display: flex; }
            nav.navbar ul { list-style: none; display: flex; padding: 0; margin: 0; }
            nav.navbar li { margin-right: 1em; }
            ` : ''}

            /* Sidebar styles */
            ${this.state.type === 'sidebar' ? `
            nav.sidebar { width: 200px; }
            nav.sidebar ul { list-style: none; padding: 0; margin: 0; }
            nav.sidebar li { margin-bottom: 1em; }
            ` : ''}

            /* Breadcrumb styles */
            ${this.state.type === 'breadcrumb' ? `
            nav.breadcrumb { display: flex; }
            nav.breadcrumb ul { list-style: none; display: flex; padding: 0; margin: 0; }
            nav.breadcrumb li { margin-right: 0.5em; }
            nav.breadcrumb li::after { content: '/'; margin-left: 0.5em; }
            nav.breadcrumb li:last-child::after { content: ''; }
            ` : ''}

            /* Tabs styles */
            ${this.state.type === 'tabs' ? `
            nav.tabs { display: flex; }
            nav.tabs ul { list-style: none; display: flex; padding: 0; margin: 0; }
            nav.tabs li { margin-right: 1em; }
            ` : ''}

            /* Accordion styles */
            ${this.state.type === 'accordion' ? `
            .accordion-item { margin-bottom: 1em; }
            .accordion-header { cursor: pointer; }
            .accordion-content { display: none; }
            ` : ''}
        `;
    }

    renderNavbar() {
        return `
            <nav class="navbar ${this.state.collapsible ? 'collapsible' : ''}">
                <ul>
                    ${this.renderItems(this.state.items)}
                </ul>
            </nav>
        `;
    }

    renderSidebar() {
        return `
            <nav class="sidebar ${this.state.collapsible ? 'collapsible' : ''}">
                <ul>
                    ${this.renderItems(this.state.items)}
                </ul>
            </nav>
        `;
    }

    renderBreadcrumb() {
        return `
            <nav class="breadcrumb">
                <ul>
                    ${this.renderBreadcrumbItems(this.state.items)}
                </ul>
            </nav>
        `;
    }

    renderTabs() {
        return `
            <nav class="tabs">
                <ul>
                    ${this.renderTabItems(this.state.items)}
                </ul>
            </nav>
        `;
    }

    renderAccordion() {
        return `
            <div class="accordion">
                ${this.renderAccordionItems(this.state.items)}
            </div>
        `;
    }

    renderItems(items) {
        return items.map(item => `
            <li>
                <a href="${item.href || '#'}">${item.icon ? `<i class="${item.icon}"></i>` : ''} ${item.label}</a>
                ${item.children ? `<ul>${this.renderItems(item.children)}</ul>` : ''}
            </li>
        `).join('');
    }

    renderBreadcrumbItems(items) {
        const truncatedItems = this.state.truncate ? this.truncateItems(items) : items;
        return truncatedItems.map(item => `
            <li>
                <a href="${item.href || '#'}">${item.label}</a>
            </li>
        `).join('');
    }

    truncateItems(items) {
        const maxItems = 3; // For example, show only the last 3 items
        if (items.length <= maxItems) {
            return items;
        }
        return [
            items[0],
            { label: '...', href: '#' },
            ...items.slice(-2),
        ];
    }

    renderTabItems(items) {
        return items.map((item, index) => `
            <li>
                <a href="${item.href || '#'}" class="tab-link ${index === 0 ? this.state.activeClass : ''}" data-target="${item.href}">
                    ${item.label}
                </a>
            </li>
        `).join('');
    }

    renderAccordionItems(items) {
        return items.map(item => `
            <div class="accordion-item">
                <div class="accordion-header">
                    ${item.label}
                </div>
                <div class="accordion-content">
                    ${item.children ? this.renderAccordionItems(item.children) : ''}
                </div>
            </div>
        `).join('');
    }
}

defineCustomElement('zephyr-navigation', ZephyrNavigation);