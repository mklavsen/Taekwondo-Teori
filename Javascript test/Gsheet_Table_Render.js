// GoogleSheetRenderer Module
const GoogleSheetRenderer = (function () {

    // Configuration Variables
    let config = {};
    let sheetData = [];
    let headers = [];

    // Initialize the Renderer
    function init(settings) {
        config = settings;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${config.sheetName}?key=${config.apiKey}`;
        fetchData(url);
    }

    // Fetch Data from Google Sheets
    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.values && data.values.length > 0) {
                    headers = data.values[0];
                    sheetData = data.values.slice(1);
                    processData();
                } else {
                    console.error('No data found in the specified sheet.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Apply Pre-Filter and Render
    function processData() {
        if (config.preFilter.column && config.preFilter.value) {
            const filterIndex = headers.indexOf(config.preFilter.column);
            if (filterIndex !== -1) {
                sheetData = sheetData.filter(row => row[filterIndex]?.toLowerCase() === config.preFilter.value.toLowerCase());
            }
        }

        const selectedIndices = config.selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);
        renderTable(sheetData, selectedIndices);
    }

    // Render the Table
    function renderTable(data, indices) {
        const thead = document.querySelector('#data-table thead');
        const tbody = document.querySelector('#data-table tbody');

        // Clear any existing table content
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Create header row
        const headerRow = document.createElement('tr');
        config.selectedColumns.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
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
