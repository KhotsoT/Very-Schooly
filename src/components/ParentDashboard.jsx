import DashboardLayout from './modals/layouts/DashboardLayout';

const ParentDashboard = () => {
    return (
        <DashboardLayout userType="parent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <h1 className="text-2xl font-bold col-span-full">Parent Dashboard</h1>
                {/* Children Overview */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Children Overview</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-3">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">John Smith</span>
                                <span className="text-green-500">Grade 10</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Average Grade</span>
                                <span className="font-medium">85%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Attendance</span>
                                <span className="font-medium">95%</span>
                            </div>
                        </div>
                        <div className="border-b pb-3">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Sarah Smith</span>
                                <span className="text-green-500">Grade 8</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Average Grade</span>
                                <span className="font-medium">88%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Attendance</span>
                                <span className="font-medium">98%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-medium">Parent-Teacher Meeting</p>
                            <p className="text-sm text-gray-500">March 15, 2024 - 3:00 PM</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">School Concert</p>
                            <p className="text-sm text-gray-500">March 20, 2024 - 6:00 PM</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">Sports Day</p>
                            <p className="text-sm text-gray-500">March 25, 2024 - All Day</p>
                        </div>
                    </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-medium text-red-500">Absence Notice</p>
                            <p className="text-sm text-gray-500">John missed Math class on Monday</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium text-green-500">Grade Update</p>
                            <p className="text-sm text-gray-500">Sarah scored 92% in Science Quiz</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium text-blue-500">Fee Reminder</p>
                            <p className="text-sm text-gray-500">Term 2 fees due in 5 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Progress */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Academic Progress</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-3">
                            <p className="font-medium mb-2">John Smith</p>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Mathematics</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Science</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-b pb-3">
                            <p className="font-medium mb-2">Sarah Smith</p>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Mathematics</span>
                                        <span>92%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Science</span>
                                        <span>88%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Communication Center */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Communication Center</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-medium">Message from Math Teacher</p>
                            <p className="text-sm text-gray-500">Regarding John's homework submission</p>
                            <button className="mt-2 text-sm text-blue-500 hover:text-blue-600">
                                Read Message
                            </button>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">School Newsletter</p>
                            <p className="text-sm text-gray-500">March Edition Available</p>
                            <button className="mt-2 text-sm text-blue-500 hover:text-blue-600">
                                View Newsletter
                            </button>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Send New Message
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentDashboard; 