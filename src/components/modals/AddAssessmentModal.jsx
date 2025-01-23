import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AddAssessmentModal = ({ isOpen, onClose, classId, className }) => {
    const [assessment, setAssessment] = useState({
        title: '',
        type: 'test',
        totalMarks: '',
        dueDate: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssessment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const assessmentRef = doc(db, 'assessments', `${classId}-${Date.now()}`);
            await setDoc(assessmentRef, {
                ...assessment,
                classId,
                className,
                createdAt: serverTimestamp(),
                status: 'active'
            });
            onClose();
        } catch (error) {
            console.error('Error creating assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Add Assessment - {className}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={assessment.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Type</label>
                            <select
                                name="type"
                                value={assessment.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="test">Test</option>
                                <option value="assignment">Assignment</option>
                                <option value="project">Project</option>
                                <option value="exam">Exam</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Total Marks</label>
                            <input
                                type="number"
                                name="totalMarks"
                                value={assessment.totalMarks}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={assessment.dueDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Description</label>
                            <textarea
                                name="description"
                                value={assessment.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Assessment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAssessmentModal; 