// GSheet_renderV1.js
const GoogleSheetRenderer = (function () {
    // Hardcoded Configuration Variables
    const config = {
        sheetId: '1dqfr76YA3uXOGH2BK1bflf9pcV4MkH5r6NOcv27oFB8',
        apiKey: 'AIzaSyBVYNlFiUuBBnhsa6OZQUXAFz2iBUUxu88'
    };

    // Fetch Data and Render Table
    function fetchAndRenderGoogleSheet(settings) {
        console.log(settings);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${settings.sheetName}?key=${config.apiKey}`;
        
        fetch(url)
            .then((response) =>{
                                console.log(response);
                 response.json()
                })
            .then(data => {
                if (data.values && data.values.length > 0) {
                    const headers = data.values[0];
                    let sheetData = data.values.slice(1);

                    // Apply Pre-Filter if configured
                    if (settings.preFilter && settings.preFilter.column && settings.preFilter.value) {
                        const filterIndex = headers.indexOf(settings.preFilter.column);
                        if (filterIndex !== -1) {
                            sheetData = sheetData.filter(row => row[filterIndex]?.toLowerCase().trim() === settings.preFilter.value.toLowerCase().trim());
                        }
                    }


                    // Find indices of selected columns
                    const selectedIndices = settings.selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);

                    // Populate headers for only selected columns
                    const thead = document.querySelector(settings.tableId + ' thead');
                    const headerRow = document.createElement('tr');
                    settings.selectedColumns.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });
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
                td.textContent = row[index];
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
