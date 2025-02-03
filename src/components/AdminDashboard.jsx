import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import DashboardLayout from './layouts/DashboardLayout';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        activeEnrollments: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsSnapshot = await getDocs(collection(db, 'users'));
                const teachersSnapshot = await getDocs(collection(db, 'users'));
                const classesSnapshot = await getDocs(collection(db, 'classes'));
                const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));

                setStats({
                    totalStudents: studentsSnapshot.docs.filter(doc => doc.data().userType === 'learner').length,
                    totalTeachers: teachersSnapshot.docs.filter(doc => doc.data().userType === 'educator').length,
                    totalClasses: classesSnapshot.docs.length,
                    activeEnrollments: enrollmentsSnapshot.docs.length
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const menuItems = [
        {
            title: 'User Management',
            description: 'Manage users, roles, and permissions',
            icon: '👥',
            link: '/admin-dashboard/users'
        },
        {
            title: 'Class Management',
            description: 'Manage classes and enrollments',
            icon: '📚',
            link: '/admin-dashboard/classes'
        },
        {
            title: 'Reports',
            description: 'View and generate system reports',
            icon: '📊',
            link: '/admin-dashboard/reports'
        },
        {
            title: 'Settings',
            description: 'Configure system settings',
            icon: '⚙️',
            link: '/admin-dashboard/settings'
        }
    ];

    const chartData = {
        labels: ['Students', 'Teachers', 'Classes', 'Enrollments'],
        datasets: [
            {
                label: 'System Statistics',
                data: [
                    stats.totalStudents,
                    stats.totalTeachers,
                    stats.totalClasses,
                    stats.activeEnrollments
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <DashboardLayout userType="admin">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalStudents}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Teachers</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalTeachers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
                        <p className="text-2xl font-bold mt-2">{stats.totalClasses}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Active Enrollments</h3>
                        <p className="text-2xl font-bold mt-2">{stats.activeEnrollments}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard; 