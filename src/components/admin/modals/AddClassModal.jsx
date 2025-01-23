import { useState, useEffect } from 'react';
import { addDoc, collection, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const AddClassModal = ({ onClose, onClassAdded, initialData }) => {
    const [classData, setClassData] = useState({
        name: '',
        teacher: '',
        status: 'active',
    });
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teachersQuery = query(collection(db, 'users'), where('userType', '==', 'educator'), where('status', '==', 'active'));
                const snapshot = await getDocs(teachersQuery);
                const teacherList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTeachers(teacherList);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();

        if (initialData) {
            setClassData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (initialData) {
            await updateDoc(doc(db, 'classes', initialData.id), classData);
            onClassAdded(classData);
        } else {
            const docRef = await addDoc(collection(db, 'classes'), classData);
            onClassAdded({ id: docRef.id, ...classData });
        }
        onClose();
    };

    return (
        <div>
            <h2>{initialData ? 'Edit Class' : 'Add New Class'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={classData.name}
                    onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                    required
                />
                <select
                    value={classData.teacher}
                    onChange={(e) => setClassData({ ...classData, teacher: e.target.value })}
                    required
                >
                    <option value="">Select Teacher</option>
                    {!loading ? (
                        teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} {teacher.surname}
                            </option>
                        ))
                    ) : (
                        <option disabled>Loading teachers...</option>
                    )}
                </select>
                <select
                    value={classData.status}
                    onChange={(e) => setClassData({ ...classData, status: e.target.value })}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit">{initialData ? 'Update Class' : 'Add Class'}</button>
            </form>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default AddClassModal; 