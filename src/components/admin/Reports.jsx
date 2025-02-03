import { useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
// import DashboardLayout from '../modals/layouts/DashboardLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { Bar } from 'react-chartjs-2';

const Reports = () => {
    const [reportType, setReportType] = useState('enrollment');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const reportTypes = [
        { id: 'enrollment', name: 'Enrollment Statistics' },
        { id: 'attendance', name: 'Attendance Report' },
        { id: 'performance', name: 'Academic Performance' },
        { id: 'activity', name: 'System Activity' }
    ];

    const generateReport = async () => {
        if (!dateRange.start || !dateRange.end) {
            alert('Please select a date range');
            return;
        }

        setLoading(true);
        try {
            let reportQuery;
            switch (reportType) {
                case 'enrollment':
                    reportQuery = query(
                        collection(db, 'enrollments'),
                        where('createdAt', '>=', dateRange.start),
                        where('createdAt', '<=', dateRange.end)
                    );
                    break;
                case 'attendance':
                    reportQuery = query(
                        collection(db, 'attendance'),
                        where('date', '>=', dateRange.start),
                        where('date', '<=', dateRange.end)
                    );
                    break;
                case 'performance':
                    reportQuery = query(
                        collection(db, 'assessments'),
                        where('date', '>=', dateRange.start),
                        where('date', '<=', dateRange.end)
                    );
                    break;
                case 'activity':
                    reportQuery = query(
                        collection(db, 'activities'),
                        where('timestamp', '>=', dateRange.start),
                        where('timestamp', '<=', dateRange.end)
                    );
                    break;
                default:
                    throw new Error('Invalid report type');
            }

            const snapshot = await getDocs(reportQuery);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setReportData(data);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sample Data',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    return (
        <DashboardLayout userType="admin">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Reports</h1>

                {/* Report Controls */}
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {reportTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={generateReport}
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>

                {/* Report Visualization */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Report Visualization</h2>
                    <div className="h-96">
                        <Bar
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Report Data */}
                {reportData && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Report Data</h2>
                        <pre className="bg-gray-50 p-4 rounded overflow-auto">
                            {JSON.stringify(reportData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Reports; 