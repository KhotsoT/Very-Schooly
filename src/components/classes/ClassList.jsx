import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AddClassModal from '../modals/AddClassModal';
import ClassCard from './ClassCard';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, active, archived

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const classesQuery = query(collection(db, 'classes'));
            const snapshot = await getDocs(classesQuery);
            const classesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter classes based on status
            const filteredClasses = filter === 'all'
                ? classesData
                : classesData.filter(c => c.status === filter);

            setClasses(filteredClasses);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [filter]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Classes</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="all">All Classes</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add New Class
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(classItem => (
                        <ClassCard
                            key={classItem.id}
                            classData={classItem}
                            onUpdate={fetchClasses}
                        />
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddClassModal
                    onClose={() => setShowAddModal(false)}
                    onClassAdded={fetchClasses}
                />
            )}
        </div>
    );
};

export default ClassList; 