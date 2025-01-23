import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const RoleVerification = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyRole = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (!userDoc.exists()) {
                    // Create user document if it doesn't exist
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        name: user.displayName || '',
                        role: 'admin', // Set default role for testing
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                } else if (!userDoc.data().role) {
                    // Update user document if role is missing
                    await setDoc(doc(db, 'users', user.uid), {
                        ...userDoc.data(),
                        role: 'admin', // Set default role for testing
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                }
            } catch (error) {
                console.error('Error verifying role:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        verifyRole();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return children;
};

export default RoleVerification; 