# FEAST Backend - Firebase Setup Guide

## Quick Start (Development Mode)

The backend will start in development mode without Firebase if no credentials are provided. This is perfect for initial testing and frontend development.

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Enable Storage

### 2. Generate Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values from the JSON:
   - `project_id`
   - `client_email`
   - `private_key`

### 3. Configure Environment Variables
Create or update your `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Firestore Security Rules
Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Storage Security Rules
Add these rules to your Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Testing Firebase Connection

Once configured, restart the server:
```bash
npm start
```

You should see:
```
✅ Firebase Admin initialized successfully
🚀 FEAST Backend Server Started
📡 Server running on http://localhost:5000
```

## Troubleshooting

### Common Issues:

1. **Invalid PEM formatted message**
   - Make sure the private key is properly escaped with `\n`
   - Wrap the entire private key in double quotes

2. **Project not found**
   - Verify the project ID is correct
   - Ensure the service account has proper permissions

3. **Storage bucket not found**
   - Check if the bucket name is correct (usually `project-id.appspot.com`)
   - Ensure Storage is enabled in Firebase Console

### Development Mode
If you see this message, Firebase is not configured:
```
⚠️  Firebase environment variables not found
Running in development mode without Firebase
```

This is normal for initial setup. The API will still work but data won't persist.

## Production Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use proper Firebase security rules
3. Set up Firebase App Check for additional security
4. Configure CORS properly
5. Set up monitoring and logging
