// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Very Schooly
                </Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to={`/${user.userType}-dashboard`} className="hover:text-blue-200">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="hover:text-blue-200">
                                Sign Up
                            </Link>
                            <Link to="/login" className="hover:text-blue-200">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
