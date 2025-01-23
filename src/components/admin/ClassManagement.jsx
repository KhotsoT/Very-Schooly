import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import AddClassModal from './modals/AddClassModal';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const classesQuery = query(collection(db, 'classes'));
            const snapshot = await getDocs(classesQuery);
            const classData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClasses(classData);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (newClass) => {
        try {
            const docRef = await addDoc(collection(db, 'classes'), newClass);
            setClasses([...classes, { id: docRef.id, ...newClass }]);
            setShowAddClassModal(false);
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const handleUpdateClass = async (updatedClass) => {
        try {
            await updateDoc(doc(db, 'classes', updatedClass.id), updatedClass);
            setClasses(classes.map(cls => (cls.id === updatedClass.id ? updatedClass : cls)));
            setEditingClass(null);
        } catch (error) {
            console.error('Error updating class:', error);
        }
    };

    const handleDeleteClass = async (classId) => {
        if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'classes', classId));
            setClasses(classes.filter(cls => cls.id !== classId));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout userType="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Class Management</h1>
                    <button
                        onClick={() => setShowAddClassModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add New Class
                    </button>
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search classes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teacher
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Students
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredClasses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No classes found
                                    </td>
                                </tr>
                            ) : (
                                filteredClasses.map(cls => (
                                    <tr key={cls.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cls.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cls.teacherName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cls.studentCount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cls.schedule}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => setEditingClass(cls)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(cls.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddClassModal && (
                <AddClassModal
                    onClose={() => setShowAddClassModal(false)}
                    onClassAdded={handleAddClass}
                />
            )}

            {editingClass && (
                <AddClassModal
                    onClose={() => setEditingClass(null)}
                    onClassUpdated={handleUpdateClass}
                    initialData={editingClass}
                />
            )}
        </DashboardLayout>
    );
};

export default ClassManagement; 