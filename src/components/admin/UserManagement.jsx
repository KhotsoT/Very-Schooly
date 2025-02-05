import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, where, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, handleEmailVerification } from '../../firebase/config';
import DashboardLayout from '../layouts/DashboardLayout';
import AddUserModal from './modals/AddUserModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import ConfirmationModal from '../modals/ConfirmationModal';
import { parse } from 'papaparse'; // Importing papaparse for CSV parsing
import UserUploadTemplate from './UserUploadTemplate'; // Import the new template component
import * as XLSX from 'xlsx'; // Import xlsx for handling Excel files

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
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userTypeFilter, setUserTypeFilter] = useState('all'); // State for user type filter
    const [bulkUploadFile, setBulkUploadFile] = useState(null); // State for bulk upload file

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
        fetchUsers(); // Fetch users on component mount
    }, []);

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
        setShowConfirmationModal(false);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowAddUserModal(true);
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowAddUserModal(true);
    };

    const handleBulkUpload = async () => {
        if (!bulkUploadFile) {
            setError('Please select a file to upload.');
            return;
        }

        try {
            const data = await bulkUploadFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const parsedData = XLSX.utils.sheet_to_json(worksheet);

            let successCount = 0;
            let errorCount = 0;

            for (const userData of parsedData) {
                try {
                    if (!userData['Email'] || !userData['Name'] || !userData['Surname'] || !userData['User Type']) {
                        console.error('Missing required fields:', userData);
                        errorCount++;
                        continue;
                    }

                    const userType = String(userData['User Type']).toLowerCase();
                    const isLearner = userType === 'learner';
                    const tempPassword = Math.random().toString(36).slice(-8);

                    // Create Authentication User
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        userData['Email'],
                        tempPassword
                    );

                    // Create Firestore Document
                    await setDoc(doc(db, 'users', userCredential.user.uid), {
                        email: userData['Email'],
                        name: userData['Name'],
                        surname: userData['Surname'],
                        idNumber: userData['ID Number'] || '',
                        userType: userType,
                        cellphone: userData['Cellphone'] || '',
                        address: userData['Address'] || '',
                        emailVerified: isLearner,
                        status: isLearner ? 'active' : 'pending',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });

                    // Send verification email if not a learner
                    if (!isLearner) {
                        const redirectUrl = `${window.location.origin}/${userType}-dashboard`;
                        await handleEmailVerification(userCredential.user, tempPassword, redirectUrl);
                    }

                    successCount++;

                } catch (userError) {
                    console.error(`Error processing user ${userData['Email']}:`, userError);
                    errorCount++;
                }
            }

            if (successCount > 0) {
                alert(`Successfully processed ${successCount} users.${errorCount > 0 ? ` Failed to process ${errorCount} users.` : ''}`);
                await fetchUsers();
            } else {
                setError('No users were processed successfully.');
            }
            
            setBulkUploadFile(null);

        } catch (error) {
            console.error('Error uploading users:', error);
            setError('Failed to upload users. Please check the console for details.');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <DashboardLayout userType={userType}>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-between">
                    <UserUploadTemplate /> {/* Add the download button for the template */}
                    <input
                        type="file"
                        accept=".xlsx, .xls" // Accept Excel files
                        onChange={(e) => setBulkUploadFile(e.target.files[0])}
                        className="border rounded p-2"
                    />
                    <button
                        onClick={handleBulkUpload}
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Upload Users
                    </button>
                </div>
                {/* User Type Filter Dropdown */}
                <div className="mb-4">
                    <label className="mr-2">Filter by User Type:</label>
                    <select
                        value={userTypeFilter}
                        onChange={(e) => setUserTypeFilter(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">All</option>
                        <option value="parent">Parent</option>
                        <option value="educator">Educator</option>
                        <option value="learner">Learner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">User Type</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(user)}>
                                        <td className="py-3 px-6">{user.name}</td>
                                        <td className="py-3 px-6">{user.email}</td>
                                        <td className="py-3 px-6">{user.userType}</td>
                                        <td className={`py-3 px-6 font-bold ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                            {user.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showAddUserModal && (
                    <AddUserModal
                        onClose={() => setShowAddUserModal(false)}
                        onUserAdded={handleAddUser}
                        initialData={selectedUser}
                    />
                )}
                {showConfirmationModal && (
                    <ConfirmationModal
                        isOpen={showConfirmationModal}
                        onClose={() => setShowConfirmationModal(false)}
                        onConfirm={() => handleDeleteUser(selectedUser.id)}
                        title="Confirm Action"
                        message={`Are you sure you want to delete ${selectedUser.name}?`}
                        confirmText="Delete User"
                        cancelText="Cancel"
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement; 