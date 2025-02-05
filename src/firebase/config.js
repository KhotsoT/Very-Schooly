import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import {
    initializeFirestore,
    persistentLocalCache,
    persistentSingleTabManager,
    CACHE_SIZE_UNLIMITED,
    getDoc,
    doc,
    collection,
    addDoc,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';

// Verify environment variables are loaded
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.error('Firebase configuration error: Environment variables are not loaded');
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with persistent cache
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
});

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error('Error setting auth persistence:', error);
    });

// Collection references
const usersRef = collection(db, 'users');
const activitiesRef = collection(db, 'activities');
const paymentsRef = collection(db, 'payments');

// Configure auth settings
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';

// Helper function to log activities
export const logActivity = async (activity) => {
    try {
        if (!auth.currentUser) {
            throw new Error('Must be authenticated to log activity');
        }

        await addDoc(activitiesRef, {
            ...activity,
            userId: auth.currentUser.uid,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        throw error; // Re-throw to handle in components
    }
};

// Add this function to verify user roles
export const verifyUserRole = async (userId, expectedRole) => {
    try {
        if (!auth.currentUser) {
            return false;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            return false;
        }

        const userData = userDoc.data();
        return userData.userType === expectedRole;
    } catch (error) {
        console.error('Error verifying user role:', error);
        return false;
    }
};

// Update actionCodeSettings to use Firebase Dynamic Links
export const actionCodeSettings = {
    url: window.location.hostname === 'localhost'
        ? 'http://localhost:5173/login'
        : `https://${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}/login`,
    handleCodeInApp: true,
    dynamicLinkDomain: import.meta.env.VITE_FIREBASE_DYNAMIC_LINK_DOMAIN || undefined
};

// Function to handle email verification
export const handleEmailVerification = async (user, tempPassword, redirectUrl) => {
    const actionCodeSettings = {
        // Add state parameter to maintain user type information
        url: `${redirectUrl}?email=${user.email}&userType=${encodeURIComponent(user.userType)}`,
        handleCodeInApp: true,
    };

    try {
        // Send password reset email first
        await sendPasswordResetEmail(auth, user.email, actionCodeSettings);
        
        // Set custom claims or additional user data if needed
        await setDoc(doc(db, 'userSettings', user.uid), {
            lastPasswordReset: new Date().toISOString(),
            redirectUrl: redirectUrl
        }, { merge: true });
        
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

export { auth, db, usersRef, activitiesRef, paymentsRef }; 