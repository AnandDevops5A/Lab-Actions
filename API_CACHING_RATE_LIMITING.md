# API Caching and Rate Limiting Guide

## Overview

The application now uses a **context-based caching system** with **localStorage-based rate limiting** instead of Redis. This provides:

- ✅ **No Redis dependency** - Uses React Context for in-memory caching
- ✅ **Automatic cache persistence** - Cache is persisted to localStorage
- ✅ **Rate limiting** - Prevents API abuse using localStorage timestamps
- ✅ **Smart refresh** - Cache is cleared on page reload/refresh
- ✅ **Configurable TTLs** - Per-endpoint cache expiration settings

---

## Architecture

### 1. **APICacheContext** (`src/lib/contexts/api-cache-context.jsx`)

Manages:
- API response caching with TTL (Time To Live)
- Cache persistence to localStorage
- Automatic cache cleanup

**Key Features:**
- In-memory cache using React Map
- localStorage fallback for persistence
- Automatic TTL expiration
- No Redis dependency

### 2. **Rate Limiter Utility** (`src/lib/utils/rate-limiter.js`)

Independent rate limiting using localStorage:
- Per-endpoint request tracking
- Configurable limits and time windows
- Works both in components and async functions
- No context dependency required

### 3. **Backend API Module** (`src/lib/api/backend-api.jsx`)

Updated to:
- Use context-based caching (in components)
- Use standalone rate limiting (all contexts)
- Clear cache on page refresh
- Provide both hook and function-based APIs

**Key Exports:**
- `useBackendAPI()` - React hook for API calls (with caching)
- `FetchBackendAPI()` - Async function for API calls (with rate limiting)
- All existing API functions (unchanged interface)

---

## Configuration

### Rate Limiting Settings

**Global Default** (`src/lib/utils/rate-limiter.js`):
```javascript
DEFAULT_RATE_LIMIT = {
  maxRequests: 10,      // Max 10 requests
  windowMs: 60000,      // Per 1 minute
}
```

**Per-Endpoint Limits** in `src/lib/utils/rate-limiter.js`:
```javascript
const ENDPOINT_RATE_LIMITS = {
  "users/all": { maxRequests: 5, windowMs: 60000 },
  "tournament/all": { maxRequests: 5, windowMs: 60000 },
  "leaderboard/all": { maxRequests: 5, windowMs: 60000 },
  // Add more endpoints as needed
};
```

**How to customize:**
1. Edit the constants in `src/lib/utils/rate-limiter.js`
2. Changes apply automatically to all API calls
3. Endpoints not listed use DEFAULT_RATE_LIMIT

### Cache TTL Settings

Default cache TTL per endpoint: **5 minutes (300,000ms)**

Modify in `backend-api.jsx` line ~130:
```javascript
cacheContext.setCache(cacheKey, response.data, 300000); // Change this value
```

---

## Usage Examples

### Using the Hook (Recommended)

```jsx
'use client';
import { useBackendAPI } from "@/lib/api/backend-api";

export default function MyComponent() {
  const { 
    result: users, 
    isLoading, 
    error, 
    refresh // Manually refresh data
  } = useBackendAPI("users/all", "GET");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh Data</button>
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

### Using Async Function

```jsx
import { FetchBackendAPI } from "@/lib/api/backend-api";

async function fetchData() {
  const result = await FetchBackendAPI("users/all", {
    method: "GET"
  });

  if (result.ok) {
    console.log(result.data); // Your data
  } else {
    console.error(result.error); // Error message
  }
}
```

### Skip Cache for Specific Requests

```jsx
// Using hook
const { result } = useBackendAPI("users/all", "GET", null, {
  skipCache: true  // Bypass cache for this request
});

// Using function
const result = await FetchBackendAPI("users/all", {
  method: "GET",
  skipCache: true
});
```

### Handle Rate Limit Errors

```jsx
const { error } = useBackendAPI("users/all", "GET");

