# Map Dashboard

A web application for managing and visualizing school locations on a map. Built with Next.js, Firebase, and Leaflet.

## Features

- Upload school data via CSV
- Geocode school addresses automatically
- Interactive map visualization
- Search and filter schools
- Data management tools
- Firebase integration for data persistence
- Optional HubSpot integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your Firebase configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required Firebase configuration variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Optional:
- `NEXT_PUBLIC_HUBSPOT_API_KEY` (for HubSpot integration)

## CSV Format

The CSV file should include the following columns:
- School Name (required)
- School District
- Address (required)
- City (required)
- State (required)
- Zip Code
- Latitude (optional)
- Longitude (optional)

## Deployment

This project is configured for easy deployment on Vercel. Just connect your GitHub repository to Vercel and add the required environment variables in the Vercel project settings. 