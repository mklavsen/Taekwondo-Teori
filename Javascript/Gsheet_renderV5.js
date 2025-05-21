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
    * Applies multiple filters to the sheet data.
    * @param {Array} headers - The headers of the sheet.
    * @param {Array} sheetData - The rows of data.
    * @param {Array} filters - An array of filter objects: { column, value }.
    * @returns {Array} - Filtered data rows.
    */
    function applyFilter(headers, sheetData, filters) {
        // Map each filter to its index
        const filterCriteria = filters.map(filter => {
            const index = headers.indexOf(filter.column);
            if (index === -1) {
                console.warn(`Column "${filter.column}" not found.`);
            }
            return { index, value: filter.value.toLowerCase().trim(), column: filter.column };
        }).filter(f => f.index !== -1); // Remove invalid columns

        // Apply all filter conditions
        const filteredData = sheetData.filter(row =>
            filterCriteria.every(({ index, value }) =>
                row[index]?.toLowerCase().trim() === value
            )
        );

        console.log("Filtered Data:", filteredData);
        return filteredData;
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
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontFamily = 'Arial, sans-serif';
    table.style.marginTop = '1rem';

    // Style header
    const thead = table.querySelector('thead');
    if (thead) {
        thead.style.backgroundColor = '#333';
        thead.style.color = '#fff';
    }

    table.querySelectorAll('th, td').forEach(cell => {
        cell.style.padding = '8px';
        cell.style.border = '1px solid #ddd';
        cell.style.textAlign = 'left';
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
