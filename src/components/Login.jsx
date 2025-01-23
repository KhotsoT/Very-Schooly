import { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    applyActionCode,
    checkActionCode,
    sendEmailVerification
} from 'firebase/auth';
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { auth, db, actionCodeSettings, handleEmailVerification } from '../firebase/config';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationInProgress, setVerificationInProgress] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            const oobCode = urlParams.get('oobCode');
            const emailVerification = urlParams.get('emailVerification');

            // Handle email verification
            if ((mode === 'verifyEmail' || emailVerification === 'true') && oobCode) {
                setVerificationInProgress(true);
                setLoading(true);

                try {
                    // Apply the verification code
                    await applyActionCode(auth, oobCode);

                    // Get the current user
                    const user = auth.currentUser;
                    if (!user) {
                        throw new Error('No user found');
                    }

                    // Update Firestore document
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        await updateDoc(doc(db, 'users', user.uid), {
                            emailVerified: true,
                            status: 'active',
                            updatedAt: new Date().toISOString()
                        });

                        // Show success message
                        alert('Email verified successfully! You can now log in.');
                    }

                    // Navigate to login page
                    navigate('/login', { replace: true });
                } catch (error) {
                    console.error('Verification error:', error);
                    setError('Email verification failed. Please try again or request a new verification link.');
                } finally {
                    setLoading(false);
                    setVerificationInProgress(false);
                }
            }
        };

        verifyEmail();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                // Send another verification email if needed
                await handleEmailVerification(userCredential.user);

                setError('Please verify your email before logging in. A new verification email has been sent.');
                await auth.signOut();
                return;
            }

            // Get user data
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!userDoc.exists()) {
                throw new Error('User data not found');
            }

            const userData = userDoc.data();

            // Update user status if needed
            if (userData.status === 'pending' && userCredential.user.emailVerified) {
                await updateDoc(doc(db, 'users', userCredential.user.uid), {
                    status: 'active',
                    emailVerified: true,
                    updatedAt: new Date().toISOString()
                });
            }

            // Navigate to appropriate dashboard
            navigate(`/${userData.userType}-dashboard`);

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            await auth.signOut();
        } finally {
            setLoading(false);
        }
    };

    // Add resend verification email handler
    const handleResendVerification = async () => {
        if (!formData.email || !formData.password) {
            setError('Please enter your email and password');
            return;
        }

        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await sendEmailVerification(userCredential.user, actionCodeSettings);
            alert('Verification email has been resent. Please check your inbox.');
            await auth.signOut();
        } catch (error) {
            console.error('Error resending verification:', error);
            setError('Failed to resend verification email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (verificationInProgress || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Verifying your email...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            {error && (
                <div className="mb-4">
                    <p className="text-red-500">{error}</p>
                    {error.includes('verify your email') && (
                        <button
                            onClick={handleResendVerification}
                            className="text-blue-500 hover:text-blue-600 text-sm mt-2"
                        >
                            Resend verification email
                        </button>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login; 