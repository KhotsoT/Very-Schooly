// src/pages/Dashboard.jsx
import '../styles/dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-cards">
                <div className="card">Total Students: 120</div>
                <div className="card">Upcoming Classes: 5</div>
                <div className="card">Pending Tasks: 3</div>
            </div>
        </div>
    );
}

export default Dashboard;
