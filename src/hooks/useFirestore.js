import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';

export const useFirestore = (collectionName, constraints = [], orderByField = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't set up listener if not authenticated
        if (!auth.currentUser) {
            setError('Must be authenticated');
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, collectionName), ...constraints);

            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const documents = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setData(documents);
                    setLoading(false);
                },
                (error) => {
                    console.error('Firestore subscription error:', error);
                    setError(error.message);
                    setLoading(false);
                }
            );

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up Firestore subscription:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [collectionName, JSON.stringify(constraints), auth.currentUser]);

    return { data, loading, error };
}; 