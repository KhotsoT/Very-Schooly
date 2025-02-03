// import DashboardLayout from './modals/layouts/DashboardLayout';
import DashboardLayout from './layouts/DashboardLayout';

const LearnerDashboard = () => {
    return (
        <DashboardLayout userType="learner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <h1 className="text-2xl font-bold col-span-full">Learner Dashboard</h1>
                {/* Overview Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Current Courses</span>
                            <span className="font-medium">6</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Assignments Due</span>
                            <span className="font-medium text-red-500">4</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Average Grade</span>
                            <span className="font-medium text-green-500">85%</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Assignments */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-medium">Math Quiz</p>
                            <p className="text-sm text-gray-500">Due: Tomorrow</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">Science Project</p>
                            <p className="text-sm text-gray-500">Due: Next Week</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-medium">Grade Posted</p>
                            <p className="text-sm text-gray-500">English Essay: 92%</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium">New Assignment</p>
                            <p className="text-sm text-gray-500">History Report Added</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LearnerDashboard; 