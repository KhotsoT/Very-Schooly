import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, where, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
// import DashboardLayout from '../modals/layouts/DashboardLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AddUserModal from './modals/AddUserModal';
import { useAuthState } from 'react-firebase-hooks/auth';

const UserManagement = () => {
    const [user] = useAuthState(auth); // Get the current user
    const [userType, setUserType] = useState(null); // State to hold user type
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    const roles = ['all', 'learner', 'educator', 'parent', 'admin', 'principal'];
    const statusOptions = ['pending', 'active', 'inactive', 'suspended'];
    const userTypes = ['parent', 'educator', 'admin', 'learner', 'principal'];

    useEffect(() => {
        const fetchUserType = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserType(userDoc.data().userType); // Set user type from Firestore
                } else {
                    console.error('User document does not exist');
                }
            }
        };

        fetchUserType();
    }, [user]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersQuery = query(collection(db, 'users'));
                const snapshot = await getDocs(usersQuery);
                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        try {
            await addDoc(collection(db, 'users'), newUser);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error adding user:', error);
            setError('Failed to add user');
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            await updateDoc(doc(db, 'users', updatedUser.id), updatedUser);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowAddUserModal(true);
    };

    console.log('Logged In TYPE is ... ---> ', userType);

    return (
        <DashboardLayout userType={userType}>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-between">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded p-2"
                    />
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Add User
                    </button>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-200 p-2">Name</th>
                                <th className="border border-gray-200 p-2">Email</th>
                                <th className="border border-gray-200 p-2">Role</th>
                                <th className="border border-gray-200 p-2">Status</th>
                                <th className="border border-gray-200 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(user =>
                                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(user => (
                                <tr key={user.id}>
                                    <td className="border border-gray-200 p-2">{user.name}</td>
                                    <td className="border border-gray-200 p-2">{user.email}</td>
                                    <td className="border border-gray-200 p-2">{user.userType}</td>
                                    <td className="border border-gray-200 p-2">{user.status}</td>
                                    <td className="border border-gray-200 p-2">
                                        <button onClick={() => handleEditUser(user)}>Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showAddUserModal && (
                    <AddUserModal
                        onClose={() => setShowAddUserModal(false)}
                        onUserAdded={handleAddUser}
                        initialData={editingUser}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement; 