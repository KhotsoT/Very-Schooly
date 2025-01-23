import { useState, useEffect } from 'react';

const ProfileDetails = ({ user, editing, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        bio: '',
        studentId: '',
        grade: '',
        parentName: '',
        parentPhone: '',
        department: '',
        subjects: '',
        qualification: '',
        experience: '',
        specialization: '',
        officeHours: ''
    });

    useEffect(() => {
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            dateOfBirth: user.dateOfBirth || '',
            bio: user.bio || '',
            studentId: user.studentId || '',
            grade: user.grade || '',
            parentName: user.parentName || '',
            parentPhone: user.parentPhone || '',
            department: user.department || '',
            subjects: user.subjects || '',
            qualification: user.qualification || '',
            experience: user.experience || '',
            specialization: user.specialization || '',
            officeHours: user.officeHours || ''
        });
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderRoleSpecificFields = () => {
        switch (user.role) {
            case 'student':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <input
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Grade/Class</label>
                            <input
                                type="text"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parent's Name</label>
                            <input
                                type="text"
                                value={formData.parentName}
                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parent's Phone</label>
                            <input
                                type="tel"
                                value={formData.parentPhone}
                                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                    </>
                );
            case 'teacher':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subjects</label>
                            <input
                                type="text"
                                value={formData.subjects}
                                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                                placeholder="e.g., Mathematics, Physics"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Qualification</label>
                            <input
                                type="text"
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                            <input
                                type="number"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Office Hours</label>
                            <input
                                type="text"
                                value={formData.officeHours}
                                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                                placeholder="e.g., Mon-Fri 2-4 PM"
                            />
                        </div>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specialization</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!editing}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!editing) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{user.address || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{user.dateOfBirth || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="font-medium">{user.bio || 'No bio provided'}</p>
                    </div>
                    {user.role === 'student' && (
                        <>
                            <div>
                                <p className="text-sm text-gray-500">Student ID</p>
                                <p className="font-medium">{user.studentId || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Grade/Class</p>
                                <p className="font-medium">{user.grade || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Parent's Name</p>
                                <p className="font-medium">{user.parentName || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Parent's Phone</p>
                                <p className="font-medium">{user.parentPhone || 'Not provided'}</p>
                            </div>
                        </>
                    )}
                    {user.role === 'teacher' && (
                        <>
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{user.department || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Subjects</p>
                                <p className="font-medium">{user.subjects || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Qualification</p>
                                <p className="font-medium">{user.qualification || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-medium">{user.experience ? `${user.experience} years` : 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Office Hours</p>
                                <p className="font-medium">{user.officeHours || 'Not provided'}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                {renderRoleSpecificFields()}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ProfileDetails; 