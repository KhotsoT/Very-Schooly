import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { getCurrentTerm, formatDate } from '../utils/saSchoolCalendar';
import { db } from '../firebase/config'; // Import Firestore db
import { collection, getDocs } from 'firebase/firestore';

const PrincipalDashboard = () => {
    const currentTerm = getCurrentTerm();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalLearners: 0,
        totalEducators: 0,
        totalClasses: 0,
        averageAttendance: '0%'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch learners
                const learnersSnapshot = await getDocs(collection(db, 'users'));
                const totalLearners = learnersSnapshot.docs.filter(doc => 
                    doc.data().userType === 'learner' && doc.data().status === 'active' // Check for active learners
                ).length;

                // Fetch educators
                const educatorsSnapshot = await getDocs(collection(db, 'users'));
                const totalEducators = educatorsSnapshot.docs.filter(doc => 
                    doc.data().userType === 'educator' && doc.data().status === 'active' // Check for active educators
                ).length;

                // Fetch classes
                const classesSnapshot = await getDocs(collection(db, 'classes'));
                const totalClasses = classesSnapshot.size;

                setStats({
                    totalLearners: totalLearners,
                    totalEducators: totalEducators,
                    totalClasses: totalClasses,
                    averageAttendance: '92%' // Replace with actual calculation if needed
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleNavigation = (path) => {
        navigate(`/principal-dashboard/${path}`);
    };

    return (
        <DashboardLayout userType="principal">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Principal Dashboard</h1>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Learners</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalLearners}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Educators</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalEducators}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalClasses}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Average Attendance</h3>
                        <p className="text-2xl font-bold mt-2">{stats.averageAttendance}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                onClick={() => handleNavigation('reports')}
                            >
                                View School Reports
                            </button>
                            <button
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                onClick={() => handleNavigation('staff')}
                            >
                                Manage Staff
                            </button>
                            <button
                                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                                onClick={() => handleNavigation('calendar')}
                            >
                                School Calendar
                            </button>
                        </div>
                    </div>

                    {/* Term Information */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Current Term</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Term</span>
                                <span className="font-medium">{currentTerm?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Start Date</span>
                                <span className="font-medium">{formatDate(currentTerm?.start)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">End Date</span>
                                <span className="font-medium">{formatDate(currentTerm?.end)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <p className="font-medium">Staff Meeting Scheduled</p>
                                <p className="text-sm text-gray-500">Friday, 2:00 PM</p>
                            </div>
                            <div className="border-b pb-2">
                                <p className="font-medium">Term Reports Due</p>
                                <p className="text-sm text-gray-500">Next Week</p>
                            </div>
                            <div className="border-b pb-2">
                                <p className="font-medium">Parent-Teacher Conference</p>
                                <p className="text-sm text-gray-500">Planning Stage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PrincipalDashboard; 