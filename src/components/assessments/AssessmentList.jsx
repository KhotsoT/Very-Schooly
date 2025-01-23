import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import GradeAssessment from './GradeAssessment';

const AssessmentList = ({ classId }) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, past
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    const fetchAssessments = async () => {
        setLoading(true);
        try {
            let q = query(
                collection(db, 'assessments'),
                where('classId', '==', classId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const assessmentData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dueDate: doc.data().dueDate.toDate()
            }));

            // Filter assessments based on due date
            const now = new Date();
            const filtered = filter === 'all'
                ? assessmentData
                : filter === 'active'
                    ? assessmentData.filter(a => new Date(a.dueDate) >= now)
                    : assessmentData.filter(a => new Date(a.dueDate) < now);

            setAssessments(filtered);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) {
            fetchAssessments();
        }
    }, [classId, filter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Assessments</h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="all">All Assessments</option>
                    <option value="active">Active</option>
                    <option value="past">Past</option>
                </select>
            </div>

            {assessments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No assessments found
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {assessments.map(assessment => (
                        <div
                            key={assessment.id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{assessment.title}</h4>
                                <span className={`px-2 py-1 text-xs rounded ${new Date(assessment.dueDate) >= new Date()
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {new Date(assessment.dueDate) >= new Date() ? 'Active' : 'Past'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assessment.type}</p>
                            <div className="space-y-1 text-sm">
                                <p>Total Marks: {assessment.totalMarks}</p>
                                <p>Due Date: {assessment.dueDate.toLocaleDateString()}</p>
                                <p>Submissions: {assessment.submissions}</p>
                                {assessment.averageScore > 0 && (
                                    <p>Average Score: {assessment.averageScore.toFixed(1)}%</p>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => {/* Add view details handler */ }}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => setSelectedAssessment(assessment.id)}
                                    className="text-green-600 hover:text-green-800 text-sm"
                                >
                                    Grade
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAssessment && (
                <GradeAssessment
                    assessmentId={selectedAssessment}
                    onClose={() => {
                        setSelectedAssessment(null);
                        fetchAssessments();
                    }}
                />
            )}
        </div>
    );
};

export default AssessmentList; 