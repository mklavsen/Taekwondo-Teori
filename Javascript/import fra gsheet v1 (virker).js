""<!DOCTYPE html>
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

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    let sheetData = [];
    let headers = [];

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 0) {
                headers = data.values[0];
                sheetData = data.values.slice(1);

                // Populate headers
                const thead = document.querySelector('#data-table thead');
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                // Apply Pre-Filter if configured
                if (PRE_FILTER.column && PRE_FILTER.value) {
                    const filterIndex = headers.indexOf(PRE_FILTER.column);
                    if (filterIndex !== -1) {
                        sheetData = sheetData.filter(row => row[filterIndex]?.toLowerCase() === PRE_FILTER.value.toLowerCase());
                    }
                }

                // Render initial table with filtered data
                renderTable(sheetData);
            } else {
                document.body.innerHTML = '<p>No data found in the specified sheet.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.body.innerHTML = '<p>Error fetching data from Google Sheet.</p>';
        });

    function renderTable(data) {
        const tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
</script>

</body>
</html>
""
