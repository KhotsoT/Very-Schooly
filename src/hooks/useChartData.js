import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const useChartData = (classId) => {
    const [performanceData, setPerformanceData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        setLoading(true);

        // Performance Data Subscription
        const performanceQuery = query(
            collection(db, 'assessments'),
            where('classId', '==', classId),
            orderBy('date', 'asc')
        );

        const unsubPerformance = onSnapshot(performanceQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const assessment = doc.data();
                return {
                    name: assessment.name,
                    average: assessment.classAverage,
                    student: assessment.averageScore
                };
            });
            setPerformanceData(data);
        });

        // Attendance Data Subscription
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

        const attendanceQuery = query(
            collection(db, 'attendance'),
            where('classId', '==', classId),
            where('date', '>=', startOfWeek),
            orderBy('date', 'asc')
        );

        const unsubAttendance = onSnapshot(attendanceQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const attendance = doc.data();
                return {
                    name: new Date(attendance.date.toDate()).toLocaleDateString('en-ZA', { weekday: 'long' }),
                    present: attendance.presentCount,
                    absent: attendance.absentCount
                };
            });
            setAttendanceData(data);
        });

        // Grade Distribution Subscription
        const gradesQuery = query(
            collection(db, 'grades'),
            where('classId', '==', classId)
        );

        const unsubGrades = onSnapshot(gradesQuery, (snapshot) => {
            const grades = snapshot.docs.map(doc => doc.data().grade);

            // Calculate distribution
            const distribution = {
                A: grades.filter(g => g >= 80).length,
                B: grades.filter(g => g >= 70 && g < 80).length,
                C: grades.filter(g => g >= 60 && g < 70).length,
                D: grades.filter(g => g >= 50 && g < 60).length,
                F: grades.filter(g => g < 50).length,
            };

            const data = [
                { name: 'A (80-100%)', value: distribution.A },
                { name: 'B (70-79%)', value: distribution.B },
                { name: 'C (60-69%)', value: distribution.C },
                { name: 'D (50-59%)', value: distribution.D },
                { name: 'F (0-49%)', value: distribution.F },
            ];

            setGradeDistribution(data);
        });

        setLoading(false);

        // Cleanup subscriptions
        return () => {
            unsubPerformance();
            unsubAttendance();
            unsubGrades();
        };
    }, [classId]);

    return { performanceData, attendanceData, gradeDistribution, loading };
}; 