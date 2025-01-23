import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const SystemSettings = () => {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        schoolName: 'My School',
        academicYear: '2023-2024',
        termsPerYear: 3,
        gradesEnabled: true,
        attendanceEnabled: true,
        maxStudentsPerClass: 30
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'settings', 'system'), settings);
            // Show success message
        } catch (error) {
            console.error('Error saving settings:', error);
            // Show error message
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            School Name
                        </label>
                        <input
                            type="text"
                            value={settings.schoolName}
                            onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Academic Year
                        </label>
                        <input
                            type="text"
                            value={settings.academicYear}
                            onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Terms Per Year
                        </label>
                        <input
                            type="number"
                            value={settings.termsPerYear}
                            onChange={(e) => setSettings({ ...settings, termsPerYear: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Max Students Per Class
                        </label>
                        <input
                            type="number"
                            value={settings.maxStudentsPerClass}
                            onChange={(e) => setSettings({ ...settings, maxStudentsPerClass: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.gradesEnabled}
                            onChange={(e) => setSettings({ ...settings, gradesEnabled: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Enable Grades
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.attendanceEnabled}
                            onChange={(e) => setSettings({ ...settings, attendanceEnabled: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Enable Attendance
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings; 