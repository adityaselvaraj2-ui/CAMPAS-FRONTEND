const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function submitFeedback(data: {
  campus: string;
  department: string;
  year: string;
  anonymous: boolean;
  building: string;
  mood: number;
  comment: string;
}) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function sendChatMessage(message: string, campus: string): Promise<{ reply: string }> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, campus }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}
