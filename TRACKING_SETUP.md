# MongoDB Tracking Setup

## Current Status
✅ Tracking code is implemented
⚠️ API endpoint only works when deployed to Vercel (not in local development)

## How It Works

1. **Frontend Tracking** (`src/utils/tracking.ts`)
   - Captures user interactions (clicks, searches, pagination, etc.)
   - Sends events to `/api/track` endpoint

2. **API Endpoint** (`api/track.ts`)
   - Vercel serverless function
   - Receives tracking events
   - Connects to MongoDB and stores events

3. **MongoDB Storage**
   - Database: `googlesim`
   - Collection: `tracking_events`
   - Connection: Set via `MONGODB_URI` environment variable in Vercel

## Testing

### In Development (Local)
The API endpoint won't work locally because Vite doesn't run serverless functions. You'll see errors in the console like:
```
Failed to track event: 404 Not Found
```

### In Production (Vercel)
1. Deploy to Vercel
2. The API endpoint will be available at: `https://your-domain.vercel.app/api/track`
3. Check browser console for tracking logs
4. Verify events in MongoDB:
   ```javascript
   // In MongoDB Compass or shell
   use googlesim
   db.tracking_events.find().sort({createdAt: -1}).limit(10)
   ```

## Troubleshooting

### Events not appearing in MongoDB?

1. **Check browser console** - Look for tracking errors
2. **Check Vercel function logs** - Go to Vercel dashboard > Functions > track
3. **Verify MongoDB connection** - Test the connection string
4. **Check CORS** - Make sure CORS headers are set correctly
5. **Verify API route** - Ensure `api/track.ts` is in the root `api/` folder

### Common Issues

- **404 errors**: API route not found (only works on Vercel)
- **500 errors**: MongoDB connection issue or invalid data
- **CORS errors**: Check CORS headers in `api/track.ts`

## Event Structure

Each tracking event contains:
```typescript
{
  eventType: 'click' | 'search' | 'page_view' | 'tab_change' | 'pagination',
  elementType: string,
  elementId?: string,
  elementText?: string,
  platform?: string,
  persona: string,
  timestamp: string (ISO format),
  sessionId: string,
  page?: number,
  tab?: string,
  searchQuery?: string,
  createdAt: Date
}
```
