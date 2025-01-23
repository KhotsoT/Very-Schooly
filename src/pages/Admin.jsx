// src/pages/Admin.jsx
import '../styles/admin.css';

function Admin() {
    return (
        <div className="admin">
            <h1>Admin</h1>
            <div className="admin-tools">
                <div className="tool-card">Manage Users</div>
                <div className="tool-card">System Settings</div>
                <div className="tool-card">Audit Logs</div>
            </div>
        </div>
    );
}


export default Admin;
