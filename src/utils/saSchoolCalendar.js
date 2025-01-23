export const SCHOOL_TERMS_2024 = {
    TERM_1: {
        start: '2024-01-17',
        end: '2024-03-20',
        name: 'Term 1'
    },
    TERM_2: {
        start: '2024-04-03',
        end: '2024-06-14',
        name: 'Term 2'
    },
    TERM_3: {
        start: '2024-07-09',
        end: '2024-09-20',
        name: 'Term 3'
    },
    TERM_4: {
        start: '2024-10-01',
        end: '2024-12-04',
        name: 'Term 4'
    }
};

export const PUBLIC_HOLIDAYS_2024 = [
    { date: '2024-01-01', name: 'New Year\'s Day' },
    { date: '2024-03-21', name: 'Human Rights Day' },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-04-01', name: 'Family Day' },
    { date: '2024-04-27', name: 'Freedom Day' },
    { date: '2024-05-01', name: 'Workers\' Day' },
    { date: '2024-06-16', name: 'Youth Day' },
    { date: '2024-06-17', name: 'Public Holiday' },
    { date: '2024-08-09', name: 'National Women\'s Day' },
    { date: '2024-09-24', name: 'Heritage Day' },
    { date: '2024-12-16', name: 'Day of Reconciliation' },
    { date: '2024-12-25', name: 'Christmas Day' },
    { date: '2024-12-26', name: 'Day of Goodwill' }
];

export const getCurrentTerm = () => {
    const today = new Date();
    return Object.values(SCHOOL_TERMS_2024).find(term => {
        const termStart = new Date(term.start);
        const termEnd = new Date(term.end);
        return today >= termStart && today <= termEnd;
    });
};

export const getNextTerm = () => {
    const today = new Date();
    return Object.values(SCHOOL_TERMS_2024).find(term => {
        const termStart = new Date(term.start);
        return today < termStart;
    });
};

export const isSchoolHoliday = (date) => {
    const checkDate = new Date(date);

    // Check if it's a weekend
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) return true;

    // Check if it's a public holiday
    const isPublicHoliday = PUBLIC_HOLIDAYS_2024.some(holiday =>
        new Date(holiday.date).toDateString() === checkDate.toDateString()
    );
    if (isPublicHoliday) return true;

    // Check if it's between terms
    const isInTerm = Object.values(SCHOOL_TERMS_2024).some(term => {
        const termStart = new Date(term.start);
        const termEnd = new Date(term.end);
        return checkDate >= termStart && checkDate <= termEnd;
    });

    return !isInTerm;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}; 