# Debugging MongoDB Tracking

## Quick Test

1. **Test MongoDB Connection:**
   Visit: `https://your-domain.vercel.app/api/test-mongodb`
   This will:
   - Test the MongoDB connection
   - Insert a test document
   - Show total document count
   - Display recent events

2. **Check Browser Console:**
   Open browser DevTools and look for:
   - `✅ Event tracked successfully:` - Events are being sent
   - `❌ Failed to track event:` - API errors
   - `❌ Tracking error:` - Network/connection errors

3. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to "Functions" tab
   - Click on `api/track` function
   - View real-time logs

## Common Issues

### Issue 1: Events not reaching API
**Symptoms:** No logs in Vercel, 404 errors in browser
**Solution:** 
- Ensure you're on the deployed Vercel URL (not localhost)
- Check that `api/track.ts` exists in the root `api/` folder
- Verify the function is deployed (check Vercel dashboard)

### Issue 2: MongoDB connection fails
**Symptoms:** 500 errors, connection timeout in logs
**Solution:**
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
- Test connection with `/api/test-mongodb` endpoint

### Issue 3: Events sent but not saved
**Symptoms:** 200 responses but empty database
**Solution:**
- Check Vercel logs for insertion errors
- Verify database name: `googlesim`
- Verify collection name: `tracking_events`
- Check MongoDB Atlas to ensure database exists

### Issue 4: CORS errors
**Symptoms:** CORS errors in browser console
**Solution:**
- Already handled in code, but verify CORS headers are set

## Manual Test

1. Open browser console on your deployed site
2. Click on a search result
3. Look for console logs:
   ```
   Sending tracking event: {...}
   ✅ Event tracked successfully: {...}
   ```
4. If you see errors, check the error message

## Verify in MongoDB

```javascript
// Connect to MongoDB
use googlesim

// Count all events
db.tracking_events.countDocuments()

// View recent events
db.tracking_events.find().sort({createdAt: -1}).limit(10).pretty()

// View events by persona
db.tracking_events.find({persona: "greg"}).count()

// View events by type
db.tracking_events.aggregate([
  {$group: {_id: "$eventType", count: {$sum: 1}}}
])
```

## Next Steps

If events still aren't appearing:
1. Check Vercel function logs for specific errors
2. Test MongoDB connection with `/api/test-mongodb`
3. Verify the MongoDB URI is accessible
4. Check if there are any network restrictions
