import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProfileActivity = ({ userId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesQuery = query(
                    collection(db, 'activities'),
                    where('userId', '==', userId),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );

                const snapshot = await getDocs(activitiesQuery);
                const activitiesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [userId]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
                <div className="space-y-4">
                    {activities.map(activity => (
                        <div key={activity.id} className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{activity.type}</p>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileActivity; 