if (error?.status === 429) {
  console.error("Rate limited:", error.message);
  // Offer user to retry later
}
```

---

## Behavior Details

### On Page Refresh
1. User refreshes the page
2. `beforeunload` event triggers
3. Cache is automatically cleared via `clearCache()`
4. On reload, fresh data is fetched from the server

### Rate Limiting
1. Each endpoint has a configurable limit (requests per time window)
2. Timestamps of requests are stored in localStorage
3. When limit is exceeded:
   - Returns cached data if available
   - Otherwise returns 429 status error
   - Provides `retryAfter` time in milliseconds

### Cache Expiration
1. Cache entries have TTL (default 5 minutes)
2. Expired entries are automatically removed
3. GET requests are cached, POST/PUT/DELETE are not

### On User Logout
1. Cache is automatically cleared
2. Rate limit data is cleared from localStorage
3. User data is removed from secure cookies

---

## StorageKeys

### Cache Storage
```
localStorage["api_cache"] = JSON.stringified map of all cached responses
Format: {
  "http://api.example.com/users/all|GET": {
    data: {...},
    expiresAt: timestamp
  }
}
```

### Rate Limit Storage
```
localStorage["api_rate_limits:endpoint_name"] = {
  timestamps: [array of request timestamps],
  windowStart: timestamp when current window started
}
```

Example:
```
localStorage["api_rate_limits:users/all"] = {
  timestamps: [1709634000000, 1709634001000, ...],
  windowStart: 1709634000000
}
```

---

## Migration from Old Code

### Old SWRBackendAPI (Removed)
```javascript
// ❌ NO LONGER AVAILABLE
const { result, error, isLoading, mutate } = SWRBackendAPI(...);
```

### New useBackendAPI (Use Instead)
```javascript
// ✅ NEW RECOMMENDED APPROACH
const { result, error, isLoading, mutate, refresh } = useBackendAPI(...);
```

**Compatibility Note:** All existing API functions remain unchanged:
```javascript
// ✅ These still work exactly the same
getAllUsers()
getAllTournaments()
joinTournament()
// ... etc
```

---

## Performance Considerations

### Memory Impact
- **Pros:** 
  - No external Redis server needed
  - Reduces backend load
  - Instant cache hits
  
- **Cons:**
  - Cache is per-browser (not shared)
  - Limited by localStorage size (~5-10MB)

### Recommendations
1. Use `skipCache: true` for real-time critical data
2. Adjust TTL based on data freshness requirements
3. Monitor localStorage size for memory-heavy applications
4. Use stricter rate limits for expensive operations

---

## Troubleshooting

### Cache not clearing after page refresh?
**Solution:** Verify APICacheProvider is wrapping your component in layout.jsx

### Rate limit errors appearing too often?
**Solution:** Increase `maxRequests` or `windowMs` in `ENDPOINT_RATE_LIMITS`

### Data seems stale?
**Solution:** Call `refresh()` method or reduce TTL value

### localStorage quota exceeded?
**Solution:** 
1. Reduce cache TTL
2. Clear cache more frequently
3. Use `skipCache: true` for non-essential data

### Context not available error?
**Solution:** Ensure APICacheProvider wraps the component in the component tree

---

## Best Practices

1. **Use hooks for components:** Simpler state management
2. **Use functions for non-component code:** Unlike hooks
3. **Cache strategically:** Don't cache frequently changing data
4. **Adjust rate limits:** Based on actual usage patterns
5. **Clear on logout:** Prevents data leaks (automatic)
6. **Test rate limiting:** Enable console debug logs to verify
7. **Monitor performance:** Check Network tab for cache hits

---

## Environment Variables

No new environment variables needed. Existing variables work:
- `NEXT_PUBLIC_API_URL` or `BACKEND_URL` - API base URL

---

## Future Enhancements

Potential improvements:
- [ ] IndexedDB for larger cache storage
- [ ] Service Worker caching
- [ ] Cache invalidation strategies
- [ ] API endpoint statistics/metrics
- [ ] Compression for cached data
- [ ] Selective per-request rate limits

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify APICacheProvider is in layout.jsx
3. Check browser console for error logs
4. Inspect localStorage for cache data
