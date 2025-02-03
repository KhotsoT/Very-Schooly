import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
// import DashboardLayout from '../modals/layouts/DashboardLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AddStaffModal from '../modals/AddStaffModal';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const departments = [
        { id: 'all', name: 'All Departments' },
        { id: 'mathematics', name: 'Mathematics' },
        { id: 'science', name: 'Science' },
        { id: 'languages', name: 'Languages' },
        { id: 'humanities', name: 'Humanities' },
        { id: 'arts', name: 'Arts' }
    ];

    const fetchStaff = async () => {
        setLoading(true);
        try {
            let staffQuery = collection(db, 'users');

            if (selectedDepartment !== 'all') {
                staffQuery = query(
                    staffQuery,
                    where('userType', '==', 'teacher'),
                    where('department', '==', selectedDepartment)
                );
            } else {
                staffQuery = query(
                    staffQuery,
                    where('userType', '==', 'teacher')
                );
            }

            const snapshot = await getDocs(staffQuery);
            const staffData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStaff(staffData);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [selectedDepartment]);

    const handleStatusChange = async (staffId, newStatus) => {
        try {
            await updateDoc(doc(db, 'users', staffId), {
                status: newStatus
            });
            fetchStaff(); // Refresh the list
        } catch (error) {
            console.error('Error updating staff status:', error);
        }
    };

    const handleDelete = async (staffId) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            try {
                await deleteDoc(doc(db, 'users', staffId));
                fetchStaff(); // Refresh the list
            } catch (error) {
                console.error('Error deleting staff member:', error);
            }
        }
    };

    const filteredStaff = staff.filter(member =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout userType="principal">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold">Staff Management</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add New Staff
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Staff
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, or department..."
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStaff.map(member => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={member.status || 'active'}
                                                    onChange={(e) => handleStatusChange(member.id, e.target.value)}
                                                    className="p-1 border rounded text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="on_leave">On Leave</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => navigate(`/principal-dashboard/staff/performance/${member.id}`)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    View Performance
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <AddStaffModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onStaffAdded={fetchStaff}
                departments={departments.filter(d => d.id !== 'all')}
            />
        </DashboardLayout>
    );
};

export default StaffManagement; 