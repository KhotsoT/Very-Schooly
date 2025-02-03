import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import { formatDate } from '../../utils/saSchoolCalendar';

const EducatorReports = () => {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [selectedClass, setSelectedClass] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [classes, setClasses] = useState([
        { id: 'class1', name: 'Grade 10 Mathematics' },
        { id: 'class2', name: 'Grade 11 Physics' },
        { id: 'class3', name: 'Grade 9 Mathematics' }
    ]);

    const reportTypes = [
        { id: 'attendance', name: 'Attendance Report' },
        { id: 'assessments', name: 'Assessment Report' },
        { id: 'performance', name: 'Performance Report' }
    ];

    const fetchReportData = async () => {
        if (!selectedClass) return;

        setLoading(true);
        try {
            let collectionRef;
            let q;

            switch (selectedReport) {
                case 'attendance':
                    collectionRef = collection(db, 'attendance');
                    q = query(
                        collectionRef,
                        where('classId', '==', selectedClass),
                        where('date', '>=', new Date(dateRange.start)),
                        where('date', '<=', new Date(dateRange.end))
                    );
                    break;
                case 'assessments':
                    collectionRef = collection(db, 'assessments');
                    q = query(
                        collectionRef,
                        where('classId', '==', selectedClass)
                    );
                    break;
                case 'performance':
                    collectionRef = collection(db, 'grades');
                    q = query(
                        collectionRef,
                        where('classId', '==', selectedClass)
                    );
                    break;
                default:
                    return;
            }

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
        if (selectedClass && dateRange.start && dateRange.end) {
            fetchReportData();
        }
    }, [selectedReport, selectedClass, dateRange.start, dateRange.end]);

    const renderReportContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!selectedClass) {
            return (
                <div className="text-center text-gray-500 py-8">
                    Please select a class to view reports
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

        switch (selectedReport) {
            case 'attendance':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reportData.map(record => (
                                    record.students.map(student => (
                                        <tr key={`${record.id}-${student.studentId}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(record.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.present
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {student.present ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'assessments':
                return (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {reportData.map(assessment => (
                            <div key={assessment.id} className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Type:</span> {assessment.type}</p>
                                    <p><span className="font-medium">Total Marks:</span> {assessment.totalMarks}</p>
                                    <p><span className="font-medium">Due Date:</span> {formatDate(assessment.dueDate)}</p>
                                    <p><span className="font-medium">Status:</span> {assessment.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <DashboardLayout userType="educator">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Print Report
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Report Type
                        </label>
                        <select
                            value={selectedReport}
                            onChange={(e) => setSelectedReport(e.target.value)}
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
                            Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a class</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
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

export default EducatorReports; 