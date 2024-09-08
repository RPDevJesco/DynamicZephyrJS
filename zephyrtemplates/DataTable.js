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
            dataType: 'accordion',
            pagination: 0,
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
        this.applyFiltering();
        this.applySorting();
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

    renderAccordionDetails(item) {
        // Customize this method to render detailed content for each item
        return `
            <h3>Details for ${item.name || 'Item'}</h3>
            <pre>${JSON.stringify(item, null, 2)}</pre>
        `;
    }

    renderAccordionTable(data) {
        const pageData = this.state.pagination ? this.getPaginatedData(data) : data;
        let tableHtml = `
            <table class="zephyr-data-table accordion">
                <thead>
                    <tr>
                        <th></th>
                        ${Object.keys(data[0] || {}).map(key =>
            `<th class="sortable" data-column="${key}">${key}${this.getSortIndicator(key)}</th>`
        ).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        pageData.forEach((item, index) => {
            const isExpanded = this.state.expandedRows.has(item.id);
            tableHtml += `
                <tr class="accordion-header">
                    <td>
                        <button class="expand-btn" data-id="${item.id}">${isExpanded ? '▼' : '▶'}</button>
                    </td>
                    ${Object.entries(item).map(([key, value]) =>
                `<td>${this.state.editing ?
                    `<input type="text" value="${value}" data-column="${key}" data-id="${item.id}" class="editable-field">` :
                    value}</td>`
            ).join('')}
                </tr>
                <tr class="accordion-content" style="display: ${isExpanded ? 'table-row' : 'none'}">
                    <td colspan="${Object.keys(item).length + 1}">
                        <div class="accordion-details">
                            ${this.renderAccordionDetails(item)}
                        </div>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        return tableHtml;
    }

    renderTreeStructuredTable(data) {
        const flattenedData = this.flattenTreeData(data);
        const paginatedData = this.getPaginatedData(flattenedData);
        const reconstructedTree = this.reconstructTree(paginatedData);

        const renderNode = (node, level = 0) => {
            const isExpanded = this.state.expandedRows.has(node.id);
            let html = `
                <tr class="tree-node" data-level="${level}">
                    <td>
                        ${node.children ? `<button class="expand-btn" data-id="${node.id}">${isExpanded ? '▼' : '▶'}</button>` : ''}
                        ${'&nbsp;'.repeat(level * 2)}${node.name}
                    </td>
                    ${Object.entries(node).filter(([key]) => key !== 'children' && key !== 'name')
                .map(([key, value]) =>
                    `<td>${this.state.editing ?
                        `<input type="text" value="${value}" data-column="${key}" data-id="${node.id}" class="editable-field">` :
                        value}</td>`
                ).join('')}
                </tr>
            `;

            if (node.children && isExpanded) {
                node.children.forEach(child => {
                    html += renderNode(child, level + 1);
                });
            }

            return html;
        };

        let tableHtml = `
            <table class="zephyr-data-table tree-structured">
                <thead>
                    <tr>
                        <th>Name</th>
                        ${Object.keys(flattenedData[0] || {}).filter(key => key !== 'children' && key !== 'name' && key !== 'level')
            .map(key => `<th class="sortable" data-column="${key}">${key}${this.getSortIndicator(key)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${reconstructedTree.map(node => renderNode(node)).join('')}
                </tbody>
            </table>
        `;

        return tableHtml;
    }

    flattenTreeData(tree, level = 0, result = []) {
        tree.forEach(node => {
            const flatNode = { ...node, level };
            result.push(flatNode);
            if (node.children) {
                this.flattenTreeData(node.children, level + 1, result);
            }
        });
        return result;
    }

    reconstructTree(flatData) {
        const tree = [];
        const map = {};

        flatData.forEach(node => {
            map[node.id] = { ...node, children: [] };
        });

        flatData.forEach(node => {
            if (node.level === 0) {
                tree.push(map[node.id]);
            } else {
                const parent = flatData.find(n => n.level === node.level - 1 && flatData.indexOf(n) < flatData.indexOf(node));
                if (parent && map[parent.id]) {
                    map[parent.id].children.push(map[node.id]);
                }
            }
        });

        return tree;
    }

    renderDrillDownTable(data) {
        const pageData = this.getPaginatedData(data);
        let tableHtml = `
            <table class="zephyr-data-table drill-down">
                <thead>
                    <tr>
                        ${Object.keys(data[0] || {}).map(key =>
            `<th class="sortable" data-column="${key}">${key}${this.getSortIndicator(key)}</th>`
        ).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        pageData.forEach(item => {
            tableHtml += `
                <tr class="drill-down-row" data-id="${item.id}">
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
            <div id="drill-down-details" style="display: none;"></div>
        `;

        return tableHtml;
    }

    renderAggregatedTable(data) {
        const aggregatedData = this.aggregateData(data);
        let tableHtml = `
            <table class="zephyr-data-table aggregated">
                <thead>
                    <tr>
                        <th class="sortable" data-column="category">Category${this.getSortIndicator('category')}</th>
                        <th class="sortable" data-column="count">Count${this.getSortIndicator('count')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.entries(aggregatedData).forEach(([category, items]) => {
            tableHtml += `
                <tr>
                    <td>${category}</td>
                    <td>${items.length}</td>
                    <td><button class="show-details-btn" data-category="${category}">Show Details</button></td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
            <div id="aggregated-details" style="display: none;"></div>
        `;

        return tableHtml;
    }

    aggregateData(data) {
        return data.reduce((acc, item) => {
            const category = item[this.state.groupBy || 'category'];
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {});
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

    getPaginatedData(data) {
        if (!this.state.pagination || this.state.itemsPerPage <= 0) return data;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        return data.slice(start, end);
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.state.filteredData.length / this.state.itemsPerPage);
        const newPage = this.state.currentPage + direction;
        if (newPage >= 1 && newPage <= totalPages) {
            this.state.currentPage = newPage;
            this.render();
        }
    }

    groupData(data, groupBy) {
        return data.reduce((groups, item) => {
            const group = item[groupBy];
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    getSortIndicator(column) {
        if (this.state.sortColumn === column) {
            return this.state.sortDirection === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
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
            filterInput.addEventListener('input', this.handleFilter.bind(this));

            const clearFilterButton = this._shadowRoot.getElementById('clear-filter');
            clearFilterButton.addEventListener('click', this.clearFilter.bind(this));
        }

        // Sorting
        const sortableHeaders = this._shadowRoot.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => this.handleSort(header.dataset.column));
        });

        // Editing
        if (this.state.editing) {
            const editableInputs = this._shadowRoot.querySelectorAll('.editable-field');
            editableInputs.forEach(input => {
                input.addEventListener('change', (e) => this.handleEdit(e.target.dataset.id, e.target.dataset.column, e.target.value));
            });
        }

        // Pagination
        const prevButton = this._shadowRoot.getElementById('prev-page');
        const nextButton = this._shadowRoot.getElementById('next-page');
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => this.changePage(-1));
            nextButton.addEventListener('click', () => this.changePage(1));
        }

        // Editing
        if (this.state.editing) {
            const editableInputs = this._shadowRoot.querySelectorAll('input[data-column]');
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

        // Grouping
        if (this.state.grouping) {
            const groupSelects = this._shadowRoot.querySelectorAll('.group-select');
            groupSelects.forEach(select => {
                select.addEventListener('change', (e) => this.handleGroupSelect(e.target.dataset.group, e.target.checked));
            });
        }

        // Exporting
        const exportButtons = this._shadowRoot.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExport(e.target.dataset.format));
        });

        // Add listeners for expand buttons (accordion and tree-structured)
        const expandButtons = this._shadowRoot.querySelectorAll('.expand-btn');
        expandButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExpand(e.target.dataset.id));
        });

        // Add listeners for drill-down rows
        const drillDownRows = this._shadowRoot.querySelectorAll('.drill-down-row');
        drillDownRows.forEach(row => {
            row.addEventListener('click', (e) => this.handleDrillDown(e.target.closest('tr').dataset.id));
        });

        // Add listeners for show details buttons (aggregated)
        const showDetailsButtons = this._shadowRoot.querySelectorAll('.show-details-btn');
        showDetailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShowAggregatedDetails(e.target.dataset.category));
        });
    }

    handleExpand(id) {
        if (this.state.expandedRows.has(id)) {
            this.state.expandedRows.delete(id);
        } else {
            this.state.expandedRows.add(id);
        }
        this.render();
    }

    handleDrillDown(id) {
        const item = this.state.filteredData.find(item => item.id == id);
        if (item) {
            const detailsDiv = this._shadowRoot.getElementById('drill-down-details');
            detailsDiv.innerHTML = `
                <h3>Details for ${item.name}</h3>
                <pre>${JSON.stringify(item, null, 2)}</pre>
            `;
            detailsDiv.style.display = 'block';
        }
    }

    handleShowAggregatedDetails(category) {
        const aggregatedData = this.aggregateData(this.state.filteredData);
        const items = aggregatedData[category];
        if (items) {
            const detailsDiv = this._shadowRoot.getElementById('aggregated-details');
            detailsDiv.innerHTML = `
                <h3>Details for ${category}</h3>
                <table>
                    <thead>
                        <tr>${Object.keys(items[0]).map(key => `<th>${key}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>${Object.values(item).map(value => `<td>${value}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            detailsDiv.style.display = 'block';
        }
    }

    handleFilter(event) {
        const filterValue = event.target.value.toLowerCase();
        this.state.filterValue = filterValue;
        this.applyFiltering(filterValue);
        this.state.currentPage = 1; // Reset to first page when filtering
        this.render();
    }

    clearFilter() {
        this.state.filterValue = '';
        this.state.filteredData = [...this.state.data];
        this.state.currentPage = 1;
        this.render();
    }

    applyFiltering(filterValue = this.state.filterValue) {
        const filterRecursively = (items) => {
            return items.filter(item => {
                const matches = Object.entries(item).some(([key, value]) =>
                    key !== 'children' && String(value).toLowerCase().includes(filterValue.toLowerCase())
                );
                if (item.children) {
                    item.children = filterRecursively(item.children);
                    return item.children.length > 0 || matches;
                }
                return matches;
            });
        };

        this.state.filteredData = filterRecursively([...this.state.data]);
        this.state.currentPage = 1; // Reset to first page when filtering
    }

    handleSort(column) {
        console.log('Sorting by:', column);  // Debug log
        if (this.state.sortColumn === column) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortColumn = column;
            this.state.sortDirection = 'asc';
        }
        this.applySorting();
        this.render();
    }

    applySorting() {
        if (this.state.sortColumn) {
            const sortRecursively = (items) => {
                return items.sort((a, b) => {
                    const aValue = a[this.state.sortColumn];
                    const bValue = b[this.state.sortColumn];

                    let comparison;
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        comparison = aValue - bValue;
                    } else {
                        comparison = String(aValue).localeCompare(String(bValue));
                    }

                    return this.state.sortDirection === 'asc' ? comparison : -comparison;
                }).map(item => {
                    if (item.children) {
                        item.children = sortRecursively(item.children);
                    }
                    return item;
                });
            };

            this.state.filteredData = sortRecursively([...this.state.filteredData]);
            this.state.data = sortRecursively([...this.state.data]);
        }
    }

    handleGroupSelect(group, isChecked) {
        const groupedData = this.groupData(this.state.filteredData, this.state.groupBy);
        const groupItems = groupedData[group];
        groupItems.forEach(item => {
            if (isChecked) {
                this.state.selectedRows.add(item.id);
            } else {
                this.state.selectedRows.delete(item.id);
            }
        });
        this.render();
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
        this.render();
    }

    handleRowSelect(id, isChecked) {
        if (isChecked) {
            this.state.selectedRows.add(id);
        } else {
            this.state.selectedRows.delete(id);
        }
        this.render();
    }

    handleEdit(id, column, value) {
        console.log('Editing:', id, column, value);  // Debug log
        const updateRecursively = (items) => {
            return items.map(item => {
                if (item.id == id) {
                    item[column] = value;
                }
                if (item.children) {
                    item.children = updateRecursively(item.children);
                }
                return item;
            });
        };

        this.state.data = updateRecursively([...this.state.data]);
        this.state.filteredData = updateRecursively([...this.state.filteredData]);
        this.applyFiltering();
        this.applySorting();
        this.render();
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
}

defineCustomElement('zephyr-data-table', DataTable);