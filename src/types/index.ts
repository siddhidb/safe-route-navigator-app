
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface CrimeData {
  id: number;
  date: string;
  category: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface RouteHistory {
  id: string;
  user_id: string;
  source: string;
  destination: string;
  route_taken: string;
  safety_score: number;
  created_at: string;
}

export interface SafetyZone {
  center: [number, number];
  radius: number;
  safety_score: number;
}

export interface RouteOption {
  coordinates: Array<[number, number]>;
  safety: 'safe' | 'normal' | 'unsafe';
  distance: string;
  time: string;
  safety_score: number;
}

export interface RouteOptions {
  safeRoute: RouteOption;
  normalRoute: RouteOption;
  unsafeRoute: RouteOption;
}
