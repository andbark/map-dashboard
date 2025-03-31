#!/bin/bash

# Set Firebase environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "AIzaSyBqeov7UixuS6Zo0vXbb_WmP5BbRoWSYcs"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "map-dashboard-5bdce.firebaseapp.com"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "map-dashboard-5bdce"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "map-dashboard-5bdce.firebasestorage.app"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "368958593163"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "1:368958593163:web:0c146444e79646f34a5c8e"
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production <<< "G-DT81BVFCYL"

# Set Firebase Admin SDK environment variables
vercel env add FIREBASE_PROJECT_ID production <<< "map-dashboard-5bdce"
vercel env add FIREBASE_CLIENT_EMAIL production <<< "firebase-adminsdk-xxxxx@map-dashboard-5bdce.iam.gserviceaccount.com" 