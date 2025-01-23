import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import DashboardLayout from '../layouts/DashboardLayout';

const Settings = () => {
    const defaultSettings = {
        schoolName: '',
        academicYear: '',
        termsPerYear: 4,
        emailNotifications: true,
        gradingSystem: 'percentage',
        attendanceThreshold: 75,
        maxClassSize: 30,
        maintenanceMode: false
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if user is authenticated
                if (!auth.currentUser) {
                    setError('User not authenticated');
                    return;
                }

                // Check if user is admin
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (!userDoc.exists() || userDoc.data().userType !== 'admin') {
                    setError('Admin access required');
                    return;
                }

                // Fetch settings
                const settingsRef = doc(db, 'settings', 'general');
                const settingsDoc = await getDoc(settingsRef);

                if (!settingsDoc.exists()) {
                    // Initialize settings if not found
                    const initialSettings = {
                        ...defaultSettings,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: auth.currentUser.uid
                    };

                    await setDoc(settingsRef, initialSettings);
                    setSettings(initialSettings);
                } else {
                    setSettings(settingsDoc.data());
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                setError('Failed to load settings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSaveSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const settingsRef = doc(db, 'settings', 'general');
            const updatedSettings = {
                ...settings,
                updatedAt: new Date().toISOString()
            };

            await setDoc(settingsRef, updatedSettings);
            setSettings(updatedSettings);
            alert('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            setError('Failed to save settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardLayout userType="admin"><div>Loading...</div></DashboardLayout>;
    if (error) return <DashboardLayout userType="admin"><div>Error: {error}</div></DashboardLayout>;

    return (
        <DashboardLayout userType="admin">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSettings();
                    }}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                School Name
                            </label>
                            <input
                                type="text"
                                value={settings.schoolName}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    schoolName: e.target.value
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                User Type
                            </label>
                            <select
                                name="userType"
                                value={settings.userType}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    userType: e.target.value
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="learner">Learner</option>
                                <option value="educator">Educator</option>
                                <option value="admin">Admin</option>
                                <option value="principal">Principal</option>
                            </select>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings; 