import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import { formatDate } from '../../utils/saSchoolCalendar';

const PrincipalReports = () => {
    const [reportType, setReportType] = useState('academic');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [dateRange, setDateRange] = useState({
        start: '',
        end: new Date().toISOString().split('T')[0]
    });

    const reportTypes = [
        { id: 'academic', name: 'Academic Performance' },
        { id: 'attendance', name: 'School Attendance' },
        { id: 'discipline', name: 'Discipline Reports' },
        { id: 'financial', name: 'Financial Summary' },
        { id: 'staff', name: 'Staff Performance' }
    ];

    const fetchReportData = async () => {
        if (!dateRange.start || !dateRange.end) return;

        setLoading(true);
        try {
            const collectionRef = collection(db, reportType);
            const q = query(
                collectionRef,
                where('date', '>=', new Date(dateRange.start)),
                where('date', '<=', new Date(dateRange.end))
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchReportData();
        }
    }, [reportType, dateRange]);

    const renderReportContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (reportData.length === 0) {
            return (
                <div className="text-center text-gray-500 py-8">
                    No data available for the selected criteria
                </div>
            );
        }

        switch (reportType) {
            case 'academic':
                return (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {reportData.map(report => (
                            <div key={report.id} className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold text-lg mb-2">{report.subject}</h3>
                                <div className="space-y-2">
                                    <p>Average Score: {report.averageScore}%</p>
                                    <p>Pass Rate: {report.passRate}%</p>
                                    <p>Total Students: {report.totalStudents}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'attendance':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reportData.map(record => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4">{formatDate(record.date)}</td>
                                        <td className="px-6 py-4">{record.grade}</td>
                                        <td className="px-6 py-4">{record.presentCount}</td>
                                        <td className="px-6 py-4">{record.absentCount}</td>
                                        <td className="px-6 py-4">{record.attendanceRate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            // Add more cases for other report types...
            default:
                return null;
        }
    };

    return (
        <DashboardLayout userType="principal">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold">School Reports</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Print Report
                        </button>
                        <button
                            onClick={() => {/* Add export functionality */ }}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Export to Excel
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Report Type
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            {reportTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        {renderReportContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PrincipalReports; 