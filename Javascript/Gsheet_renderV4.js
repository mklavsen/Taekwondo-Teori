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


        /**
     * Fetches data from the specified Google Sheet.
     * @param {Object} settings - Contains the sheet name to fetch.
     * @returns {Promise<Array>} - Returns a promise resolving to [headers, sheetData].
     */

        
        fetch(url)
            .then((response) => {
                console.log(response);
                return response.json();  
            })
        .then(data => {
            if (data.values && data.values.length > 0) {
                const headers = data.values[0];
                let sheetData = data.values.slice(1); 
                console.log(sheetData);
                console.log(headers);

                return [headers, sheetData];
            }
        });
    }

        
    return {
        fetchAndRenderGoogleSheet
    };


})();
