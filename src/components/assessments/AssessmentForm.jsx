import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AssessmentForm = ({ onClose, classId, className }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'test',
        subject: '',
        totalMarks: '',
        dueDate: '',
        description: '',
        gradingCriteria: ''
    });
    const [loading, setLoading] = useState(false);

    const assessmentTypes = [
        { id: 'test', name: 'Test' },
        { id: 'assignment', name: 'Assignment' },
        { id: 'project', name: 'Project' },
        { id: 'exam', name: 'Examination' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const assessmentId = `${classId}-${Date.now()}`;
            await setDoc(doc(db, 'assessments', assessmentId), {
                ...formData,
                classId,
                className,
                status: 'active',
                createdAt: serverTimestamp(),
                submissions: 0,
                averageScore: 0
            });

            onClose();
        } catch (error) {
            console.error('Error creating assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Title
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assessment Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        {assessmentTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Marks
                    </label>
                    <input
                        type="number"
                        name="totalMarks"
                        value={formData.totalMarks}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grading Criteria
                </label>
                <textarea
                    name="gradingCriteria"
                    value={formData.gradingCriteria}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Enter grading criteria or rubric details..."
                    required
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
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Assessment'}
                </button>
            </div>
        </form>
    );
};

export default AssessmentForm; 