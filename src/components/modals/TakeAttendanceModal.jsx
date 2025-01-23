import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const TakeAttendanceModal = ({ isOpen, onClose, classId, className }) => {
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', present: true },
        { id: 2, name: 'Jane Smith', present: true },
        // Add more students as needed
    ]);
    const [loading, setLoading] = useState(false);

    const handleAttendanceChange = (studentId) => {
        setStudents(students.map(student =>
            student.id === studentId ? { ...student, present: !student.present } : student
        ));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const attendanceRef = doc(db, 'attendance', `${classId}-${new Date().toISOString().split('T')[0]}`);
            await setDoc(attendanceRef, {
                classId,
                className,
                date: serverTimestamp(),
                students: students.map(({ id, name, present }) => ({ studentId: id, name, present }))
            });
            onClose();
        } catch (error) {
            console.error('Error saving attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Take Attendance - {className}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                    <div className="space-y-4">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span>{student.name}</span>
                                <button
                                    onClick={() => handleAttendanceChange(student.id)}
                                    className={`px-4 py-2 rounded ${student.present
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {student.present ? 'Present' : 'Absent'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeAttendanceModal; 