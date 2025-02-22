import React from 'react';
import * as XLSX from 'xlsx';

const UserUploadTemplate = () => {
    const handleDownload = () => {
        // Define the headers for the Excel template
        const headers = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Surname', key: 'surname', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'ID Number', key: 'idNumber', width: 20 },
            { header: 'User Type', key: 'userType', width: 20 },
            { header: 'Cellphone', key: 'cellphone', width: 20 },
            { header: 'Address', key: 'address', width: 30 },
        ];

        // Create a new workbook and a new worksheet for user data
        const userWorksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(userWorksheet, [headers.map(h => h.header)], { origin: 'A1' });

        // Create a new worksheet for user types
        const userTypes = [
            { userType: 'Educator' },
            { userType: 'Parent' },
            { userType: 'Admin' },
            { userType: 'Principal' },
        ];
        const userTypeWorksheet = XLSX.utils.json_to_sheet(userTypes);
        XLSX.utils.sheet_add_aoa(userTypeWorksheet, [['User Type']], { origin: 'A1' });

        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, userWorksheet, 'Users');
        XLSX.utils.book_append_sheet(workbook, userTypeWorksheet, 'User Types');

        // Generate the Excel file and trigger the download
        XLSX.writeFile(workbook, 'UserUploadTemplate.xlsx');
    };

    return (
        <button onClick={handleDownload} className="bg-green-500 text-white rounded p-2">
            Download Template
        </button>
    );
};

export default UserUploadTemplate; 