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
      console.error(`Geocoding failed with status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }
    
    console.log(`No results found for address: ${address}`);
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
  
  console.log(`Starting geocoding for ${totalSchools} schools`);
  
  for (const school of schools) {
    // Skip schools that already have coordinates
    if (school.latitude && school.longitude) {
      geocodedSchools.push(school);
      processedSchools++;
      if (onProgress) {
        onProgress(Math.round((processedSchools / totalSchools) * 100));
      }
      continue;
    }
    
    // Create a complete address string
    const fullAddress = `${school.address}, ${school.city}, ${school.state} ${school.zipCode}`;
    console.log(`Geocoding address: ${fullAddress}`);
    
    // Add a delay to avoid rate limiting with the geocoding API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const coordinates = await geocodeAddress(fullAddress);
    
    if (coordinates) {
      console.log(`Found coordinates for ${school.name}: ${coordinates[0]}, ${coordinates[1]}`);
      geocodedSchools.push({
        ...school,
        latitude: coordinates[0],
        longitude: coordinates[1]
      });
    } else {
      // Keep the school even if geocoding failed
      console.log(`No coordinates found for ${school.name}`);
      geocodedSchools.push(school);
    }
    
    processedSchools++;
    if (onProgress) {
      onProgress(Math.round((processedSchools / totalSchools) * 100));
    }
  }
  
  console.log(`Geocoding complete. ${geocodedSchools.filter(s => s.latitude && s.longitude).length} of ${totalSchools} schools were successfully geocoded.`);
  return geocodedSchools;
} 