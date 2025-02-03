import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
// import DashboardLayout from '../modals/layouts/DashboardLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { Tab } from '@headlessui/react';
import EnrollmentModal from './EnrollmentModal';
import EnrollmentStatus from './EnrollmentStatus';
import ConfirmationModal from '../modals/ConfirmationModal';

const ClassDetails = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [removing, setRemoving] = useState(false);

    const fetchClassDetails = async () => {
        setLoading(true);
        try {
            // Fetch class data
            const classDoc = await getDoc(doc(db, 'classes', classId));
            if (classDoc.exists()) {
                setClassData({ id: classDoc.id, ...classDoc.data() });

                // Fetch enrolled students
                const studentsQuery = query(
                    collection(db, 'enrollments'),
                    where('classId', '==', classId)
                );
                const studentsSnapshot = await getDocs(studentsQuery);
                const studentsData = studentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStudents(studentsData);

                // Fetch assessments
                const assessmentsQuery = query(
                    collection(db, 'assessments'),
                    where('classId', '==', classId)
                );
                const assessmentsSnapshot = await getDocs(assessmentsQuery);
                const assessmentsData = assessmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAssessments(assessmentsData);

                // Fetch attendance records
                const attendanceQuery = query(
                    collection(db, 'attendance'),
                    where('classId', '==', classId)
                );
                const attendanceSnapshot = await getDocs(attendanceQuery);
                const attendanceData = attendanceSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAttendance(attendanceData);
            }
        } catch (error) {
            console.error('Error fetching class details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStudent = async () => {
        if (!studentToRemove) return;

        setRemoving(true);
        try {
            // Delete enrollment record
            await deleteDoc(doc(db, 'enrollments', studentToRemove.id));

            // Update class student count
            await updateDoc(doc(db, 'classes', classId), {
                studentCount: (classData.studentCount || 0) - 1
            });

            // Refresh class details
            await fetchClassDetails();
        } catch (error) {
            console.error('Error removing student:', error);
        } finally {
            setRemoving(false);
            setStudentToRemove(null);
        }
    };

    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!classData) {
        return (
            <DashboardLayout>
                <div className="text-center text-gray-500 py-8">
                    Class not found
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Class Header */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{classData.name}</h1>
                            <p className="text-gray-600">{classData.subject}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${classData.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {classData.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-gray-500">Teacher</p>
                            <p className="font-medium">{classData.teacherName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Schedule</p>
                            <p className="font-medium">{classData.schedule}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Room</p>
                            <p className="font-medium">{classData.room}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => setShowEnrollModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Enroll Students
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }`
                            }
                        >
                            Students ({students.length})
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }`
                            }
                        >
                            Assessments ({assessments.length})
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }`
                            }
                        >
                            Attendance
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel className="bg-white rounded-xl p-3">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Enrolled Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map(student => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.studentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <EnrollmentStatus
                                                        enrollment={student}
                                                        onUpdate={fetchClassDetails}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(student.enrolledAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-4">
                                                        <button
                                                            onClick={() => {/* Add view progress handler */ }}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            View Progress
                                                        </button>
                                                        <button
                                                            onClick={() => setStudentToRemove(student)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tab.Panel>

                        <Tab.Panel className="bg-white rounded-xl p-3">
                            <div className="space-y-4">
                                {assessments.map(assessment => (
                                    <div
                                        key={assessment.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{assessment.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {assessment.type}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm">
                                                Submissions: {assessment.submissions || 0}
                                            </p>
                                            {assessment.averageScore && (
                                                <p className="text-sm">
                                                    Average Score: {assessment.averageScore.toFixed(1)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>

                        <Tab.Panel className="bg-white rounded-xl p-3">
                            <div className="space-y-4">
                                {attendance.map(record => (
                                    <div
                                        key={record.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Present: {record.presentCount} / {students.length}
                                                </p>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                {showEnrollModal && (
                    <EnrollmentModal
                        classId={classId}
                        className={classData.name}
                        onClose={() => setShowEnrollModal(false)}
                        onEnrollmentComplete={fetchClassDetails}
                    />
                )}

                <ConfirmationModal
                    isOpen={!!studentToRemove}
                    onClose={() => setStudentToRemove(null)}
                    onConfirm={handleRemoveStudent}
                    title="Remove Student"
                    message={`Are you sure you want to remove ${studentToRemove?.studentName} from this class? This action cannot be undone.`}
                    confirmText={removing ? 'Removing...' : 'Remove'}
                    cancelText="Cancel"
                    isDestructive={true}
                />
            </div>
        </DashboardLayout>
    );
};

export default ClassDetails; 