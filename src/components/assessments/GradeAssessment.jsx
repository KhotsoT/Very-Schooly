import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import GradeAnalytics from './GradeAnalytics';

const GradeAssessment = ({ assessmentId, onClose }) => {
    const [assessment, setAssessment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('all'); // all, graded, ungraded
    const [showAnalytics, setShowAnalytics] = useState(false);

    const fetchAssessmentDetails = async () => {
        setLoading(true);
        try {
            // Fetch assessment details
            const submissionsQuery = query(
                collection(db, 'submissions'),
                where('assessmentId', '==', assessmentId)
            );
            const submissionsSnapshot = await getDocs(submissionsQuery);
            const submissionsData = submissionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter submissions based on grading status
            const filteredSubmissions = filter === 'all'
                ? submissionsData
                : filter === 'graded'
                    ? submissionsData.filter(s => s.grade !== undefined)
                    : submissionsData.filter(s => s.grade === undefined);

            setSubmissions(filteredSubmissions);
        } catch (error) {
            console.error('Error fetching assessment details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (submissionId, value) => {
        setSubmissions(prev =>
            prev.map(sub =>
                sub.id === submissionId
                    ? { ...sub, grade: Math.min(Math.max(0, Number(value)), assessment.totalMarks) }
                    : sub
            )
        );
    };

    const handleFeedbackChange = (submissionId, value) => {
        setSubmissions(prev =>
            prev.map(sub =>
                sub.id === submissionId
                    ? { ...sub, feedback: value }
                    : sub
            )
        );
    };

    const handleSaveGrades = async () => {
        setSaving(true);
        try {
            const batch = writeBatch(db);

            // Update each submission
            submissions.forEach(submission => {
                if (submission.grade !== undefined) {
                    const submissionRef = doc(db, 'submissions', submission.id);
                    batch.update(submissionRef, {
                        grade: submission.grade,
                        feedback: submission.feedback || '',
                        gradedAt: new Date().toISOString()
                    });
                }
            });

            // Calculate and update assessment average
            const gradedSubmissions = submissions.filter(s => s.grade !== undefined);
            const averageScore = gradedSubmissions.reduce((acc, curr) => acc + curr.grade, 0) / gradedSubmissions.length;

            const assessmentRef = doc(db, 'assessments', assessmentId);
            batch.update(assessmentRef, {
                averageScore,
                gradedSubmissions: gradedSubmissions.length
            });

            await batch.commit();
            onClose();
        } catch (error) {
            console.error('Error saving grades:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchAssessmentDetails();
    }, [assessmentId, filter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Grade Submissions</h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {showAnalytics ? 'View Submissions' : 'View Analytics'}
                            </button>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="p-2 border rounded"
                            >
                                <option value="all">All Submissions</option>
                                <option value="graded">Graded</option>
                                <option value="ungraded">Ungraded</option>
                            </select>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                    </div>

                    {showAnalytics ? (
                        <GradeAnalytics assessmentId={assessmentId} />
                    ) : (
                        <div className="space-y-6">
                            {submissions.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No submissions found
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.map(submission => (
                                        <div
                                            key={submission.id}
                                            className="bg-gray-50 p-4 rounded-lg"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-medium">{submission.studentName}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        value={submission.grade || ''}
                                                        onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                                                        className="w-20 p-2 border rounded"
                                                        placeholder="Grade"
                                                        min="0"
                                                        max={assessment?.totalMarks}
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        / {assessment?.totalMarks}
                                                    </span>
                                                </div>
                                            </div>

                                            {submission.attachments?.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-sm font-medium mb-2">Attachments:</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {submission.attachments.map((attachment, index) => (
                                                            <a
                                                                key={index}
                                                                href={attachment.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                {attachment.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <textarea
                                                    value={submission.feedback || ''}
                                                    onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                                                    className="w-full p-2 border rounded"
                                                    rows="2"
                                                    placeholder="Add feedback..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveGrades}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Grades'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeAssessment; 