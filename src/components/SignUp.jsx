import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { handleEmailVerification } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        idNumber: '',
        userType: 'student',
        cellphone: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Create user record in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: formData.email,
                name: formData.name,
                surname: formData.surname,
                idNumber: formData.idNumber,
                userType: formData.userType,
                cellphone: formData.cellphone,
                address: formData.address,
                emailVerified: false, // Initially set to false
                status: 'pending', // Set status to pending
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Send email verification if userType is not 'learner'
            if (formData.userType !== 'learner') {
                const verificationSent = await handleEmailVerification(user);
                if (verificationSent) {
                    window.alert('Signup successful! Please check your email for verification.');
                } else {
                    setError('Failed to send verification email.');
                }
            } else {
                // If userType is 'learner', set status to active
                await setDoc(doc(db, 'users', user.uid), {
                    status: 'active',
                    emailVerified: true,
                    updatedAt: new Date().toISOString(),
                });
                window.alert('Signup successful! Learner accounts are activated automatically.');
            }

            // Redirect to homepage
            navigate('/');
            // Optionally sign out the user after signup
            await signOut(auth);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded mb-4 whitespace-pre-line">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Surname:</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">ID Number:</label>
                    <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        maxLength="13"
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">User Type:</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    >
                        <option value="teacher">Educator</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Admin</option>
                        <option value="principal">Principal</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Cellphone:</label>
                    <input
                        type="text"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default SignUp; 