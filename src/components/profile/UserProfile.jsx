import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import ProfileActivity from './ProfileActivity';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUser({ id: userDoc.id, ...userDoc.data() });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleUpdateProfile = async (updatedData) => {
        try {
            await updateDoc(doc(db, 'users', userId), updatedData);
            setUser(prev => ({ ...prev, ...updatedData }));
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="text-center text-gray-500 py-8">
                    User not found
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <ProfileHeader
                    user={user}
                    onEdit={() => setEditing(true)}
                />

                <ProfileDetails
                    user={user}
                    editing={editing}
                    onSave={handleUpdateProfile}
                    onCancel={() => setEditing(false)}
                />

                <ProfileActivity userId={userId} />
            </div>
        </DashboardLayout>
    );
};

export default UserProfile; 