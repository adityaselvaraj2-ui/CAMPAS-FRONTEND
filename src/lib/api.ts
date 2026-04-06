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

export async function submitFeedback(data: {
  campus: string;
  department: string;
  year: string;
  anonymous: boolean;
  building: string;
  mood: number;
  comment: string;
}) {
  const res = await fetchWithTimeout(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function sendChatMessage(message: string, campus: string): Promise<{ reply: string }> {
  const res = await fetchWithTimeout(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, campus }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}
