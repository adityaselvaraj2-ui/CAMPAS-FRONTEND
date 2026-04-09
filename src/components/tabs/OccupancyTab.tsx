import { useState, useEffect, useCallback } from 'react';
import { Campus, getBuildingStatus } from '../../data/campusData';
import { Users, TrendingUp, ChevronDown } from 'lucide-react';

interface OccupancyTabProps {
  campus: Campus;
}

function getTimeWeight(hour: number): number {
  if (hour < 6) return 0.02;
  if (hour < 8) return 0.15;
  if (hour < 10) return 0.7;
  if (hour < 12) return 0.85;
  if (hour < 14) return 0.95;
  if (hour < 16) return 0.75;
  if (hour < 18) return 0.5;
  if (hour < 20) return 0.25;
  return 0.05;
}

function getCrowdLabel(ratio: number): { label: string; color: string } {
  if (ratio < 0.3) return { label: 'QUIET', color: 'hsl(var(--aurora-3))' };
  if (ratio < 0.6) return { label: 'MODERATE', color: 'hsl(var(--solar))' };
  if (ratio < 0.85) return { label: 'BUSY', color: 'hsl(var(--nova))' };
  return { label: 'PACKED', color: 'hsl(var(--nova))' };
}

const OccupancyTab = ({ campus }: OccupancyTabProps) => {
  const [occupancy, setOccupancy] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hasCounted, setHasCounted] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('Detecting location...');

  // Generate unique ID for each visitor
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  };

  // Check if this visitor has been counted in the last 30 minutes
  const hasBeenCountedRecently = () => {
    const lastCounted = localStorage.getItem('lastCounted');
    if (!lastCounted) return false;
    
    const timeDiff = Date.now() - parseInt(lastCounted);
    return timeDiff < 30 * 60 * 1000; // 30 minutes
  };

  // Silent GPS detection - works automatically in background
  useEffect(() => {
    console.log('OccupancyTab mounted, starting GPS detection...');
    if (campus.buildings.length > 0) {
      // Force GPS detection immediately
      setTimeout(() => {
        console.log('Forcing GPS detection...');
        detectLocationAndCount();
      }, 1000); // 1 second delay
    }
  }, [campus]);

  // Also try GPS on every component update
  useEffect(() => {
    console.log('Component updated, checking GPS...');
    if (!hasCounted && campus.buildings.length > 0) {
      detectLocationAndCount();
    }
  }, [hasCounted, campus]);

  const detectLocationAndCount = async () => {
    console.log('🛰️ Starting GPS detection...');
    console.log('Geolocation available:', !!navigator.geolocation);
    
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      setGpsStatus('GPS not supported');
      fallbackCounting();
      return;
    }

    try {
      setGpsStatus('Getting location...');
      console.log('📍 Requesting GPS position...');
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Don't use cached position
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      console.log(`📍 Got position: ${latitude}, ${longitude} (accuracy: ±${accuracy}m)`);
      setGpsStatus(`Got location: ±${accuracy}m`);
      
      // Find which building user is in
      const building = findNearestBuilding(latitude, longitude);
      
      if (building) {
        console.log(`✅ Found building: ${building.name}`);
        // Count this visitor in the detected building
        await countVisitorInBuilding(building);
        setGpsStatus(`Detected: ${building.name}`);
        
        console.log(`Visitor counted in ${building.name} via GPS`);
        
        // Set up silent tracking for building changes
        setupSilentTracking();
      } else {
        console.log('❌ No building found within range');
        setGpsStatus('No building nearby');
        // User is not near any campus building
        fallbackCounting();
      }
      
    } catch (error: any) {
      console.error('❌ GPS error:', error);
      setGpsStatus(`GPS error: ${error.message}`);
      // GPS failed, use fallback
      fallbackCounting();
    }
  };

  const countVisitorInBuilding = async (building: any) => {
    const visitorId = getVisitorId();
    
    try {
      // Call backend to count this visitor (database should work now)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/occupancy/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: visitorId,
          buildingId: building.id,
          campus: campus.id.toUpperCase()
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Database response:', result);
        
        // Mark as counted
        localStorage.setItem('lastCounted', Date.now().toString());
        setHasCounted(true);
        setGpsStatus(`Counted in ${building.name}`);
        
        // Load updated occupancy from database
        loadExistingOccupancy();
        
        console.log(`Visitor counted in ${building.name} via database`);
      } else {
        console.log('Database failed, using local storage');
        // Fallback to local storage
        await countVisitorInLocalStorage(building);
      }
    } catch (error) {
      console.log('Backend error, using local storage');
      // Fallback to local storage
      await countVisitorInLocalStorage(building);
    }
  };

  const countVisitorInLocalStorage = async (building: any) => {
    // Local storage fallback
    const storageKey = `occupancy_${campus.id}`;
    let currentOccupancy = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    currentOccupancy[building.id] = (currentOccupancy[building.id] || 0) + 1;
    
    localStorage.setItem(storageKey, JSON.stringify(currentOccupancy));
    setOccupancy(currentOccupancy);
    setHasCounted(true);
    setGpsStatus(`Counted in ${building.name} (local)`);
    
    localStorage.setItem('lastCounted', Date.now().toString());
  };

  const loadExistingOccupancy = async () => {
    try {
      // Try database first (like feedback works)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/occupancy/current?campus=${campus.id.toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        setOccupancy(data.occupancy || {});
        setGpsStatus('Database loaded');
        console.log('Loaded from database:', data.occupancy);
      } else {
        // Fallback to local storage
        console.log('Database failed, using local storage');
        loadFromLocalStorage();
      }
    } catch (error) {
      // Fallback to local storage
      console.log('Database error, using local storage');
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const storageKey = `occupancy_${campus.id}`;
      const storedOccupancy = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setOccupancy(storedOccupancy);
      setGpsStatus('Local data loaded');
    } catch (error) {
      setOccupancy({});
      setGpsStatus('No data available');
    }
  };

  const findNearestBuilding = (lat: number, lon: number) => {
    let nearestBuilding = null;
    let minDistance = Infinity;
    
    for (const building of campus.buildings) {
      const distance = calculateDistance(lat, lon, building.lat, building.lng);
      if (distance < minDistance && distance <= 500) { // 500 meter radius (more reliable)
        minDistance = distance;
        nearestBuilding = building;
      }
    }
    
    console.log(`Nearest building: ${nearestBuilding?.name} at ${minDistance}m`);
    return nearestBuilding;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  };

  const setupSilentTracking = () => {
    // Watch for position changes every 30 seconds
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const building = findNearestBuilding(position.coords.latitude, position.coords.longitude);
        if (building) {
          setGpsStatus(`In: ${building.name}`);
        }
      },
      null, // Silent error handling
      {
        enableHighAccuracy: false, // Save battery
        timeout: 10000,
        maximumAge: 600000 // 10 minutes cache
      }
    );
  };

  const fallbackCounting = async () => {
    // Smart fallback based on time of day
    const hour = new Date().getHours();
    let targetBuilding;
    
    if (hour >= 9 && hour <= 12) {
      // Morning: Library or Admin Block
      targetBuilding = campus.buildings.find(b => b.id === 'library') || 
                      campus.buildings.find(b => b.id === 'admin_block');
    } else if (hour >= 12 && hour <= 14) {
      // Lunch: Canteen
      targetBuilding = campus.buildings.find(b => b.id === 'canteen');
    } else if (hour >= 14 && hour <= 17) {
      // Afternoon: Lab Block
      targetBuilding = campus.buildings.find(b => b.id === 'lab_block');
    } else {
      // Other times: Library
      targetBuilding = campus.buildings.find(b => b.id === 'library');
    }
    
    // Fallback to first building if specific one not found
    if (!targetBuilding) {
      targetBuilding = campus.buildings[0];
    }
    
    // Count via local storage
    await countVisitorInBuilding(targetBuilding);
    setGpsStatus(`Estimated: ${targetBuilding.name}`);
    
    console.log(`Visitor counted in ${targetBuilding.name} via smart fallback`);
  };

  const generate = useCallback(() => {
    // No fake data generation - return empty object
    return {};
  }, []);

  // Real-time data refresh every 30 seconds
  useEffect(() => {
    // Initial load
    if (campus.buildings.length > 0) {
      loadExistingOccupancy();
    }

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      if (campus.buildings.length > 0) {
        loadExistingOccupancy();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [campus]);

  // Sparkline data (24 hours)
  const getSparkline = useCallback((cap: number) => {
    const points: number[] = [];
    for (let h = 0; h < 24; h++) {
      points.push(Math.round(cap * getTimeWeight(h) * (0.6 + Math.random() * 0.4)));
    }
    return points;
  }, []);

  return (
    <div className="tab-enter max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Live Occupancy</h2>
          <p className="text-text-3 text-xs mt-1">{campus.shortName} · {gpsStatus}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-aurora-3 status-open" />
          <span className="font-mono text-xs text-text-3">LIVE</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campus.buildings.map((building, i) => {
          const count = occupancy[building.id] || 0;
          const cap = building.capacity || 100;
          const ratio = Math.min(count / cap, 1);
          const crowd = getCrowdLabel(ratio);
          const status = getBuildingStatus(building);
          const sparkline = getSparkline(cap);
          const maxSpark = Math.max(...sparkline, 1);
          const isExpanded = expanded === building.id;

          return (
            <div
              key={building.id}
              className="glass-card overflow-hidden animate-fade-up cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setExpanded(isExpanded ? null : building.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{building.icon}</span>
                    <div>
                      <h3 className="font-ui text-[10px] tracking-wider text-foreground">{building.name.toUpperCase()}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className={`w-2 h-2 rounded-full ${status.status === 'open' ? 'status-open' : status.status === 'closing' ? 'status-closing' : ''}`}
                          style={{
                            background: status.status === 'open' ? 'hsl(var(--aurora-3))' :
                                        status.status === 'closing' ? 'hsl(var(--solar))' : 'hsl(var(--nova))'
                          }}
                        />
                        <span className="text-[9px] text-text-3">{status.label}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Occupancy bar */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-depth overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${ratio * 100}%`,
                        background: ratio > 0.85 ? 'hsl(var(--nova))' :
                                    ratio > 0.6 ? 'hsl(var(--solar))' :
                                    ratio > 0.3 ? 'hsl(var(--aurora-1))' : 'hsl(var(--aurora-3))'
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-text-3" />
                    <span className="font-mono text-xs text-text-2">{count} / {cap}</span>
                  </div>
                  <span className="font-ui text-[9px] tracking-wider" style={{ color: crowd.color }}>
                    {crowd.label}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="mt-3 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-text-3" />
                  <svg viewBox="0 0 96 20" className="flex-1 h-5">
                    <polyline
                      fill="none"
                      stroke="hsl(var(--aurora-1))"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                      points={sparkline.map((v, i) => `${i * 4},${20 - (v / maxSpark) * 18}`).join(' ')}
                    />
                  </svg>
                  <span className="font-mono text-[8px] text-text-3">24h</span>
                </div>
              </div>

              {/* Expanded floor breakdown */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: isExpanded ? '300px' : '0',
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="font-ui text-[9px] tracking-widest text-text-3 mb-2">FLOOR BREAKDOWN</div>
                  {Array.from({ length: building.floors || 1 }, (_, f) => {
                    const floorCount = Math.round(count / (building.floors || 1) * (0.5 + Math.random()));
                    const floorCap = Math.round(cap / (building.floors || 1));
                    const floorRatio = Math.min(floorCount / floorCap, 1);
                    return (
                      <div key={f} className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-[9px] text-text-3 w-8">F{f}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-depth overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${floorRatio * 100}%`,
                              background: floorRatio > 0.7 ? 'hsl(var(--solar))' : 'hsl(var(--aurora-1))',
                              transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
                            }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-text-3 w-12 text-right">{floorCount}/{floorCap}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccupancyTab;
