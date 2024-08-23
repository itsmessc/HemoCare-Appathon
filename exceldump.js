const { Client } = require('pg');
const ExcelJS = require('exceljs');
const fs = require('fs');

// PostgreSQL connection string
const connectionString = 'postgres://jrejopgd:AC9ZVG5FNdUDF4mOQhqH2O-oS4d6_BHI@bubble.db.elephantsql.com/jrejopgd';

// Path to the existing Excel file
const excelFilePath = './output.xlsx';

const client = new Client({
    connectionString: connectionString,
});

async function replaceExcelFile() {
    try {
        // Connect to PostgreSQL database
        await client.connect();

        // Execute SQL query to fetch data
        const res = await client.query('SELECT * FROM doctor');

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Check if the file exists
        const fileExists = fs.existsSync(excelFilePath);

        if (fileExists) {
            // Load the existing Excel workbook
            await workbook.xlsx.readFile(excelFilePath);

            // Get the first worksheet (you can also specify the worksheet name)
            let worksheet = workbook.getWorksheet(1);

            // If the worksheet doesn't exist, create a new one
            if (!worksheet) {
                worksheet = workbook.addWorksheet('Sheet 1');
            }

            // Clear all existing rows in the worksheet
            worksheet.eachRow((row, rowNumber) => {
                worksheet.spliceRows(rowNumber, 1);
            });
        } else {
            // If the file does not exist, add a new worksheet
            const worksheet = workbook.addWorksheet('Sheet 1');
        }

        // Add column headers from the query result
        const worksheet = workbook.getWorksheet(1);
        worksheet.columns = res.fields.map(field => ({ header: field.name, key: field.name }));

        // Add new rows from the query result
        worksheet.addRows(res.rows);

        // Save the Excel workbook
        await workbook.xlsx.writeFile(excelFilePath);

        console.log('Excel file updated with new data.');

    } catch (err) {
        console.error('Error executing query or replacing Excel file:', err);
    } finally {
        // Disconnect from PostgreSQL database
        await client.end();
    }
}

replaceExcelFile();
