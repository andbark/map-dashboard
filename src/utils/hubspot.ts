import { School } from '@/types';

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com/crm/v3';

/**
 * Fetch schools from HubSpot CRM
 * @param apiKey Your HubSpot API key
 * @returns Array of School objects
 */
export async function fetchSchoolsFromHubSpot(apiKey: string): Promise<School[]> {
  try {
    // Fetch companies (schools) from HubSpot
    const response = await fetch(`${HUBSPOT_API_BASE}/objects/companies?limit=100`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map HubSpot companies to School objects
    const schools: School[] = data.results.map((company: any) => {
      // Extract properties from HubSpot company
      const properties = company.properties;
      
      return {
        id: company.id,
        name: properties.name || '',
        district: properties.school_district || '',
        address: properties.address || '',
        city: properties.city || '',
        state: properties.state || '',
        zipCode: properties.zip || '',
        // If latitude/longitude are stored in HubSpot
        latitude: properties.latitude ? parseFloat(properties.latitude) : undefined,
        longitude: properties.longitude ? parseFloat(properties.longitude) : undefined
      };
    });

    return schools;
  } catch (error) {
    console.error('Error fetching from HubSpot:', error);
    throw error;
  }
}

/**
 * Import schools from the map dashboard to HubSpot
 * @param apiKey Your HubSpot API key
 * @param schools Array of School objects to import
 * @returns Success status
 */
export async function importSchoolsToHubSpot(apiKey: string, schools: School[]): Promise<boolean> {
  try {
    // Batch create companies in HubSpot
    // Note: HubSpot batch API allows up to 100 objects per request
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < schools.length; i += BATCH_SIZE) {
      const batch = schools.slice(i, i + BATCH_SIZE);
      
      // Format schools for HubSpot API
      const hubspotCompanies = batch.map(school => ({
        properties: {
          name: school.name,
          school_district: school.district,
          address: school.address,
          city: school.city,
          state: school.state,
          zip: school.zipCode,
          latitude: school.latitude?.toString(),
          longitude: school.longitude?.toString(),
          company_type: 'SCHOOL',
          industry: 'EDUCATION'
        }
      }));
      
      // Send batch to HubSpot
      const response = await fetch(`${HUBSPOT_API_BASE}/objects/companies/batch/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: hubspotCompanies })
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error importing to HubSpot:', error);
    return false;
  }
} 