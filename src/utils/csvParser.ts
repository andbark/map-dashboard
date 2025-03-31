import Papa from 'papaparse';
import { School } from '@/types';
import { geocodeSchools } from './geocoding';

export function parseCSV(file: File): Promise<School[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Process each row from the CSV
          const schools: School[] = results.data
            .filter((row: any) => {
              // Filter out rows with missing required data
              return row['School Name'] && 
                     row['Address'] && 
                     row['City'] && 
                     row['State'];
            })
            .map((row: any) => {
              // Map CSV columns to our School type
              const school: School = {
                name: row['School Name'] || '',
                district: row['School District'] || '',
                address: row['Address'] || '',
                city: row['City'] || '',
                state: row['State'] || '',
                zipCode: row['Zip Code'] || '',
                // If latitude/longitude are provided in CSV, use them
                latitude: row['Latitude'] ? parseFloat(row['Latitude']) : undefined,
                longitude: row['Longitude'] ? parseFloat(row['Longitude']) : undefined
              };
              
              return school;
            });

          // Geocode schools that don't have coordinates
          const geocodedSchools = await geocodeSchools(schools);
          resolve(geocodedSchools);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
} 