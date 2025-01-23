import { useState, useEffect } from 'react';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const AddUserModal = ({ onClose, onUserAdded, initialData, onDelete, userTypes }) => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        userType: 'parent',
        cellphone: '',
        address: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setNewUser(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (initialData) {
                // Update existing user
                await updateDoc(doc(db, 'users', initialData.id), newUser);
                onUserAdded(newUser); // Pass the updated user back to the parent
            } else {
                // Add new user
                const docRef = await addDoc(collection(db, 'users'), newUser);
                onUserAdded({ id: docRef.id, ...newUser }); // Pass the new user back to the parent
            }
            setNewUser({ name: '', email: '', userType: 'parent', cellphone: '', address: '' }); // Reset form
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error adding/updating user:', err);
            setError(`Failed to add/update user: ${err.message}`); // Provide more detailed error
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {initialData ? 'Edit User' : 'Add New User'}
                </h2>
                {error && <div className="text-red-500">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="border rounded p-2 mb-2 w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="border rounded p-2 mb-2 w-full"
                        readOnly={!!initialData} // Prevent editing if it's an existing user
                        required
                    />
                    <input
                        type="text"
                        placeholder="Cellphone Number"
                        value={newUser.cellphone}
                        onChange={(e) => setNewUser({ ...newUser, cellphone: e.target.value })}
                        className="border rounded p-2 mb-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Home Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        className="border rounded p-2 mb-2 w-full"
                        required
                    />
                    <select
                        value={newUser.userType}
                        onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                        className="border rounded p-2 mb-2 w-full"
                    >
                        {userTypes.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            {initialData ? 'Update User' : 'Add User'}
                        </button>
                        {initialData && (
                            <button
                                onClick={() => {
                                    onDelete(initialData.id); // Call the delete function
                                    onClose(); // Close the modal
                                }}
                                className="bg-red-500 text-white rounded p-2"
                            >
                                Delete User
                            </button>
                        )}
                    </div>
                </form>
                <button onClick={onClose} className="mt-4 text-gray-500">Cancel</button>
            </div>
        </div>
    );
};

export default AddUserModal; 