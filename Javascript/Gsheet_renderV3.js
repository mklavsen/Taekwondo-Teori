""// GSheet_renderV3.js
const GoogleSheetRenderer = (function () {
    // Hardcoded Configuration Variables
    const config = {
        sheetId: '1dqfr76YA3uXOGH2BK1bflf9pcV4MkH5r6NOcv27oFB8',
        apiKey: 'AIzaSyBVYNlFiUuBBnhsa6OZQUXAFz2iBUUxu88'
    };

    // Fetch Data and Render Table
    function fetchAndRenderGoogleSheet(settings) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${settings.sheetName}?key=${config.apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.values && data.values.length > 0) {
                    const headers = data.values[0];
                    let sheetData = data.values.slice(1);

                    // Apply Multiple Pre-Filters if configured
                    if (settings.preFilter && Array.isArray(settings.preFilter)) {
                        const filterConditions = settings.preFilter
                            .map(({ column, value }) => {
                                const filterIndex = headers.indexOf(column);
                                if (filterIndex !== -1 && value) {
                                    return { index: filterIndex, value: value.toLowerCase() };
                                }
                                console.warn(`Column '${column}' not found or value is empty.`);
                                return null;
                            })
                            .filter(Boolean);

                        if (filterConditions.length > 0) {
                            sheetData = sheetData.filter(row =>
                                filterConditions.every(condition =>
                                    row[condition.index]?.toLowerCase() === condition.value
                                )
                            );
                        }
                    }

                    // Find indices of selected columns
                    const selectedIndices = settings.selectedColumns
                        .map(col => headers.indexOf(col))
                        .filter(index => index !== -1);

                    if (selectedIndices.length === 0) {
                        console.error('No valid columns found for rendering.');
                        alert('The selected columns were not found in the sheet.');
                        return;
                    }

                    // Populate headers for only selected columns
                    const thead = document.querySelector(settings.tableId + ' thead');
                    const headerRow = document.createElement('tr');
                    settings.selectedColumns.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });
                    thead.innerHTML = '';
                    thead.appendChild(headerRow);

                    // Render table with only selected columns
                    renderTable(sheetData, selectedIndices, settings.tableId);
                } else {
                    console.error('No data found in the specified sheet.');
                    alert('No data found in the sheet.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('There was an error fetching the data from the Google Sheet.');
            });
    }

    // Render the Table
    function renderTable(data, indices, tableId) {
        const tbody = document.querySelector(tableId + ' tbody');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(row => {
            const tr = document.createElement('tr');
            indices.forEach(index => {
                const td = document.createElement('td');
                td.textContent = row[index] ?? '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    // Public API
    return {
        fetchAndRenderGoogleSheet
    };
})();
""
