// Firebase Configuration Template
// Copy this to firebase-config.js and fill in your credentials

const FIREBASE_CONFIG = {
    // Replace with your Firebase project credentials
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", 
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    
    // URLs (auto-generated from project ID)
    HOSTING_URL: "https://YOUR_PROJECT_ID.web.app",
    FIRESTORE_BASE_URL: 'https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents',
    
    // Collection names
    COLLECTIONS: {
        AI_ANALYSIS: 'ai_analysis',
        USER_ACTIONS: 'user_actions',
        USER_SESSIONS: 'user_sessions',
        LOGIN_ATTEMPTS: 'login_attempts'
    }
};
