import { School } from '@/types';

// Function to geocode an address using OpenStreetMap Nominatim API
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const query = encodeURIComponent(`${address}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: {
        'User-Agent': 'SchoolMapDashboard/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Function to batch geocode a list of schools
export async function geocodeSchools(schools: School[]): Promise<School[]> {
  const geocodedSchools: School[] = [];
  
  for (const school of schools) {
    // Create a complete address string
    const fullAddress = `${school.address}, ${school.city}, ${school.state} ${school.zipCode}`;
    
    // Add a delay to avoid rate limiting with the geocoding API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const coordinates = await geocodeAddress(fullAddress);
    
    if (coordinates) {
      geocodedSchools.push({
        ...school,
        latitude: coordinates[0],
        longitude: coordinates[1]
      });
    } else {
      // Keep the school even if geocoding failed
      geocodedSchools.push(school);
    }
  }
  
  return geocodedSchools;
} 