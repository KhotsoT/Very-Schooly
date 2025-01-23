import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const EnrollmentStatus = ({ enrollment, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await updateDoc(doc(db, 'enrollments', enrollment.id), {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating enrollment status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(enrollment.status)}`}>
                {enrollment.status}
            </span>
            <select
                value={enrollment.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm border rounded p-1"
                disabled={loading}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
            </select>
        </div>
    );
};

export default EnrollmentStatus; 