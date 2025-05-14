function fetchAndRenderGoogleSheet(sheetId, sheetName, apiKey, tableId) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 0) {
                const headers = data.values[0];
                const rows = data.values.slice(1);
                
                const table = document.querySelector(tableId);
                const thead = table.querySelector('thead');
                const tbody = table.querySelector('tbody');
                
                thead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
                tbody.innerHTML = rows.map(row => 
                    '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
                ).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}