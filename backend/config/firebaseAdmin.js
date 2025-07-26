/**
 * Firebase Admin SDK Configuration
 * Initializes Firebase Admin with environment variables for secure connection
 * to Firestore and Firebase Storage
 */

const admin = require('firebase-admin');
const MockStorage = require('../utils/mockStorage');
require('dotenv').config();

// Check if Firebase environment variables are provided
const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID && 
                          process.env.FIREBASE_CLIENT_EMAIL && 
                          process.env.FIREBASE_PRIVATE_KEY;

let db, storage, auth, collections;

if (hasFirebaseConfig) {
  // Firebase Admin Service Account Configuration
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: "",
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: "",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
  };

  // Initialize Firebase Admin
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    
    console.log('✅ Firebase Admin initialized successfully');
    
    // Export Firebase services
    db = admin.firestore();
    storage = admin.storage();
    auth = admin.auth();

    // Firestore collections references
    collections = {
      vendors: db.collection('vendors'),
      prices: db.collection('prices'),
      surplus: db.collection('surplus'),
      emergency: db.collection('emergency')
    };
    
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    console.log('Please check your environment variables in .env file');
    console.log('Running in mock mode without Firebase...');
  }
} else {
  console.log('⚠️  Firebase environment variables not found');
  console.log('Running in development mode with mock storage');
  console.log('Please set up your .env file with Firebase credentials for full functionality');
  
  // Create mock storage for development
  const mockStorage = new MockStorage();
  mockStorage.addSampleData();
  
  db = mockStorage;
  storage = null;
  auth = null;
  collections = {
    vendors: mockStorage.collection('vendors'),
    prices: mockStorage.collection('prices'),
    surplus: mockStorage.collection('surplus'),
    emergency: mockStorage.collection('emergency')
  };
}

module.exports = {
  admin: hasFirebaseConfig ? admin : null,
  db,
  storage,
  auth,
  collections
};
