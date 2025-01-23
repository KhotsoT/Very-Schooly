import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db, verifyUserRole } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const PrivateRoute = ({ children, userType }) => {
    const [user, loading, authError] = useAuthState(auth);
    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!user) {
                setChecking(false);
                return;
            }

            if (!user.emailVerified) {
                navigate('/login');
                return;
            }

            const hasRole = await verifyUserRole(user.uid, userType);
            if (!hasRole) {
                navigate('/login');
                return;
            }

            setVerified(true);
            setChecking(false);
        };

        checkAuthorization();
    }, [user, userType, navigate]);

    if (checking || loading) {
        return <div>Loading...</div>;
    }

    if (!user || !verified) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute; 