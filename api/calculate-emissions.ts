import type { VercelRequest, VercelResponse } from '@vercel/node';

// n8n webhook URL
const N8N_WEBHOOK_URL = "https://dgledhill.app.n8n.cloud/webhook/50b6281b-c102-4135-90e4-c81d725e6f7f";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the raw body
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks);

    // Forward the request to n8n with original content-type (for multipart form data)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      },
      body: rawBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n error:', response.status, errorText);
      return res.status(response.status).json({
        error: `n8n returned error: ${response.status}`,
        details: errorText.substring(0, 500)
      });
    }

    const responseText = await response.text();

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      return res.status(200).json(data);
    } catch {
      // Return as text if not JSON
      return res.status(200).send(responseText);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Failed to connect to calculator service',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads
  },
};
