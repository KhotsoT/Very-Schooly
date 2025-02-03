import { useState } from 'react';
import { Link } from 'react-router-dom';
// import DashboardLayout from './modals/layouts/DashboardLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
    const [stats] = useState({
        totalStudents: 25,
        totalTeachers: 10,
        totalClasses: 15,
        activeEnrollments: 20
    });

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
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Students</h3>
                        <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Teachers</h3>
                        <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Classes</h3>
                        <p className="text-2xl font-bold">{stats.totalClasses}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Active Enrollments</h3>
                        <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                    <div className="h-64">
                        <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
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