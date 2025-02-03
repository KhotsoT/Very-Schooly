import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AddAssignmentModal = ({ onClose, onAssignmentAdded }) => {
    const [assignmentData, setAssignmentData] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'assignments'), assignmentData);
            onAssignmentAdded({ id: docRef.id, ...assignmentData });
            onClose();
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <div>
            <h2>Add New Assignment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={assignmentData.description}
                    onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={assignmentData.dueDate}
                    onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                    required
                />
                <button type="submit">Add Assignment</button>
            </form>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default AddAssignmentModal; 