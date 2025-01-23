import { useState } from 'react';
import DashboardLayout from '../modals/layouts/DashboardLayout';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import AuditLogs from './AuditLogs';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'User Management' },
        { id: 'settings', label: 'System Settings' },
        { id: 'logs', label: 'Audit Logs' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'settings':
                return <SystemSettings />;
            case 'logs':
                return <AuditLogs />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6">
                    {renderContent()}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard; 