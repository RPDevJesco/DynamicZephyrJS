import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class ZephyrChipContainer extends ZephyrJS {
    static isCoreTemplate = true;

    constructor() {
        super();
        this.state = {
            chips: []
        };
        this.toast = document.createElement('zephyr-toast');
        this.contextMenu = document.createElement('zephyr-context-menu');
        this.undoAction = null;
    }

    async componentDidMount() {
        await this.createToastAndContextMenu();
        this.setupEventListeners();
    }

    async createToastAndContextMenu() {
        document.body.appendChild(this.toast);
        document.body.appendChild(this.contextMenu);

        await customElements.whenDefined('zephyr-toast');
        await customElements.whenDefined('zephyr-context-menu');

        await new Promise(resolve => setTimeout(resolve, 0));
    }

    componentWillUnmount() {
        document.body.removeChild(this.toast);
        document.body.removeChild(this.contextMenu);
    }

    setupEventListeners() {
        this.addEventListener('chipClose', this.handleChipClose.bind(this));
        this.addEventListener('chipSelect', this.handleChipSelect.bind(this));
        this.addEventListener('chipContextMenu', this.handleChipContextMenu.bind(this));
        this.addEventListener('dragover', this.handleDragOver.bind(this));
        this.addEventListener('drop', this.handleDrop.bind(this));
        this.toast.addEventListener('toastAction', this.handleUndoAction.bind(this));
        this.contextMenu.addEventListener('menuItemSelected', this.handleContextMenuAction.bind(this));
    }

    addChip(label, options = {}) {
        const chip = document.createElement('zephyr-chip');
        chip.setAttribute('label', label);
        Object.entries(options).forEach(([key, value]) => {
            chip.setAttribute(key, value.toString());
        });
        chip.classList.add('new-chip');
        setTimeout(() => chip.classList.remove('new-chip'), 300);
        this.state.chips.push(chip);
        this.setState({ chips: this.state.chips });
    }

    handleChipClose(event) {
        const chip = event.target;
        const index = this.state.chips.indexOf(chip);
        const updatedChips = this.state.chips.filter(c => c !== chip);
        this.setState({ chips: updatedChips });
        this.showUndoNotification(() => {
            const newChips = [...this.state.chips];
            newChips.splice(index, 0, chip);
            this.setState({ chips: newChips });
        });
    }

    handleChipSelect(event) {
        const { selected } = event.detail;
        console.log(`Chip selected: ${selected}`);
    }

    handleChipContextMenu(event) {
        const { x, y } = event.detail;
        const chip = event.target;
        this.showContextMenu(x, y, chip);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event) {
        event.preventDefault();
        const label = event.dataTransfer.getData('text/plain');
        const draggedChip = this.state.chips.find(chip => chip.getAttribute('label') === label);
        if (draggedChip) {
            const dropIndex = [...this.children].findIndex(child => {
                const rect = child.getBoundingClientRect();
                return event.clientY < rect.top + rect.height / 2;
            });
            const newChips = this.state.chips.filter(chip => chip !== draggedChip);
            newChips.splice(dropIndex, 0, draggedChip);
            this.setState({ chips: newChips });
        }
    }

    showUndoNotification(undoAction) {
        this.undoAction = undoAction;
        this.toast.setAttribute('message', 'Chip removed');
        this.toast.setAttribute('action', 'Undo');
        this.toast.show();
    }

    handleUndoAction() {
        if (this.undoAction) {
            this.undoAction();
            this.undoAction = null;
            this.toast.hide();
        }
    }

    showContextMenu(x, y, chip) {
        const items = [
            { label: 'Edit', action: () => this.editChip(chip) },
            { label: 'Delete', action: () => this.deleteChip(chip) },
            { label: 'Change Color', action: () => this.changeChipColor(chip) }
        ];
        this.contextMenu.show(x, y, items);
    }

    handleContextMenuAction(event) {
        const { item } = event.detail;
        item.action();
    }

    editChip(chip) {
        const newLabel = prompt('Enter new label:', chip.getAttribute('label'));
        if (newLabel) {
            chip.setAttribute('label', newLabel);
            this.setState({ chips: [...this.state.chips] });
        }
    }

    deleteChip(chip) {
        this.handleChipClose({ target: chip });
    }

    changeChipColor(chip) {
        const colors = ['default', 'blue', 'green', 'red', 'yellow'];
        const currentColor = chip.getAttribute('color') || 'default';
        const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
        chip.setAttribute('color', colors[nextColorIndex]);
        this.setState({ chips: [...this.state.chips] });
    }

    render() {
        super.render();
        this._shadowRoot.innerHTML = '';
        this.state.chips.forEach(chip => this._shadowRoot.appendChild(chip));
    }
}

defineCustomElement('zephyr-chip-container', ZephyrChipContainer);