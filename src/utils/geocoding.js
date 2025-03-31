// Import the TypeScript geocoding function
import { geocodeAddress } from './geocoding.ts';

/**
 * Geocode a list of schools to add latitude and longitude
 * 
 * @param {Array} schools - Array of school objects
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise<Array>} - Promise resolving to array of geocoded schools
 */
export async function geocodeSchools(schools, onProgress) {
  if (!schools || !Array.isArray(schools)) {
    console.error('Invalid schools data provided to geocodeSchools:', schools);
    throw new Error('Invalid schools data: schools must be an array');
  }
  
  console.log(`Starting geocoding for ${schools.length} schools`);
  const geocodedSchools = [];
  const totalSchools = schools.length;
  let processedSchools = 0;
  
  for (const school of schools) {
    try {
      // Skip schools that already have coordinates
      if (
        school.latitude !== undefined && 
        school.longitude !== undefined && 
        school.latitude !== null && 
        school.longitude !== null &&
        !isNaN(parseFloat(school.latitude)) && 
        !isNaN(parseFloat(school.longitude))
      ) {
        console.log(`School ${school.name} already has coordinates: ${school.latitude}, ${school.longitude}`);
        geocodedSchools.push({
          ...school,
          latitude: parseFloat(school.latitude),
          longitude: parseFloat(school.longitude)
        });
        processedSchools++;
        if (onProgress) {
          onProgress(Math.round((processedSchools / totalSchools) * 100));
        }
        continue;
      }
      
      // Create a complete address string
      const fullAddress = `${school.address || ''}, ${school.city || ''}, ${school.state || ''} ${school.zipCode || ''}`;
      console.log(`Geocoding address for ${school.name}: ${fullAddress}`);
      
      // Add a delay to avoid rate limiting with the geocoding API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const coordinates = await geocodeAddress(fullAddress);
        
        if (coordinates && coordinates.length === 2) {
          console.log(`Found coordinates for ${school.name}: ${coordinates[0]}, ${coordinates[1]}`);
          geocodedSchools.push({
            ...school,
            latitude: coordinates[0],
            longitude: coordinates[1]
          });
        } else {
          console.warn(`No coordinates found for ${school.name} at address: ${fullAddress}`);
          // Keep the school even if geocoding failed
          geocodedSchools.push(school);
        }
      } catch (geocodeError) {
        console.error(`Error geocoding address for ${school.name}:`, geocodeError);
        // Keep the school without coordinates
        geocodedSchools.push(school);
      }
    } catch (schoolError) {
      console.error(`Error processing school ${school?.name || 'unknown'}:`, schoolError);
      // Keep the school without coordinates
      geocodedSchools.push(school);
    }
    
    processedSchools++;
    if (onProgress) {
      onProgress(Math.round((processedSchools / totalSchools) * 100));
    }
  }
  
  const successCount = geocodedSchools.filter(s => 
    s.latitude !== undefined && 
    s.longitude !== undefined &&
    !isNaN(parseFloat(s.latitude)) && 
    !isNaN(parseFloat(s.longitude))
  ).length;
  
  console.log(`Geocoding complete. Successfully geocoded ${successCount} of ${totalSchools} schools.`);
  return geocodedSchools;
}

// Also export the geocodeAddress function directly for convenience
export { geocodeAddress }; 