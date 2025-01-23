import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // First, wait for auth state
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!user) {
                setLoading(false);
            }
        });

        return () => unsubAuth();
    }, []);

    // Then, set up notifications listener only when authenticated
    useEffect(() => {
        if (!user) return;

        console.log('Setting up notifications listener for user:', user.uid);

        const unsubscribe = onSnapshot(
            collection(db, 'notifications'),
            (snapshot) => {
                console.log('Received notifications:', snapshot.size);
                const notifs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNotifications(notifs);
                setLoading(false);
            },
            (error) => {
                console.error('Notifications error:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    return { notifications, loading, error };
}; 