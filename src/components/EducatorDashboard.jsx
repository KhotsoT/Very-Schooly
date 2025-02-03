import { useState, useEffect } from 'react';
// import DashboardLayout from './modals/layouts/DashboardLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { getCurrentTerm, getNextTerm, formatDate } from '../utils/saSchoolCalendar';
import PerformanceChart from './charts/PerformanceChart';
import AttendanceChart from './charts/AttendanceChart';
import GradeDistributionChart from './charts/GradeDistributionChart';
import { useChartData } from '../hooks/useChartData';
import TakeAttendanceModal from './modals/TakeAttendanceModal';
import AddAssessmentModal from './modals/AddAssessmentModal';
import { useNavigate } from 'react-router-dom';

const EducatorDashboard = () => {
    const currentTerm = getCurrentTerm();
    const nextTerm = getNextTerm();
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(null);
    const { performanceData, attendanceData, gradeDistribution, loading } = useChartData(selectedClass);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [classes, setClasses] = useState([
        { id: 'class1', name: 'Grade 10 Mathematics' },
        { id: 'class2', name: 'Grade 11 Physics' },
        { id: 'class3', name: 'Grade 9 Mathematics' }
    ]);

    const handleClassChange = (classId) => {
        setSelectedClass(classId);
    };

    const handleTakeAttendance = () => {
        if (!selectedClass) {
            alert('Please select a class first');
            return;
        }
        setShowAttendanceModal(true);
    };

    const handleAddAssessment = () => {
        if (!selectedClass) {
            alert('Please select a class first');
            return;
        }
        setShowAssessmentModal(true);
    };

    const handleViewReports = () => {
        navigate('/educator-dashboard/reports');
    };

    return (
        <DashboardLayout userType="educator">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Educator Dashboard</h1>
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                                onClick={handleTakeAttendance}
                                disabled={!selectedClass}
                            >
                                Take Attendance
                            </button>
                            <button
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                                onClick={handleAddAssessment}
                                disabled={!selectedClass}
                            >
                                Add Assessment
                            </button>
                            <button
                                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                                onClick={handleViewReports}
                            >
                                View Reports
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

                    {/* Announcements */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Announcements</h3>
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <p className="font-medium">Staff Meeting</p>
                                <p className="text-sm text-gray-500">Friday, 2:00 PM - Teachers' Lounge</p>
                            </div>
                            <div className="border-b pb-2">
                                <p className="font-medium">Professional Development Day</p>
                                <p className="text-sm text-gray-500">Next Monday - No Classes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Selector */}
                <div className="mb-6 w-full">
                    <select
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border rounded-lg shadow-sm"
                        value={selectedClass || ''}
                    >
                        <option value="">Select a class</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Charts Section */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {loading ? (
                        <div className="col-span-1 lg:col-span-2 flex justify-center items-center h-80">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <PerformanceChart
                                    data={performanceData}
                                    title={`Performance Trends - ${selectedClass ? classes.find(c => c.id === selectedClass)?.name : 'All Classes'}`}
                                />
                            </div>
                            <div className="w-full overflow-x-auto">
                                <AttendanceChart
                                    data={attendanceData}
                                    title={`Weekly Attendance - ${selectedClass ? classes.find(c => c.id === selectedClass)?.name : 'All Classes'}`}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-6">
                    {!loading && (
                        <GradeDistributionChart
                            data={gradeDistribution}
                            title={`Grade Distribution - ${selectedClass ? classes.find(c => c.id === selectedClass)?.name : 'All Classes'}`}
                        />
                    )}
                </div>

                {/* Modals */}
                <TakeAttendanceModal
                    isOpen={showAttendanceModal}
                    onClose={() => setShowAttendanceModal(false)}
                    classId={selectedClass}
                    className={classes.find(c => c.id === selectedClass)?.name}
                />
                <AddAssessmentModal
                    isOpen={showAssessmentModal}
                    onClose={() => setShowAssessmentModal(false)}
                    classId={selectedClass}
                    className={classes.find(c => c.id === selectedClass)?.name}
                />
            </div>
        </DashboardLayout>
    );
};

export default EducatorDashboard; 