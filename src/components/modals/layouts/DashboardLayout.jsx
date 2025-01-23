import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NotificationBell from '../../common/NotificationBell';

const DashboardLayout = ({ children, userType }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        setSidebarOpen(false);
    };

    const getNavLinks = () => {
        switch (userType) {
            case 'admin':
                return [
                    { title: 'Dashboard', path: '/admin-dashboard' },
                    { title: 'Users', path: '/admin-dashboard/users' },
                    { title: 'Settings', path: '/admin-dashboard/settings' },
                ];
            case 'teacher':
                return [
                    { title: 'Dashboard', path: '/teacher-dashboard' },
                    { title: 'Classes', path: '/teacher-dashboard/classes' },
                    { title: 'Students', path: '/teacher-dashboard/students' },
                    { title: 'Grades', path: '/teacher-dashboard/grades' },
                ];
            case 'student':
                return [
                    { title: 'Dashboard', path: '/student-dashboard' },
                    { title: 'Courses', path: '/student-dashboard/courses' },
                    { title: 'Grades', path: '/student-dashboard/grades' },
                    { title: 'Assignments', path: '/student-dashboard/assignments' },
                ];
            case 'parent':
                return [
                    { title: 'Dashboard', path: '/parent-dashboard' },
                    { title: 'Children', path: '/parent-dashboard/children' },
                    { title: 'Progress', path: '/parent-dashboard/progress' },
                    { title: 'Messages', path: '/parent-dashboard/messages' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={handleOverlayClick}
                ></div>
            )}

            {/* Top Navigation */}
            <nav className="bg-white shadow-md fixed w-full top-0 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center flex-1">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-500 lg:hidden focus:outline-none"
                            >
                                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                                <span className="text-xl font-bold text-blue-600 truncate">
                                    School Management
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 mr-2">
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <LogoutIcon className="h-5 w-5 mr-1" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                                <NotificationBell />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar and Main Content */}
            <div className="flex pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:translate-x-0 lg:static lg:inset-0 z-30 w-64 bg-white shadow-lg transition duration-200 ease-in-out lg:transition-none pt-16 lg:pt-0`}
                >
                    <div className="h-full overflow-y-auto scrollbar-hide">
                        <nav className="px-4 py-4">
                            <div className="flex items-center px-4 py-3 mb-6">
                                <PersonIcon className="text-gray-400 mr-2" />
                                <span className="text-gray-700 font-medium capitalize">
                                    {userType} Portal
                                </span>
                            </div>
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="block px-4 py-2 mb-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 