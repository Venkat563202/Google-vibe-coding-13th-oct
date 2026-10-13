export interface RestaurantSpot {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  votes: number;
  specialty?: string;
  parkingAlert?: string;
  trafficAlert?: string;
  spiceLevel?: 'Medium' | 'Kirrak Teekha' | 'Fire 🔥';
  priceRange?: '₹' | '₹₹' | '₹₹₹';
  khansamaNote?: string;
}

export type DistanceFilter = 'all' | 3 | 5 | 10;

export interface VotingRoom {
  id: string;
  roomName: string;
  hostName: string;
  createdAt: number;
  durationSeconds: number; // e.g. 120, 300, 600 or 0 for unlimited
  expiresAt: number | null; // timestamp when voting closes
  status: 'active' | 'ended';
  spots: RestaurantSpot[];
  userVoteId: string | null; // Restaurant id voted by the current user
  voterCount: number;
  winnerSpotId?: string | null;
}

export interface HyderabadiQuote {
  headline: string;
  subtext: string;
  context: 'victory' | 'tie' | 'traffic' | 'parking' | 'empty';
}
