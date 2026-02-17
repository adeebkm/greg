// Vercel serverless function for tracking events to MongoDB
import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONGODB_URI = 'mongodb+srv://estatedeliuser:estatedeli12345@cluster0.xwvmm93.mongodb.net/';
const DB_NAME = 'googlesim';
const COLLECTION_NAME = 'tracking_events';

// Handle CORS preflight
if (typeof process !== 'undefined' && process.env) {
  // Running in Node.js environment
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const event = req.body;

    // Validate required fields
    if (!event.eventType || !event.persona) {
      console.error('Missing required fields:', { eventType: event.eventType, persona: event.persona });
      return res.status(400).json({ error: 'Missing required fields', received: event });
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Prepare document for insertion
      const document = {
        ...event,
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
        createdAt: new Date(),
      };

      // Insert the event
      const result = await collection.insertOne(document);
      console.log('Event inserted:', result.insertedId);

      return res.status(200).json({ success: true, insertedId: result.insertedId });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    } finally {
      await client.close();
    }
  } catch (error: any) {
    console.error('Tracking error:', error);
    // Return error details for debugging
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Tracking failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
