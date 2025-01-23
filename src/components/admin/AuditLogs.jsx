import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const logsQuery = query(
                    collection(db, 'audit_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(100)
                );
                const snapshot = await getDocs(logsQuery);
                const logsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLogs(logsData);
            } catch (error) {
                console.error('Error fetching audit logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Audit Logs</h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {logs.map(log => (
                            <li key={log.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium text-gray-900">
                                            {log.action}
                                        </p>
                                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {log.userRole}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {log.details}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        By: {log.userName} ({log.userId})
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AuditLogs; 