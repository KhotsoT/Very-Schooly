import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProfileHeader = ({ user, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl">{user.name?.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">{user.role}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader; 