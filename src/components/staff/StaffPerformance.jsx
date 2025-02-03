import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
// import DashboardLayout from '../modals/layouts/DashboardLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StaffPerformance = () => {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('term'); // term, year, custom

    const fetchStaffList = async () => {
        try {
            const staffQuery = query(
                collection(db, 'users'),
                where('userType', '==', 'teacher')
            );
            const snapshot = await getDocs(staffQuery);
            const staff = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                department: doc.data().department
            }));
            setStaffList(staff);
        } catch (error) {
            console.error('Error fetching staff list:', error);
        }
    };

    const fetchPerformanceData = async () => {
        if (!selectedStaff) return;

        setLoading(true);
        try {
            // Fetch various performance metrics
            const metricsQuery = query(
                collection(db, 'staffMetrics'),
                where('staffId', '==', selectedStaff)
            );
            const metricsSnapshot = await getDocs(metricsQuery);

            // Process and organize the data
            const metrics = metricsSnapshot.docs.map(doc => ({
                ...doc.data(),
                date: doc.data().date.toDate()
            }));

            // Organize data for charts
            const chartData = processMetricsForCharts(metrics);
            setPerformanceData(chartData);
        } catch (error) {
            console.error('Error fetching performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processMetricsForCharts = (metrics) => {
        // Sort metrics by date
        const sortedMetrics = metrics.sort((a, b) => a.date - b.date);

        return {
            studentPerformance: {
                labels: sortedMetrics.map(m => m.date.toLocaleDateString()),
                datasets: [{
                    label: 'Class Average',
                    data: sortedMetrics.map(m => m.classAverage),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            attendanceRate: {
                labels: sortedMetrics.map(m => m.date.toLocaleDateString()),
                datasets: [{
                    label: 'Attendance Rate',
                    data: sortedMetrics.map(m => m.attendanceRate),
                    backgroundColor: 'rgb(54, 162, 235)',
                }]
            },
            lessonDelivery: sortedMetrics.reduce((acc, curr) => ({
                completed: acc.completed + curr.lessonsCompleted,
                planned: acc.planned + curr.lessonsPlanned
            }), { completed: 0, planned: 0 })
        };
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    useEffect(() => {
        if (selectedStaff) {
            fetchPerformanceData();
        }
    }, [selectedStaff, timeframe]);

    return (
        <DashboardLayout userType="principal">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Staff Performance Tracking</h1>
                    <div className="flex gap-4">
                        <select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Staff Member</option>
                            {staffList.map(staff => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name} - {staff.department}
                                </option>
                            ))}
                        </select>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="term">This Term</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : performanceData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Performance Chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Student Performance Trends</h3>
                            <Line
                                data={performanceData.studentPerformance}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Attendance Rate Chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Class Attendance Rates</h3>
                            <Bar
                                data={performanceData.attendanceRate}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Lesson Delivery Stats */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Lesson Delivery</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed Lessons</p>
                                    <p className="text-2xl font-bold">{performanceData.lessonDelivery.completed}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Planned Lessons</p>
                                    <p className="text-2xl font-bold">{performanceData.lessonDelivery.planned}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Completion Rate</p>
                                    <p className="text-2xl font-bold">
                                        {Math.round((performanceData.lessonDelivery.completed / performanceData.lessonDelivery.planned) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average Class Performance</span>
                                    <span className="font-semibold">
                                        {Math.round(
                                            performanceData.studentPerformance.datasets[0].data.reduce((a, b) => a + b, 0) /
                                            performanceData.studentPerformance.datasets[0].data.length
                                        )}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average Attendance Rate</span>
                                    <span className="font-semibold">
                                        {Math.round(
                                            performanceData.attendanceRate.datasets[0].data.reduce((a, b) => a + b, 0) /
                                            performanceData.attendanceRate.datasets[0].data.length
                                        )}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        Select a staff member to view performance data
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StaffPerformance; 