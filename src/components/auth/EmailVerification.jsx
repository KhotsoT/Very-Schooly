import { useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const EmailVerification = () => {
    useEffect(() => {
        const verifyEmail = async () => {
            const user = auth.currentUser;
            if (user) {
                // Update user record to set status to active and emailVerified to true
                await updateDoc(doc(db, 'users', user.uid), {
                    status: 'active',
                    emailVerified: true,
                    updatedAt: new Date(),
                });
            }
        };

        verifyEmail();
    }, []);

    return <div>Email verified successfully!</div>;
};

export default EmailVerification; 