import { useState, useEffect, useCallback, useRef } from 'react';
import { Campus, Building } from '@/data/campusData';

interface GeofenceConfig {
  radius: number; // meters
  updateInterval: number; // milliseconds
  maxAge: number; // maximum age of position in milliseconds
}

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  isTracking: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unsupported';
}

interface GeofenceState {
  currentBuilding: Building | null;
  previousBuilding: Building | null;
  insideGeofence: boolean;
  lastCheck: number | null;
}

interface UseGeofenceReturn extends GeolocationState, GeofenceState {
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  requestPermission: () => Promise<PermissionState>;
  sessionId: string;
}

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Generate unique session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Check if browser supports geolocation
function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

export function useGeofence(
  campus: Campus | null,
  config: Partial<GeofenceConfig> = {}
): UseGeofenceReturn {
  const {
    radius = 50, // 50 meters default radius
    updateInterval = 15000, // 15 seconds default
    maxAge = 30000 // 30 seconds max age
  } = config;

  // Session ID for this device
  const sessionId = useRef<string>(generateSessionId()).current;

  // Geolocation state
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    isTracking: false,
    permission: isGeolocationSupported() ? 'prompt' : 'unsupported'
  });

  // Geofence state
  const [geofence, setGeofence] = useState<GeofenceState>({
    currentBuilding: null,
    previousBuilding: null,
    insideGeofence: false,
    lastCheck: null
  });

  // Refs for cleanup
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousBuildingRef = useRef<Building | null>(null);

  // Check if user is inside any building geofence
  const checkGeofence = useCallback((lat: number, lon: number): Building | null => {
    if (!campus) return null;

    for (const building of campus.buildings) {
      const distance = calculateDistance(lat, lon, building.lat, building.lng);
      if (distance <= radius) {
        return building;
      }
    }

    return null;
  }, [campus, radius]);

  // Handle geofence state changes
  const handleGeofenceChange = useCallback((newBuilding: Building | null) => {
    const previousBuilding = previousBuildingRef.current;

    if (previousBuilding?.id !== newBuilding?.id) {
      // User moved between buildings or entered/exited campus
      setGeofence(prev => ({
        ...prev,
        currentBuilding: newBuilding,
        previousBuilding: previousBuilding,
        insideGeofence: newBuilding !== null,
        lastCheck: Date.now()
      }));

      // Update ref for next comparison
      previousBuildingRef.current = newBuilding;

      // TODO: Send occupancy update to backend
      if (previousBuilding && newBuilding) {
        // User moved from one building to another
        console.log(`Moved from ${previousBuilding.name} to ${newBuilding.name}`);
        // occupancyAPI.exitBuilding(previousBuilding.id, sessionId);
        // occupancyAPI.enterBuilding(newBuilding.id, sessionId);
      } else if (previousBuilding && !newBuilding) {
        // User exited all buildings
        console.log(`Exited ${previousBuilding.name}`);
        // occupancyAPI.exitBuilding(previousBuilding.id, sessionId);
      } else if (!previousBuilding && newBuilding) {
        // User entered a building
        console.log(`Entered ${newBuilding.name}`);
        // occupancyAPI.enterBuilding(newBuilding.id, sessionId);
      }
    }
  }, [sessionId]);

  // Update geolocation state
  const updatePosition = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position;
    
    setGeolocation(prev => ({
      ...prev,
      latitude,
      longitude,
      accuracy,
      timestamp: position.timestamp,
      error: null
    }));

    // Check geofence
    const currentBuilding = checkGeofence(latitude, longitude);
    handleGeofenceChange(currentBuilding);
  }, [checkGeofence, handleGeofenceChange]);

  // Handle geolocation errors
  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unknown error occurred';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        setGeolocation(prev => ({ ...prev, permission: 'denied' }));
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }

    setGeolocation(prev => ({
      ...prev,
      error: errorMessage,
      isTracking: false
    }));
  }, []);

  // Request location permission
  const requestPermission = useCallback(async (): Promise<PermissionState> => {
    if (!isGeolocationSupported()) {
      setGeolocation(prev => ({ ...prev, permission: 'unsupported' }));
      return 'denied';
    }

    try {
      // Check current permission status
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setGeolocation(prev => ({ 
          ...prev, 
          permission: permission.state as 'granted' | 'denied' | 'prompt' 
        }));
        return permission.state;
      }

      // Fallback: try to get position once to check permission
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      
      setGeolocation(prev => ({ ...prev, permission: 'granted' }));
      return 'granted';
    } catch (error) {
      setGeolocation(prev => ({ ...prev, permission: 'denied' }));
      return 'denied';
    }
  }, []);

  // Start GPS tracking
  const startTracking = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setGeolocation(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by this browser',
        isTracking: false 
      }));
      return;
    }

    try {
      // Request permission first
      const permission = await requestPermission();
      if (permission === 'denied') {
        return;
      }

      // Start watching position
      watchIdRef.current = navigator.geolocation.watchPosition(
        updatePosition,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: maxAge
        }
      );

      // Also set up interval for regular updates
      intervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          updatePosition,
          handleError,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: maxAge
          }
        );
      }, updateInterval);

      setGeolocation(prev => ({ ...prev, isTracking: true, error: null }));

    } catch (error) {
      setGeolocation(prev => ({
        ...prev,
        error: 'Failed to start GPS tracking',
        isTracking: false
      }));
    }
  }, [requestPermission, updatePosition, handleError, updateInterval, maxAge]);

  // Stop GPS tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setGeolocation(prev => ({ ...prev, isTracking: false }));
    
    // Clear current building when tracking stops
    if (geofence.currentBuilding) {
      console.log(`Tracking stopped - exited ${geofence.currentBuilding.name}`);
      // TODO: Send exit event to backend
      // occupancyAPI.exitBuilding(geofence.currentBuilding.id, sessionId);
    }
    
    setGeofence(prev => ({
      ...prev,
      currentBuilding: null,
      insideGeofence: false
    }));
  }, [geofence.currentBuilding, sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Auto-stop tracking when campus changes
  useEffect(() => {
    if (geolocation.isTracking) {
      stopTracking();
    }
  }, [campus, stopTracking, geolocation.isTracking]);

  return {
    ...geolocation,
    ...geofence,
    startTracking,
    stopTracking,
    requestPermission,
    sessionId
  };
}
