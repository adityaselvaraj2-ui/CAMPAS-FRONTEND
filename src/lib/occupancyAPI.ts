const BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://campass-backend-c82n.onrender.com/api' 
    : 'http://localhost:5000/api');

// Helper function with timeout and retry
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (i === retries) throw error;
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

interface CheckinData {
  sessionId: string;
  buildingId: string;
  action: 'enter' | 'exit';
  campus: string;
}

interface BatchCheckinData {
  sessionId: string;
  fromBuilding?: string;
  toBuilding?: string;
  campus: string;
}

interface CheckinResponse {
  success: boolean;
  action?: 'entered' | 'exited';
  buildingId?: string;
  previousBuilding?: string;
  error?: string;
}

interface BatchResponse {
  success: boolean;
  results: CheckinResponse[];
}

interface CurrentOccupancy {
  [buildingId: string]: {
    count: number;
    lastUpdated: string;
  };
}

interface CurrentOccupancyResponse {
  campus: string;
  occupancy: CurrentOccupancy;
  timestamp: string;
  activeSessions: number;
}

interface HistoryRecord {
  building_id: string;
  count: number;
  timestamp: string;
  campus_id: string;
}

interface HistoryResponse {
  campus: string;
  buildingId: string;
  hours: number;
  history: HistoryRecord[];
  timestamp: string;
}

interface StatsResponse {
  campus: string;
  totalOccupancy: number;
  activeSessions: number;
  peakCount: number;
  peakBuilding: string;
  buildingCount: number;
  timestamp: string;
}

// Occupancy API functions
export const occupancyAPI = {
  // Check in/out of a building
  async checkin(data: CheckinData): Promise<CheckinResponse> {
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Checkin request failed');
    return res.json();
  },

  // Batch update for building changes
  async batchCheckin(data: BatchCheckinData): Promise<BatchResponse> {
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Batch checkin request failed');
    return res.json();
  },

  // Get current occupancy for all buildings
  async getCurrentOccupancy(campus: string): Promise<CurrentOccupancyResponse> {
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/current?campus=${encodeURIComponent(campus)}`, {});
    if (!res.ok) throw new Error('Failed to fetch current occupancy');
    return res.json();
  },

  // Get historical occupancy data
  async getHistory(campus: string, buildingId?: string, hours: number = 24): Promise<HistoryResponse> {
    const params = new URLSearchParams({
      campus,
      hours: hours.toString(),
    });
    if (buildingId) {
      params.append('buildingId', buildingId);
    }
    
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/history?${params}`, {});
    if (!res.ok) throw new Error('Failed to fetch history data');
    return res.json();
  },

  // Get occupancy statistics
  async getStats(campus: string): Promise<StatsResponse> {
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/stats?campus=${encodeURIComponent(campus)}`, {});
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // End a session
  async endSession(sessionId: string, campus: string): Promise<{ success: boolean; message: string }> {
    const res = await fetchWithTimeout(`${BASE_URL}/occupancy/session/${sessionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campus }),
    });
    if (!res.ok) throw new Error('Failed to end session');
    return res.json();
  }
};

// Helper functions for common operations
export const occupancyHelpers = {
  // Enter a building
  async enterBuilding(sessionId: string, buildingId: string, campus: string): Promise<CheckinResponse> {
    return occupancyAPI.checkin({
      sessionId,
      buildingId,
      action: 'enter',
      campus
    });
  },

  // Exit a building
  async exitBuilding(sessionId: string, buildingId: string, campus: string): Promise<CheckinResponse> {
    return occupancyAPI.checkin({
      sessionId,
      buildingId,
      action: 'exit',
      campus
    });
  },

  // Move between buildings
  async moveBetweenBuildings(
    sessionId: string, 
    fromBuilding: string, 
    toBuilding: string, 
    campus: string
  ): Promise<BatchResponse> {
    return occupancyAPI.batchCheckin({
      sessionId,
      fromBuilding,
      toBuilding,
      campus
    });
  },

  // Get building capacity percentage
  getCapacityPercentage(current: number, capacity: number): number {
    if (!capacity || capacity <= 0) return 0;
    return Math.round((current / capacity) * 100);
  },

  // Get crowd level based on percentage
  getCrowdLevel(percentage: number): { level: string; color: string; label: string } {
    if (percentage < 30) {
      return { level: 'low', color: 'hsl(var(--aurora-3))', label: 'QUIET' };
    } else if (percentage < 60) {
      return { level: 'moderate', color: 'hsl(var(--solar))', label: 'MODERATE' };
    } else if (percentage < 85) {
      return { level: 'high', color: 'hsl(var(--nova))', label: 'BUSY' };
    } else {
      return { level: 'critical', color: 'hsl(var(--nova))', label: 'PACKED' };
    }
  },

  // Format last updated time
  formatLastUpdated(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
};

export default occupancyAPI;
