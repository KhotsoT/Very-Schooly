import React from 'react';
import * as XLSX from 'xlsx';

const UserUploadTemplate = () => {
    const handleDownload = () => {
        // Define the headers for the Excel template
        const headers = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Surname', key: 'surname', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Password', key: 'password', width: 20 },
            { header: 'Confirm Password', key: 'confirmPassword', width: 20 },
            { header: 'ID Number', key: 'idNumber', width: 20 },
            { header: 'User Type', key: 'userType', width: 20 },
            { header: 'Cellphone', key: 'cellphone', width: 20 },
            { header: 'Address', key: 'address', width: 30 },
        ];

        // Create a new workbook and a new worksheet
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(worksheet, [headers.map(h => h.header)], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        // Generate the Excel file and trigger the download
        XLSX.writeFile(workbook, 'UserUploadTemplate.xlsx');
    };

    return (
        <button onClick={handleDownload} className="bg-green-500 text-white rounded p-2">
            Download User Upload Template
        </button>
    );
};

export default UserUploadTemplate; 