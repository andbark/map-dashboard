interface School {
  id?: string;
  name: string;
  district: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

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
export async function geocodeSchools(
  schools: School[],
  onProgress?: (progress: number) => void
): Promise<School[]> {
  const geocodedSchools: School[] = [];
  const totalSchools = schools.length;
  let processedSchools = 0;
  
  for (const school of schools) {
    // Skip schools that already have coordinates
    if (school.latitude && school.longitude) {
      geocodedSchools.push(school);
      processedSchools++;
      if (onProgress) {
        onProgress((processedSchools / totalSchools) * 100);
      }
      continue;
    }
    
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
    
    processedSchools++;
    if (onProgress) {
      onProgress((processedSchools / totalSchools) * 100);
    }
  }
  
  return geocodedSchools;
} 