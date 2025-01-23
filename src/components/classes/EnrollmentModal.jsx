import { useState, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Papa from 'papaparse';

const EnrollmentModal = ({ classId, className, onClose, onEnrollmentComplete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [bulkResults, setBulkResults] = useState(null);
    const fileInputRef = useRef();

    const searchStudents = async (term) => {
        if (term.length < 2) return;

        try {
            const studentsQuery = query(
                collection(db, 'users'),
                where('role', '==', 'student'),
                where('name', '>=', term),
                where('name', '<=', term + '\uf8ff')
            );

            const snapshot = await getDocs(studentsQuery);
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setSearchResults(students);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                if (results.data.length === 0) {
                    setUploadError('No data found in CSV file');
                    return;
                }

                // Validate CSV structure
                const requiredFields = ['studentId', 'name', 'email'];
                const optionalFields = [
                    'grade',
                    'parentName',
                    'parentEmail',
                    'phoneNumber',
                    'dateOfBirth',
                    'gender',
                    'address'
                ];

                const hasRequiredFields = requiredFields.every(field =>
                    results.meta.fields.includes(field)
                );

                if (!hasRequiredFields) {
                    setUploadError('CSV must include studentId, name, and email columns');
                    return;
                }

                // Validate data format
                const errors = [];
                results.data.forEach((row, index) => {
                    if (row.email && !isValidEmail(row.email)) {
                        errors.push(`Row ${index + 1}: Invalid student email format`);
                    }
                    if (row.parentEmail && !isValidEmail(row.parentEmail)) {
                        errors.push(`Row ${index + 1}: Invalid parent email format`);
                    }
                    if (row.dateOfBirth && !isValidDate(row.dateOfBirth)) {
                        errors.push(`Row ${index + 1}: Invalid date format (use YYYY-MM-DD)`);
                    }
                });

                if (errors.length > 0) {
                    setUploadError(errors.join('\n'));
                    return;
                }

                setBulkResults(results.data);
                setUploadError('');
            },
            error: (error) => {
                setUploadError('Error parsing CSV file: ' + error.message);
            }
        });
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };

    const handleBulkEnroll = async () => {
        if (!bulkResults) return;
        setLoading(true);

        try {
            const batch = writeBatch(db);
            let enrolledCount = 0;

            for (const student of bulkResults) {
                // Check if student already exists
                const studentQuery = query(
                    collection(db, 'users'),
                    where('studentId', '==', student.studentId)
                );
                const studentSnapshot = await getDocs(studentQuery);

                let studentId;
                if (studentSnapshot.empty) {
                    // Create new student user
                    const newStudentRef = doc(collection(db, 'users'));
                    batch.set(newStudentRef, {
                        name: student.name,
                        email: student.email,
                        studentId: student.studentId,
                        role: 'student',
                        grade: student.grade || '',
                        parentName: student.parentName || '',
                        parentEmail: student.parentEmail || '',
                        phoneNumber: student.phoneNumber || '',
                        dateOfBirth: student.dateOfBirth || '',
                        gender: student.gender || '',
                        address: student.address || '',
                        createdAt: new Date().toISOString()
                    });
                    studentId = newStudentRef.id;
                } else {
                    studentId = studentSnapshot.docs[0].id;
                }

                // Create enrollment
                const enrollmentRef = doc(collection(db, 'enrollments'));
                batch.set(enrollmentRef, {
                    classId,
                    className,
                    studentId,
                    studentName: student.name,
                    enrolledAt: new Date().toISOString(),
                    status: 'pending',
                    updatedAt: new Date().toISOString()
                });

                enrolledCount++;
            }

            // Update class student count
            const classRef = doc(db, 'classes', classId);
            batch.update(classRef, {
                studentCount: (await getDoc(classRef)).data().studentCount + enrolledCount
            });

            await batch.commit();
            onEnrollmentComplete();
            onClose();
        } catch (error) {
            console.error('Error bulk enrolling students:', error);
            setUploadError('Error enrolling students: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (student) => {
        if (!selectedStudents.find(s => s.id === student.id)) {
            setSelectedStudents([...selectedStudents, student]);
        }
        setSearchResults([]);
        setSearchTerm('');
    };

    const handleRemoveStudent = (studentId) => {
        setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
    };

    const handleEnroll = async () => {
        setLoading(true);
        try {
            const batch = [];

            // Create enrollment records
            for (const student of selectedStudents) {
                batch.push(
                    addDoc(collection(db, 'enrollments'), {
                        classId,
                        className,
                        studentId: student.id,
                        studentName: student.name,
                        enrolledAt: new Date().toISOString(),
                        status: 'pending',
                        updatedAt: new Date().toISOString()
                    })
                );
            }

            // Update class student count
            const classRef = doc(db, 'classes', classId);
            batch.push(
                updateDoc(classRef, {
                    studentCount: selectedStudents.length
                })
            );

            await Promise.all(batch);
            onEnrollmentComplete();
            onClose();
        } catch (error) {
            console.error('Error enrolling students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        // Create sample data
        const sampleData = [
            {
                studentId: '12345',
                name: 'John Doe',
                email: 'john.doe@example.com',
                grade: '10',
                parentName: 'Robert Doe',
                parentEmail: 'robert.doe@example.com',
                phoneNumber: '123-456-7890',
                dateOfBirth: '2008-05-15',
                gender: 'Male',
                address: '123 School Street, City, State 12345'
            },
            {
                studentId: '12346',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                grade: '10',
                parentName: 'Mary Smith',
                parentEmail: 'mary.smith@example.com',
                phoneNumber: '098-765-4321',
                dateOfBirth: '2008-08-20',
                gender: 'Female',
                address: '456 Education Ave, City, State 12345'
            }
        ];

        // Convert to CSV
        const csv = Papa.unparse(sampleData);

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'student_enrollment_template.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Enroll Students</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Bulk Upload Section */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-medium mb-2">Bulk Enrollment</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-4 mb-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        Upload CSV File
                                    </button>
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Template
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Required columns:</span> studentId, name, email
                                    <br />
                                    <span className="font-medium">Optional columns:</span> grade, parentName, parentEmail, phoneNumber, dateOfBirth (YYYY-MM-DD), gender, address
                                    <br />
                                    <span className="text-xs text-gray-400">
                                        Download the template for the correct format
                                    </span>
                                </p>
                                {uploadError && (
                                    <p className="text-sm text-red-500">{uploadError}</p>
                                )}
                                {bulkResults && (
                                    <div className="mt-2">
                                        <p className="text-sm text-green-600">
                                            Found {bulkResults.length} students in CSV
                                        </p>
                                        <button
                                            onClick={handleBulkEnroll}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            disabled={loading}
                                        >
                                            {loading ? 'Enrolling...' : `Enroll ${bulkResults.length} Students`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Individual Enrollment Section */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Individual Enrollment</h3>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            searchStudents(e.target.value);
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="Search students..."
                                    />
                                    {searchResults.length > 0 && (
                                        <div className="absolute mt-1 w-full max-w-md bg-white border rounded-md shadow-lg">
                                            {searchResults.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleStudentSelect(student)}
                                                >
                                                    {student.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedStudents.length > 0 && (
                                    <div className="border rounded-md p-2">
                                        <h3 className="text-sm font-medium mb-2">Selected Students:</h3>
                                        <div className="space-y-2">
                                            {selectedStudents.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                                                >
                                                    <span>{student.name}</span>
                                                    <button
                                                        onClick={() => handleRemoveStudent(student.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEnroll}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                        disabled={loading || selectedStudents.length === 0}
                                    >
                                        {loading ? 'Enrolling...' : 'Enroll Selected'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentModal; 