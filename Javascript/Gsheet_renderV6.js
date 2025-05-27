// GSheet_renderV1.js
const GoogleSheetRenderer = (function () {
    // Hardcoded Configuration Variables
    const config = {
        sheetId: '1dqfr76YA3uXOGH2BK1bflf9pcV4MkH5r6NOcv27oFB8',
        apiKey: 'AIzaSyBVYNlFiUuBBnhsa6OZQUXAFz2iBUUxu88'
    };

    
    /**
     * Fetches data from the specified Google Sheet.
     * @param {Object} settings - Contains the sheet name to fetch.
     * @returns {Promise<Array>} - Returns a promise resolving to [headers, sheetData].
     */
    async function Fetchdata(settings) {
        console.log("Fetching data with settings:", settings);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${settings.sheetName}?key=${config.apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.values && data.values.length > 0) {
                const headers = data.values[0];
                const sheetData = data.values.slice(1);
                console.log("Headers:", headers);
                console.log("Data:", sheetData);
                return [headers, sheetData];
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        return [[], []]; // Return empty arrays if no data
    }
  /**
 * Applies multiple filters to the sheet data, supporting exact match and numeric range filters.
 * @param {Array} headers - The column headers.
 * @param {Array} sheetData - The data rows.
 * @param {Object} filters - Filter object: { columnName: value | {min, max} }.
 * @returns {Array} - Filtered data rows.
 */
function applyFilter(headers, sheetData, filters) {
    return sheetData.filter(row => {
        return Object.entries(filters).every(([column, condition]) => {
            const colIndex = headers.indexOf(column);
            if (colIndex === -1) return false;

            const cellValue = row[colIndex];

            // Check for range object
            if (typeof condition === 'object' && (condition.min !== undefined || condition.max !== undefined)) {
                const numericValue = parseFloat(cellValue);
                if (isNaN(numericValue)) return false;

                const minCheck = condition.min !== undefined ? numericValue >= condition.min : true;
                const maxCheck = condition.max !== undefined ? numericValue <= condition.max : true;
                return minCheck && maxCheck;
            }

            // Default to string equality comparison
            return String(cellValue).toLowerCase().trim() === String(condition).toLowerCase().trim();
        });
    });
}


 /**
 * Renders a table using only the columns specified in the headers array.
 * Adds an optional title above the table.
 * @param {Array} headers - The desired headers and column order.
 * @param {Array} filteredData - Full rows of data including all columns.
 * @param {Array} fullColumnHeaders - Full column names from the source data.
 * @param {string} containerId - ID of the HTML element to render the table into.
 * @param {string} [title] - Optional title to display above the table.
 */
function renderTable(headers, filteredData, fullColumnHeaders, containerId, title = '') {
    const container = document.getElementById(containerId);

    if (!container) {
        console.warn(`Container with ID "${containerId}" not found.`);
        return;
    }

    container.innerHTML = '';

    // Optional title
    if (title) {
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.style.marginBottom = '10px';
        titleElement.style.fontFamily = 'Arial, sans-serif';
        container.appendChild(titleElement);
    }

    const table = document.createElement('table');
    table.setAttribute('border', '1');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const columnIndexes = headers.map(header => fullColumnHeaders.indexOf(header));

    filteredData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        columnIndexes.forEach((colIndex, i) => {
            if (colIndex === -1) {
                console.warn(`Header "${headers[i]}" not found in full column headers. Skipping cell.`);
                return;
            }

            const td = document.createElement('td');
            td.textContent = row[colIndex] ?? '';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    styleTable(table); // Apply styles after rendering
}


/**
 * Applies basic CSS styles to a table for readability and responsiveness.
 * @param {HTMLTableElement} table - The table element to style.
 */
function styleTable(table) {
    table.style.width = '80%';
    table.style.borderCollapse = 'collapse';
    table.style.fontFamily = 'Arial, sans-serif';
    table.style.margin = '20px';
    table.style.marginTop = '1rem';
    table.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    table.style.backgroundColor = '#ffffff';

    // Style header
    /** const thead = table.querySelector('thead');
    if (thead) {
        thead.style.backgroundColor = '#333';
        thead.style.color = '#fff';
        thead.style.textAlign = 'center';
    } */

    table.querySelectorAll('th').forEach(cell => {
        cell.style.padding = '8px';
        cell.style.border = '1px solid #ddd';
        cell.style.textAlign = 'center';
        cell.style.backgroundColor = '#4CAF50';
        cell.style.color = '#fff';
    });
/**
    table.querySelectorAll('td').forEach(cell => {
        cell.style.padding = '8px';
        cell.style.border = '1px solid #ddd';
        cell.style.textAlign = 'left';
        cell.style.backgroundColor = '#f9f9f9';
    });
*/
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        row.querySelectorAll('td').forEach(cell => {
            cell.style.padding = '8px';
            cell.style.border = '1px solid #ddd';
            cell.style.textAlign = 'left';
            cell.style.backgroundColor = bgColor;
        });
    });

 const titleElement = table.previousElementSibling;
    if (titleElement && titleElement.tagName === 'H2') {
        titleElement.style.textAlign = 'center';
        titleElement.style.fontFamily = 'Arial, sans-serif';
        titleElement.style.marginBottom = '10px';
        titleElement.style.color = '#333';
    }
}


    return {
        Fetchdata,
        applyFilter,
        renderTable

    };


})();
