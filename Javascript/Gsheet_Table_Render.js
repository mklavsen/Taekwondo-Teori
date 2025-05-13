// GoogleSheetRenderer Module
const GoogleSheetRenderer = (function () {
    // Hardcoded Configuration Variables
    const config = {
        sheetId: '1dqfr76YA3uXOGH2BK1bflf9pcV4MkH5r6NOcv27oFB8',  // Hardcoded Google Sheet ID
        apiKey: 'AIzaSyBVYNlFiUuBBnhsa6OZQUXAFz2iBUUxu88'  // Hardcoded API Key
    };
    let sheetData = [];
    let headers = [];

    // Initialize the Renderer
    function init(settings) {
        // Set custom header if provided
        if (settings.customHeader) {
            document.getElementById('table-title').textContent = settings.customHeader;
        }

        // Use passed-in sheetName
        const sheetName = settings.sheetName || 'Sheet1'; // Default to 'Sheet1' if not specified
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${sheetName}?key=${config.apiKey}`;
        fetchData(url, settings);
    }

    // Fetch Data from Google Sheets
    function fetchData(url, settings) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.values && data.values.length > 0) {
                    headers = data.values[0]; // First row is the header
                    sheetData = data.values.slice(1); // Rest is the data
                    processData(settings);
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

    // Apply Pre-Filter and Render
    function processData(settings) {
        // Apply the preFilter if provided
        if (settings.preFilter && settings.preFilter.column && settings.preFilter.value) {
            const filterIndex = headers.indexOf(settings.preFilter.column);
            if (filterIndex !== -1) {
                sheetData = sheetData.filter(row => row[filterIndex]?.toLowerCase() === settings.preFilter.value.toLowerCase());
            }
        }

        // Ensure that selectedColumns are available in the headers
        const selectedIndices = settings.selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);
        if (selectedIndices.length > 0) {
            renderTable(settings.tableId, sheetData, selectedIndices);
        } else {
            console.error('Selected columns not found in the sheet headers.');
            alert('The selected columns were not found in the sheet.');
        }
    }

    // Render the Table
    function renderTable(tableId, data, indices) {
        const thead = document.querySelector(tableId + ' thead');
        const tbody = document.querySelector(tableId + ' tbody');

        // Clear any existing table content
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Create header row
        const headerRow = document.createElement('tr');
        indices.forEach(index => {
            const th = document.createElement('th');
            th.textContent = headers[index];
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Populate table with filtered data
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
        init
    };
})();
