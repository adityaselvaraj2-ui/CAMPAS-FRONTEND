import { useState, useEffect } from 'react';
import { MapPin, Navigation, Battery, Wifi, WifiOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useGeofence } from '../hooks/useGeofence';
import { Campus } from '../data/campusData';

interface GeofenceWidgetProps {
  campus: Campus | null;
  onBuildingChange?: (building: any) => void;
}

const GeofenceWidget = ({ campus, onBuildingChange }: GeofenceWidgetProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const geofence = useGeofence(campus, {
    radius: 50, // 50 meters
    updateInterval: 15000, // 15 seconds
    maxAge: 30000 // 30 seconds
  });

  // Get battery level for optimization
  useEffect(() => {
    const getBatteryLevel = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
        } catch (error) {
          console.log('Battery API not available');
        }
      }
    };

    getBatteryLevel();
  }, []);

  // Handle building changes
  useEffect(() => {
    if (onBuildingChange && geofence.currentBuilding) {
      onBuildingChange({
        building: geofence.currentBuilding,
        sessionId: geofence.sessionId,
        timestamp: Date.now()
      });
    }
  }, [geofence.currentBuilding, geofence.sessionId, onBuildingChange]);

  // Get status color
  const getStatusColor = () => {
    if (geofence.error) return 'text-red-400';
    if (geofence.isTracking && geofence.insideGeofence) return 'text-green-400';
    if (geofence.isTracking) return 'text-blue-400';
    return 'text-muted-foreground';
  };

  // Get status icon
  const getStatusIcon = () => {
    if (geofence.error) return <AlertCircle className="w-4 h-4" />;
    if (geofence.isTracking && geofence.insideGeofence) return <CheckCircle className="w-4 h-4" />;
    if (geofence.isTracking) return <Navigation className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  // Get status text
  const getStatusText = () => {
    if (geofence.error) return geofence.error;
    if (geofence.isTracking && geofence.currentBuilding) {
      return `Inside ${geofence.currentBuilding.name}`;
    }
    if (geofence.isTracking) return 'Tracking location...';
    if (geofence.permission === 'denied') return 'Location permission denied';
    if (geofence.permission === 'unsupported') return 'Location not supported';
    return 'Location tracking disabled';
  };

  // Check if should show battery warning
  const shouldShowBatteryWarning = () => {
    return batteryLevel !== null && batteryLevel < 20 && geofence.isTracking;
  };

  // Handle start/stop tracking
  const handleToggleTracking = async () => {
    if (geofence.isTracking) {
      geofence.stopTracking();
    } else {
      await geofence.startTracking();
    }
  };

  if (!campus) {
    return (
      <div className="glass-card p-4 text-center">
        <MapPin className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select a campus to enable location tracking</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-background/50 ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">Auto Check-In</h3>
            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
          </div>
        </div>
        
        <button
          onClick={handleToggleTracking}
          disabled={geofence.permission === 'denied' || geofence.permission === 'unsupported'}
          className={`px-3 py-2 rounded-lg text-xs font-ui tracking-wider transition-all ${
            geofence.isTracking
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
          } ${
            geofence.permission === 'denied' || geofence.permission === 'unsupported'
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {geofence.isTracking ? 'STOP' : 'START'}
        </button>
      </div>

      {/* Battery Warning */}
      {shouldShowBatteryWarning() && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <Battery className="w-4 h-4 text-yellow-400" />
          <p className="text-xs text-yellow-400">
            Low battery ({batteryLevel}%). Tracking may drain battery faster.
          </p>
        </div>
      )}

      {/* Current Location Info */}
      {geofence.isTracking && (
        <div className="space-y-2">
          {geofence.currentBuilding ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {geofence.currentBuilding.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {geofence.currentBuilding.description}
              </p>
              {geofence.accuracy && (
                <p className="text-xs text-muted-foreground mt-1">
                  GPS Accuracy: ±{Math.round(geofence.accuracy)}m
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Outside campus buildings
                </span>
              </div>
              {geofence.accuracy && (
                <p className="text-xs text-muted-foreground mt-1">
                  GPS Accuracy: ±{Math.round(geofence.accuracy)}m
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Permission Issues */}
      {geofence.permission === 'denied' && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Location Permission Denied</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Location access is required for automatic check-in. Please enable location permissions in your browser settings.
          </p>
          <button
            onClick={() => window.open('https://support.google.com/chrome/answer/142065', '_blank')}
            className="text-xs text-primary hover:underline"
          >
            Learn how to enable location
          </button>
        </div>
      )}

      {/* Toggle Details */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        
        {geofence.isTracking && (
          <div className="flex items-center gap-1">
            {geofence.latitude && geofence.longitude ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {geofence.lastCheck ? `Updated ${Math.round((Date.now() - geofence.lastCheck) / 1000)}s ago` : 'Waiting...'}
            </span>
          </div>
        )}
      </div>

      {/* Detailed Info */}
      {showDetails && (
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Session ID:</span>
              <p className="font-mono text-xs break-all">{geofence.sessionId}</p>
            </div>
            <div>
              <span className="font-medium">Campus:</span>
              <p>{campus.name}</p>
            </div>
          </div>
          
          {geofence.latitude && geofence.longitude && (
            <div>
              <span className="font-medium">Coordinates:</span>
              <p className="font-mono">
                {geofence.latitude.toFixed(6)}, {geofence.longitude.toFixed(6)}
              </p>
            </div>
          )}
          
          <div>
            <span className="font-medium">Geofence Radius:</span>
            <p>50 meters from building center</p>
          </div>
          
          <div>
            <span className="font-medium">Update Interval:</span>
            <p>Every 15 seconds</p>
          </div>

          {geofence.previousBuilding && (
            <div>
              <span className="font-medium">Previous Location:</span>
              <p>{geofence.previousBuilding.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeofenceWidget;
