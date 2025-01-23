import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    RadarController
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    RadarController
);

const GradeAnalytics = ({ assessmentId }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [comparativeData, setComparativeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('distribution');
    const [comparisonType, setComparisonType] = useState('class'); // class, subject, time

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const submissionsQuery = query(
                collection(db, 'submissions'),
                where('assessmentId', '==', assessmentId)
            );
            const submissionsSnapshot = await getDocs(submissionsQuery);
            const submissions = submissionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Process data for analytics
            const grades = submissions.map(s => s.grade).filter(g => g !== undefined);
            const gradeRanges = {
                '0-20': 0,
                '21-40': 0,
                '41-60': 0,
                '61-80': 0,
                '81-100': 0
            };

            grades.forEach(grade => {
                const percentage = (grade / 100) * 100;
                if (percentage <= 20) gradeRanges['0-20']++;
                else if (percentage <= 40) gradeRanges['21-40']++;
                else if (percentage <= 60) gradeRanges['41-60']++;
                else if (percentage <= 80) gradeRanges['61-80']++;
                else gradeRanges['81-100']++;
            });

            const stats = {
                total: grades.length,
                average: grades.reduce((a, b) => a + b, 0) / grades.length,
                highest: Math.max(...grades),
                lowest: Math.min(...grades),
                distribution: gradeRanges,
                passingRate: (grades.filter(g => g >= 50).length / grades.length) * 100
            };

            setAnalyticsData(stats);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComparativeData = async () => {
        try {
            // Fetch current assessment details
            const assessmentDoc = await getDocs(doc(db, 'assessments', assessmentId));
            const currentAssessment = { id: assessmentDoc.id, ...assessmentDoc.data() };

            let comparativeQuery;
            if (comparisonType === 'class') {
                // Compare with other classes' performance in same subject
                comparativeQuery = query(
                    collection(db, 'assessments'),
                    where('subject', '==', currentAssessment.subject),
                    where('type', '==', currentAssessment.type)
                );
            } else if (comparisonType === 'subject') {
                // Compare with other subjects in same class
                comparativeQuery = query(
                    collection(db, 'assessments'),
                    where('classId', '==', currentAssessment.classId)
                );
            } else {
                // Compare with historical performance
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                comparativeQuery = query(
                    collection(db, 'assessments'),
                    where('classId', '==', currentAssessment.classId),
                    where('subject', '==', currentAssessment.subject),
                    where('createdAt', '>=', sixMonthsAgo)
                );
            }

            const snapshot = await getDocs(comparativeQuery);
            const assessments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setComparativeData({
                currentAssessment,
                comparisons: assessments.filter(a => a.id !== assessmentId)
            });
        } catch (error) {
            console.error('Error fetching comparative data:', error);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [assessmentId]);

    useEffect(() => {
        if (analyticsData) {
            fetchComparativeData();
        }
    }, [comparisonType, analyticsData]);

    const distributionChartData = {
        labels: Object.keys(analyticsData?.distribution || {}),
        datasets: [
            {
                label: 'Number of Students',
                data: Object.values(analyticsData?.distribution || {}),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    const renderComparativeChart = () => {
        if (!comparativeData) return null;

        switch (comparisonType) {
            case 'class':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Class Performance Comparison</h3>
                        <div className="h-[300px]">
                            <Bar
                                data={{
                                    labels: ['Current Class', ...comparativeData.comparisons.map(c => `Class ${c.className}`)],
                                    datasets: [{
                                        label: 'Average Score',
                                        data: [
                                            analyticsData.average,
                                            ...comparativeData.comparisons.map(c => c.averageScore)
                                        ],
                                        backgroundColor: [
                                            'rgba(54, 162, 235, 0.8)',
                                            ...comparativeData.comparisons.map(() => 'rgba(75, 192, 192, 0.5)')
                                        ]
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                );

            case 'subject':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Subject Performance Comparison</h3>
                        <div className="h-[300px]">
                            <Radar
                                data={{
                                    labels: ['Average Score', 'Passing Rate', 'Completion Rate', 'Top Scores', 'Participation'],
                                    datasets: [{
                                        label: comparativeData.currentAssessment.subject,
                                        data: [
                                            analyticsData.average,
                                            analyticsData.passingRate,
                                            (analyticsData.total / comparativeData.currentAssessment.totalStudents) * 100,
                                            (analyticsData.distribution['81-100'] / analyticsData.total) * 100,
                                            100
                                        ],
                                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                        borderColor: 'rgb(54, 162, 235)',
                                        pointBackgroundColor: 'rgb(54, 162, 235)'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        r: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                );

            case 'time':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
                        <div className="h-[300px]">
                            <Line
                                data={{
                                    labels: [
                                        ...comparativeData.comparisons.map(c => new Date(c.createdAt).toLocaleDateString()),
                                        'Current'
                                    ],
                                    datasets: [{
                                        label: 'Average Score',
                                        data: [
                                            ...comparativeData.comparisons.map(c => c.averageScore),
                                            analyticsData.average
                                        ],
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.1
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Average Score</h4>
                    <p className="text-2xl font-bold">{analyticsData?.average.toFixed(1)}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Passing Rate</h4>
                    <p className="text-2xl font-bold">{analyticsData?.passingRate.toFixed(1)}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Highest Score</h4>
                    <p className="text-2xl font-bold">{analyticsData?.highest}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Lowest Score</h4>
                    <p className="text-2xl font-bold">{analyticsData?.lowest}%</p>
                </div>
            </div>

            {/* Comparison Controls */}
            <div className="flex justify-between items-center">
                <div className="space-x-4">
                    <button
                        onClick={() => setComparisonType('class')}
                        className={`px-4 py-2 rounded ${comparisonType === 'class'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Compare Classes
                    </button>
                    <button
                        onClick={() => setComparisonType('subject')}
                        className={`px-4 py-2 rounded ${comparisonType === 'subject'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Compare Subjects
                    </button>
                    <button
                        onClick={() => setComparisonType('time')}
                        className={`px-4 py-2 rounded ${comparisonType === 'time'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        View Trends
                    </button>
                </div>
            </div>

            {/* Comparative Charts */}
            {renderComparativeChart()}

            {/* Grade Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
                <div className="h-[300px]">
                    <Bar
                        data={distributionChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                                title: {
                                    display: true,
                                    text: 'Grade Distribution'
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Students Assessed</span>
                        <span className="font-semibold">{analyticsData?.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Students Passed</span>
                        <span className="font-semibold">
                            {Math.round((analyticsData?.passingRate * analyticsData?.total) / 100)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Standard Deviation</span>
                        <span className="font-semibold">±{calculateStandardDeviation().toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => {/* Add export to PDF handler */ }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Export to PDF
                </button>
                <button
                    onClick={() => {/* Add export to Excel handler */ }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export to Excel
                </button>
            </div>
        </div>
    );
};

export default GradeAnalytics; 