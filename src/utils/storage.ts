import { RestaurantSpot, VotingRoom } from '../types';
import { SECRET_LOCAL_SPOTS } from '../data/restaurants';

const ROOM_STORAGE_KEY = 'biryani_wars_current_room';
const CUSTOM_SPOTS_KEY = 'biryani_wars_custom_spots';
const VOTER_NAME_KEY = 'biryani_wars_voter_name';

export function getCustomSpots(): RestaurantSpot[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SPOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSpots(spots: RestaurantSpot[]) {
  try {
    localStorage.setItem(CUSTOM_SPOTS_KEY, JSON.stringify(spots));
  } catch (err) {
    console.error('Failed to save custom spots', err);
  }
}

export function addCustomSpot(spot: Omit<RestaurantSpot, 'id' | 'votes'>): RestaurantSpot {
  const newSpot: RestaurantSpot = {
    ...spot,
    id: `custom-spot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    votes: 0,
  };
  const current = getCustomSpots();
  const updated = [newSpot, ...current];
  saveCustomSpots(updated);
  return newSpot;
}

export function clearCustomSpots() {
  localStorage.removeItem(CUSTOM_SPOTS_KEY);
}

/**
 * Returns the effective spots pool:
 * SECRET_LOCAL_SPOTS combined with any manually added custom spots.
 */
export function getAllAvailableSpots(): RestaurantSpot[] {
  const custom = getCustomSpots();
  // Merge SECRET_LOCAL_SPOTS + custom spots
  return [...SECRET_LOCAL_SPOTS, ...custom];
}

export function getSavedRoom(): VotingRoom | null {
  try {
    const raw = localStorage.getItem(ROOM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRoom(room: VotingRoom | null) {
  try {
    if (room) {
      localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(room));
    } else {
      localStorage.removeItem(ROOM_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save room', err);
  }
}

export function getSavedVoterName(): string {
  return localStorage.getItem(VOTER_NAME_KEY) || 'Ustaad';
}

export function saveVoterName(name: string) {
  localStorage.setItem(VOTER_NAME_KEY, name);
}
