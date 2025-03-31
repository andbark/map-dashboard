const fs = require('fs');
const path = require('path');

// Create the service account key file
const serviceAccountKey = {
  "type": "service_account",
  "project_id": "map-dashboard-5bdce",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "firebase-adminsdk-xxxxx@map-dashboard-5bdce.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

// Create the credentials directory if it doesn't exist
const credentialsDir = path.join(process.cwd(), 'credentials');
if (!fs.existsSync(credentialsDir)) {
  fs.mkdirSync(credentialsDir);
}

// Write the service account key file
fs.writeFileSync(
  path.join(credentialsDir, 'service-account-key.json'),
  JSON.stringify(serviceAccountKey, null, 2)
);

console.log('Service account key file created at: credentials/service-account-key.json');
console.log('Please replace the placeholder values in the file with your actual Firebase Admin SDK credentials.'); 