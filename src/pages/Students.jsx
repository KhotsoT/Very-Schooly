// src/pages/Students.jsx
import '../styles/students.css';

function Students() {
    return (
        <div className="students">
            <h1>Students</h1>
            <table className="students-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>10</td>
                        <td>95%</td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>11</td>
                        <td>89%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}


export default Students;
