import Papa from 'papaparse';
import { School } from '@/types';

export function parseCSV(file: File): Promise<School[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const schools: School[] = [];
        
        // Process each row from the CSV
        results.data.forEach((row: any) => {
          // Map CSV columns to our School type
          const school: School = {
            name: row['School Name'] || '',
            district: row['School District'] || '',
            address: row['Address'] || '',
            city: row['City'] || '',
            state: row['State'] || '',
            zipCode: row['Zip Code'] || '',
          };
          
          // Only add valid schools with required data
          if (school.name && school.address && school.city && school.state) {
            schools.push(school);
          }
        });
        
        resolve(schools);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
} 