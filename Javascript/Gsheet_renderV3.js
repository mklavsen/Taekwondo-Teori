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

                    // Apply Pre-Filter if configured
                 if (settings.preFilter && Array.isArray(settings.preFilter)) {
                    settings.preFilter.forEach(filter => {
                          const filterIndex = headers.indexOf(filter.column);
                         if (filterIndex !== -1) {
                               sheetData = sheetData.filter(row => 
                                   row[filterIndex]?.toLowerCase().trim() === filter.value.toLowerCase().trim()
                               );
                         }
                       });
             }       

                    // If no selected columns are provided, use all columns
                    const selectedColumns = settings.selectedColumns.length > 0 ? settings.selectedColumns : headers;
                    const selectedIndices = selectedColumns.map(col => headers.indexOf(col)).filter(index => index !== -1);

                    // Populate Headers
                    const table = document.querySelector(settings.tableId);
                    const thead = table.querySelector('thead');
                    const tbody = table.querySelector('tbody');
                    
                    // Clear previous data
                    thead.innerHTML = '';
                    tbody.innerHTML = '';

                    // Render Headers
                    thead.innerHTML = '<tr>' + selectedColumns.map(col => `<th>${col}</th>`).join('') + '</tr>';

                    // Render Rows
                    tbody.innerHTML = sheetData.map(row => 
                        '<tr>' + selectedIndices.map(index => `<td>${row[index] ?? ''}</td>`).join('') + '</tr>'
                    ).join('');
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

    // Public API
    return {
        fetchAndRenderGoogleSheet
    };
})();
