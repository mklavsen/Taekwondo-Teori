<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sheet Data in Google Sites</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>

<h2>Data from Google Sheet</h2>

<table id="data-table">
    <thead></thead>
    <tbody></tbody>
</table>
<script>
    const SHEET_ID = '1dqfr76YA3uXOGH2BK1bflf9pcV4MkH5r6NOcv27oFB8';
    const SHEET_NAME = 'Poomse';
    const API_KEY = 'AIzaSyBVYNlFiUuBBnhsa6OZQUXAFz2iBUUxu88';
    
   // Configuration for Pre-Filter (Invisible)
    const PRE_FILTER = {
        column: 'Poomse', // <-- Replace with the column name
        value: 'Il-jang'  // <-- Replace with the value you want to filter for
    };
 // Configuration for Selected Columns
    const SELECTED_COLUMNS = ['Poomse', 'Tælling', 'Koreansk stand', 'Koreansk teknik', 'Dansk beskrivelse']; // <-- Replace with the column names you want to display

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    let sheetData = [];
    let headers = [];

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 0) {
                headers = data.values[0];
                sheetData = data.values.slice(1);

                // Apply Pre-Filter if configured
                if (PRE_FILTER.column && PRE_FILTER.value) {
                    const filterIndex = headers.indexOf(PRE_FILTER.column);
                    if (filterIndex !== -1) {
                        sheetData = sheetData.filter(row => row[filterIndex]?.toLowerCase() === PRE_FILTER.value.toLowerCase());
                    }
                }

                // Find indices of selected columns
                const selectedIndices = SELECTED_COLUMNS.map(col => headers.indexOf(col)).filter(index => index !== -1);

                // Populate headers for only selected columns
                const thead = document.querySelector('#data-table thead');
                const headerRow = document.createElement('tr');
                SELECTED_COLUMNS.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                // Render table with only selected columns
                renderTable(sheetData, selectedIndices);
            } else {
                document.body.innerHTML = '<p>No data found in the specified sheet.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.body.innerHTML = '<p>Error fetching data from Google Sheet.</p>';
        });

    function renderTable(data, indices) {
        const tbody = document.querySelector('#data-table tbody');
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
</script>

</body>
</html>