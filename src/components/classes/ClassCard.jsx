import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classData, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await updateDoc(doc(db, 'classes', classData.id), {
                status: newStatus
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating class status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">{classData.name}</h3>
                        <p className="text-sm text-gray-600">{classData.subject}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${classData.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {classData.status}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-sm">
                        <span className="font-medium">Teacher:</span> {classData.teacherName}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Students:</span> {classData.studentCount || 0}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Schedule:</span> {classData.schedule}
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(`/classes/${classData.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View Details
                    </button>
                    <div className="space-x-2">
                        {classData.status === 'active' ? (
                            <button
                                onClick={() => handleStatusChange('archived')}
                                className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                                disabled={loading}
                            >
                                Archive
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStatusChange('active')}
                                className="px-3 py-1 text-sm border border-green-500 text-green-500 rounded hover:bg-green-50"
                                disabled={loading}
                            >
                                Activate
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCard; 