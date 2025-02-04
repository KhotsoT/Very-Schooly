import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import DashboardLayout from '../layouts/DashboardLayout';

const SystemSettings = () => {
    const defaultSettings = {
        schoolName: '',
        academicYear: '',
        termsPerYear: 4,
        emailNotifications: true,
        gradingSystem: 'percentage',
        attendanceThreshold: 75,
        maxClassSize: 30,
        maintenanceMode: false,
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
            if (settingsDoc.exists()) {
                setSettings(settingsDoc.data());
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await setDoc(doc(db, 'settings', 'system'), settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout userType="admin">
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="schoolName">School Name</label>
                        <input
                            type="text"
                            id="schoolName"
                            name="schoolName"
                            value={settings.schoolName}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="academicYear">Academic Year</label>
                        <input
                            type="text"
                            id="academicYear"
                            name="academicYear"
                            value={settings.academicYear}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="termsPerYear">Terms Per Year</label>
                        <input
                            type="number"
                            id="termsPerYear"
                            name="termsPerYear"
                            value={settings.termsPerYear}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            min="1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Enable Email Notifications
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="gradingSystem">Grading System</label>
                        <select
                            id="gradingSystem"
                            name="gradingSystem"
                            value={settings.gradingSystem}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="letter">Letter Grade</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="attendanceThreshold">Attendance Threshold (%)</label>
                        <input
                            type="number"
                            id="attendanceThreshold"
                            name="attendanceThreshold"
                            value={settings.attendanceThreshold}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="maxClassSize">Max Class Size</label>
                        <input
                            type="number"
                            id="maxClassSize"
                            name="maxClassSize"
                            value={settings.maxClassSize}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            min="1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Enable Maintenance Mode
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default SystemSettings;