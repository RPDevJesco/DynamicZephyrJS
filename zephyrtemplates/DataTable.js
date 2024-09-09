import ZephyrJS, { defineCustomElement } from "../zephyrcore/zephyr.js";

export default class DataTable extends ZephyrJS {
    static get isCoreTemplate() {
        return true;
    }

    static get observedAttributes() {
        return ['data-type', 'pagination', 'filtering', 'sorting', 'grouping', 'multi-select', 'editing', 'export', 'data-source'];
    }

    constructor() {
        super();
        this.state = {
            dataType: 'default',
            pagination: false,
            filtering: false,
            filterValue: '',
            sorting: false,
            grouping: false,
            multiSelect: false,
            editing: false,
            export: [],
            data: [],
            filteredData: [],
            currentPage: 1,
            itemsPerPage: 5,
            sortColumn: null,
            sortDirection: 'asc',
            selectedRows: new Set(),
            groupBy: null,
            expandedRows: new Set(),
            pivotConfig: {
                rows: [],
                columns: [],
                values: []
            }
        };
        this.debouncedFilter = this.debounce(this.applyFiltering.bind(this), 300);
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'data-type':
                this.state.dataType = newValue;
                break;
            case 'pagination':
                this.state.pagination = newValue !== 'false' && newValue !== '0';
                this.state.itemsPerPage = this.state.pagination ? (parseInt(newValue) || 5) : 0;
                this.state.currentPage = 1;
                break;
            case 'filtering':
            case 'sorting':
            case 'grouping':
            case 'multi-select':
            case 'editing':
                this.state[name.replace('-', '')] = newValue === 'true';
                break;
            case 'export':
                this.state.export = newValue ? newValue.split(',') : [];
                break;
            case 'data-source':
                this.dataSource = newValue;
                this.loadData();
                break;
        }
        this.render();
    }

    async loadData() {
        if (typeof this.dataSource === 'function') {
            try {
                const data = await this.dataSource();
                this.state.data = Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Error loading data:', error);
                this.state.data = [];
            }
        } else if (typeof this.dataSource === 'string') {
            if (window[this.dataSource] && typeof window[this.dataSource] === 'function') {
                try {
                    const data = await window[this.dataSource]();
                    this.state.data = Array.isArray(data) ? data : [];
                } catch (error) {
                    console.error('Error loading data:', error);
                    this.state.data = [];
                }
            } else {
                try {
                    const response = await fetch(this.dataSource);
                    const data = await response.json();
                    this.state.data = Array.isArray(data) ? data : [];
                } catch (error) {
                    console.error('Error fetching data:', error);
                    this.state.data = [];
                }
            }
        }

        this.state.filteredData = [...this.state.data];
        this.render();
    }

    renderTable() {
        let tableHtml = '';

        if (this.state.filtering) {
            tableHtml += this.renderFilter();
        }

        switch (this.state.dataType) {
            case 'accordion':
                tableHtml += this.renderAccordionTable(this.state.filteredData);
                break;
            case 'tree-structured':
                tableHtml += this.renderTreeStructuredTable(this.state.filteredData);
                break;
            case 'drill-down':
                tableHtml += this.renderDrillDownTable(this.state.filteredData);
                break;
            case 'aggregated':
                tableHtml += this.renderAggregatedTable(this.state.filteredData);
                break;
            default:
                tableHtml += this.renderDefaultTable(this.state.filteredData);
        }

        if (this.state.pagination) {
            tableHtml += this.renderPagination();
        }

        if (this.state.export.length > 0) {
            tableHtml += this.renderExportButtons();
        }

        return tableHtml;
    }

    renderDefaultTable(data) {
        const pageData = this.getPaginatedData(data);

        let tableHtml = `
            <table class="zephyr-data-table">
                <thead>
                    <tr>
                        ${this.state.multiSelect ? '<th><input type="checkbox" id="select-all"></th>' : ''}
                        ${Object.keys(data[0] || {}).map(key =>
            `<th class="sortable" data-column="${key}">${key}${this.getSortIndicator(key)}</th>`
        ).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        pageData.forEach(item => {
            tableHtml += `
                <tr>
                    ${this.state.multiSelect ? `<td><input type="checkbox" class="row-select" data-id="${item.id}" ${this.state.selectedRows.has(item.id) ? 'checked' : ''}></td>` : ''}
                    ${Object.entries(item).map(([key, value]) =>
                `<td>${this.state.editing ?
                    `<input type="text" value="${value}" data-column="${key}" data-id="${item.id}" class="editable-field">` :
                    value}</td>`
            ).join('')}
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        return tableHtml;
    }

    renderFilter() {
        return `
            <div class="filter">
                <input type="text" placeholder="Filter..." id="filter-input" value="${this.state.filterValue}">
                <button id="clear-filter">Clear Filter</button>
            </div>
        `;
    }

    renderPagination() {
        if (!this.state.pagination) return '';

        const totalPages = Math.ceil(this.state.filteredData.length / this.state.itemsPerPage);
        return `
            <div class="pagination">
                <button id="prev-page" ${this.state.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span>Page ${this.state.currentPage} of ${totalPages}</span>
                <button id="next-page" ${this.state.currentPage === totalPages ? 'disabled' : ''}>Next</button>
            </div>
        `;
    }

    render() {
        this._shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    color: var(--dark-text);
                }
                .zephyr-data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .zephyr-data-table th, .zephyr-data-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .zephyr-data-table th {
                    background-color: var(--body-bg);
                    color: var(--dark-text);
                }
                .zephyr-data-table tr:nth-child(even) {
                    background-color: var(--dark-text);
                }
                .zephyr-data-table tr:hover {
                    background-color: var(--body-bg);
                }
                .filter, .pagination, .export {
                    margin: 10px 0;
                }
                .export-btn {
                    margin-right: 5px;
                }
                .sortable {
                    cursor: pointer;
                }
                .group-header {
                    background-color: var(--header-bg);
                    font-weight: bold;
                }
            </style>
            ${this.renderTable()}
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        // Filtering
        if (this.state.filtering) {
            const filterInput = this._shadowRoot.getElementById('filter-input');
            filterInput.addEventListener('input', this.handleFilterInput.bind(this));

            const clearFilterButton = this._shadowRoot.getElementById('clear-filter');
            clearFilterButton.addEventListener('click', this.clearFilter.bind(this));
        }

        // Sorting
        const sortableHeaders = this._shadowRoot.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => this.handleSort(header.dataset.column));
        });

        // Pagination
        const prevButton = this._shadowRoot.getElementById('prev-page');
        const nextButton = this._shadowRoot.getElementById('next-page');
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => this.changePage(-1));
            nextButton.addEventListener('click', () => this.changePage(1));
        }

        // Editing
        if (this.state.editing) {
            const editableInputs = this._shadowRoot.querySelectorAll('.editable-field');
            editableInputs.forEach(input => {
                input.addEventListener('change', (e) => this.handleEdit(e.target.dataset.id, e.target.dataset.column, e.target.value));
            });
        }

        // Multi-select
        if (this.state.multiSelect) {
            const selectAll = this._shadowRoot.getElementById('select-all');
            if (selectAll) {
                selectAll.addEventListener('change', this.handleSelectAll.bind(this));
            }

            const rowSelects = this._shadowRoot.querySelectorAll('.row-select');
            rowSelects.forEach(select => {
                select.addEventListener('change', (e) => this.handleRowSelect(e.target.dataset.id, e.target.checked));
            });
        }

        // Exporting
        const exportButtons = this._shadowRoot.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExport(e.target.dataset.format));
        });
    }

    handleFilterInput(event) {
        this.state.filterValue = event.target.value.toLowerCase();
        this.debouncedFilter();
    }

    applyFiltering() {
        const filterValue = this.state.filterValue.toLowerCase();
        this.state.filteredData = this.state.data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(filterValue)
            )
        );
        this.updateTableContent();
    }

    clearFilter() {
        this.state.filterValue = '';
        const filterInput = this._shadowRoot.getElementById('filter-input');
        if (filterInput) {
            filterInput.value = '';
        }
        this.state.filteredData = [...this.state.data];
        this.updateTableContent();
    }

    updateTableContent() {
        const tableBody = this._shadowRoot.querySelector('.zephyr-data-table tbody');
        if (!tableBody) return;

        const pageData = this.getPaginatedData(this.state.filteredData);

        let tableHtml = '';
        pageData.forEach(item => {
            tableHtml += `
                <tr>
                    ${this.state.multiSelect ? `<td><input type="checkbox" class="row-select" data-id="${item.id}" ${this.state.selectedRows.has(item.id) ? 'checked' : ''}></td>` : ''}
                    ${Object.entries(item).map(([key, value]) =>
                `<td>${this.state.editing ?
                    `<input type="text" value="${value}" data-column="${key}" data-id="${item.id}" class="editable-field">` :
                    value}</td>`
            ).join('')}
                </tr>
            `;
        });

        tableBody.innerHTML = tableHtml;

        this.updatePagination();
        this.addEventListeners();
    }

    updatePagination() {
        const paginationElement = this._shadowRoot.querySelector('.pagination');
        if (!paginationElement) return;

        const totalPages = Math.ceil(this.state.filteredData.length / this.state.itemsPerPage);
        paginationElement.innerHTML = `
            <button id="prev-page" ${this.state.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${this.state.currentPage} of ${totalPages}</span>
            <button id="next-page" ${this.state.currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
    }

    handleSort(column) {
        if (this.state.sortColumn === column) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortColumn = column;
            this.state.sortDirection = 'asc';
        }
        this.applySorting();
        this.updateTableContent();
    }

    applySorting() {
        if (this.state.sortColumn) {
            this.state.filteredData.sort((a, b) => {
                const aValue = a[this.state.sortColumn];
                const bValue = b[this.state.sortColumn];

                let comparison;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }

                return this.state.sortDirection === 'asc' ? comparison : -comparison;
            });
        }
    }

    handleEdit(id, column, value) {
        const item = this.state.data.find(item => item.id == id);
        if (item) {
            item[column] = value;
            this.applyFiltering();
            this.applySorting();
            this.updateTableContent();
        }
    }

    handleSelectAll(event) {
        const isChecked = event.target.checked;
        const pageData = this.getPaginatedData(this.state.filteredData);
        pageData.forEach(item => {
            if (isChecked) {
                this.state.selectedRows.add(item.id);
            } else {
                this.state.selectedRows.delete(item.id);
            }
        });
        this.updateTableContent();
    }

    handleRowSelect(id, isChecked) {
        if (isChecked) {
            this.state.selectedRows.add(id);
        } else {
            this.state.selectedRows.delete(id);
        }
        this.updateTableContent();
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.state.filteredData.length / this.state.itemsPerPage);
        const newPage = this.state.currentPage + direction;
        if (newPage >= 1 && newPage <= totalPages) {
            this.state.currentPage = newPage;
            this.updateTableContent();
        }
    }

    handleExport(format) {
        let content;
        switch (format) {
            case 'csv':
                content = this.exportToCSV();
                break;
            case 'json':
                content = this.exportToJSON();
                break;
            case 'xml':
                content = this.exportToXML();
                break;
            default:
                console.error('Unsupported export format');
                return;
        }
        this.downloadFile(content, `export.${format}`);
    }

    exportToCSV() {
        const headers = Object.keys(this.state.filteredData[0]).join(',');
        const rows = this.state.filteredData.map(item => Object.values(item).join(','));
        return [headers, ...rows].join('\n');
    }

    exportToJSON() {
        return JSON.stringify(this.state.filteredData, null, 2);
    }

    exportToXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
        this.state.filteredData.forEach(item => {
            xml += '  <item>\n';
            for (const [key, value] of Object.entries(item)) {
                xml += `    <${key}>${value}</${key}>\n`;
            }
            xml += '  </item>\n';
        });
        xml += '</data>';
        return xml;
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    renderExportButtons() {
        return `
            <div class="export">
                ${this.state.export.map(format => `<button class="export-btn" data-format="${format}">Export ${format.toUpperCase()}</button>`).join('')}
            </div>
        `;
    }

    getPaginatedData(data) {
        if (!this.state.pagination || this.state.itemsPerPage <= 0) return data;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        return data.slice(start, end);
    }

    getSortIndicator(column) {
        if (this.state.sortColumn === column) {
            return this.state.sortDirection === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility method to group data
    groupData(data, groupBy) {
        return data.reduce((groups, item) => {
            const group = item[groupBy];
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
            return groups;
        }, {});
    }
}

defineCustomElement('zephyr-data-table', DataTable);