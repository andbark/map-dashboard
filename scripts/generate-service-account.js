const admin = require('firebase-admin');

// Initialize Firebase Admin with default credentials
admin.initializeApp({
  projectId: 'map-dashboard-5bdce',
  credential: admin.credential.applicationDefault()
});

// Generate a new service account key
admin.auth().createCustomToken('admin@mapdashboard.com')
  .then((customToken) => {
    console.log('Custom token generated successfully:', customToken);
  })
  .catch((error) => {
    console.error('Error generating custom token:', error);
  }); 