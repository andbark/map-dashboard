export interface School {
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

export interface MapViewport {
  center: [number, number];
  zoom: number;
} 