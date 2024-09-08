# ZephyrJS DataTable Component

The **ZephyrJS DataTable Component** is a flexible and dynamic table for modern web applications. It supports various types of tables, each with customizable features, providing a highly adaptable component for developers using ZephyrJS.

## Features

- **Data Types Supported**:
    - Accordion Data Table
    - Tree-Structured Data Table
    - Drill-down Data Table
    - Aggregated Data Table
    - Pivot Table

- **Optional Features**:
    - Pagination (defaults to showing all data if unspecified)
    - Filtering (defaults to false)
    - Sorting (defaults to false)
    - Grouping (defaults to false)
    - group-by (by which the table is grouped by)
    - Multi-selection (defaults to false)
    - In-line Editing (defaults to false)
    - Data Export (supports CSV, JSON, XML; if unspecified, no export functionality is enabled)

## Usage

### HTML Example:

```html
<!-- default (pivot) table with all fields set -->
<zephyr-data-table id="pivot"
   data-type="default"
   pagination="5"
   filtering="true"
   sorting="true"
   grouping="true"
   group-by="category"
   multi-select="true"
   editing="true"
   data-source="generateSampleData">
</zephyr-data-table>
<!-- accordion table with all fields set -->
<zephyr-data-table id="accordion"
   data-type="accordion"
   pagination="5"
   filtering="true"
   sorting="true"
   grouping="true"
   group-by="category"
   multi-select="true"
   editing="true"
   export="csv,json,xml"
   data-source="generateSampleData">
</zephyr-data-table>
<!-- tree-structured table with all fields set -->
<zephyr-data-table id="tree"
   data-type="tree-structured"
   pagination="5"
   filtering="true"
   sorting="true"
   grouping="true"
   group-by="category"
   multi-select="true"
   editing="true"
   export="csv,json,xml"
   data-source="generateSampleData">
</zephyr-data-table>
<!-- drill-down table with only export -->
<zephyr-data-table id="drill"
   data-type="drill-down"
   export="csv,json,xml"
   data-source="generateSampleData">
</zephyr-data-table>
<!-- aggregated table no additional parameters -->
<zephyr-data-table id="aggregated"
   data-type="aggregated"
   data-source="generateSampleData">
</zephyr-data-table>
```

```js
function generateSampleData() {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];
    return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 1000) + 10,
        stock: Math.floor(Math.random() * 100)
    }));
}
```

- **data-type**: Specifies the type of data table. Possible values are:
    - "accordion"
    - "tree-structured"
    - "drill-down"
    - "aggregated"
    - "pivot"
- **pagination**: Defines the number of rows per page. If not set, defaults to showing all data.
- **filtering**: Enables filtering options. Defaults to `false`.
- **sorting**: Enables sorting by columns. Defaults to `false`.
- **grouping**: Enables data grouping. Defaults to `false`.
- **group-by**: Enables data grouping by column in table.
- **multi-select**: Enables multi-selection of rows. Defaults to `false`.
- **editing**: Enables in-line cell editing. Defaults to `false`.
- **export**: Defines the formats allowed for export (CSV, JSON, XML). If not specified, export is disabled.


## Customization via CSS Variables

Like other ZephyrJS components, styling can be customized via CSS variables, including table header colors, row backgrounds, hover effects, and more.