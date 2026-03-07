# Quick Reference Card - API Caching & Rate Limiting

## 🔗 Import Paths

```javascript
// For component hooks
import { useBackendAPI } from "@/lib/api/backend-api";

// For async functions
import { FetchBackendAPI, getAllUsers, getAllTournaments } from "@/lib/api/backend-api";

// For rate limiting utilities
import { checkRateLimit, clearRateLimit } from "@/lib/utils/rate-limiter";

// For context (advanced)
import { APICacheContext } from "@/lib/contexts/api-cache-context";
import { use } from "react";
```

---

## 🎣 Hook Usage

### Basic Example
```jsx
const { result, isLoading, error, refresh } = useBackendAPI("users/all");
```

### With Options
```jsx
const { result, isLoading, error, mutate, refresh } = useBackendAPI(
  "users/all",
  "GET",
  null,
  { 
    skipCache: false,  // Skip caching for this request
    onError: (err) => console.error(err)  // Error callback
  }
);
```

### Full Component Example
```jsx
'use client';
import { useBackendAPI } from "@/lib/api/backend-api";

export default function UsersList() {
  const { result: users, isLoading, error, refresh } = useBackendAPI("users/all");

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

---

## ⚡ Function Usage

### Basic Example
```javascript
const result = await FetchBackendAPI("users/all", { method: "GET" });
```

### With Options
```javascript
const result = await FetchBackendAPI("users/all", {
  method: "GET",
  skipCache: true,  // Force fresh data
  timeout: 15000    // Custom timeout
});
```

### Error Handling
```javascript
const result = await FetchBackendAPI("users/all");

if (result.ok) {
  console.log(result.data);      // ✅ Success
} else {
  console.error(result.error);   // ❌ Error message
  console.log(result.status);    // Status code (429, 500, etc.)
}
```

---

## 🔐 Rate Limit Handling

### Check Rate Limit
```javascript
import { checkRateLimit } from "@/lib/utils/rate-limiter";

const limit = checkRateLimit("users/all");

if (!limit.allowed) {
  console.log(`Rate limited. Retry after ${limit.retryAfter}ms`);
  console.log(`Reset time: ${new Date(limit.resetTime).toLocaleTimeString()}`);
  console.log(`Remaining: ${limit.remaining} / 5 requests`);
}
```

### Response Structure
```javascript
{
  allowed: boolean,        // Is request allowed?
  remaining: number,       // Requests left in window
  resetTime: number,       // When window resets (timestamp)
  retryAfter: number       // Milliseconds to wait before retry
}
```

---

## 💾 Cache Management

### Clear Specific Cache
```javascript
import { use } from "react";
import { APICacheContext } from "@/lib/contexts/api-cache-context";

const cacheContext = use(APICacheContext);

// Clear specific endpoint cache
cacheContext.clearCache("http://api.example.com/users/all|GET");
```

### Clear All Cache
```javascript
cacheContext.clearCache();  // No parameter = clear all
```

### Direct Cache Access
```javascript
// Get cached value
const cached = cacheContext.getCache(cacheKey);

// Set cache with TTL
cacheContext.setCache(cacheKey, data, 300000);  // 5 minutes
```

---

## 🔧 Configuration Quick Links

### Cache TTL (Default 5 minutes)
**File:** `src/lib/api/backend-api.jsx` (line ~130)
```javascript
cacheContext.setCache(cacheKey, response.data, 300000); // Change this
```

### Rate Limits
**File:** `src/lib/utils/rate-limiter.js`
```javascript
const ENDPOINT_RATE_LIMITS = {
  "users/all": { maxRequests: 5, windowMs: 60000 },
  // Add/edit here
};
```

---

## 📊 Return Values

### useBackendAPI Hook
```javascript
{
  result,      // Data returned (null if loading/error)
  isLoading,   // true = fetching
  error,       // { status, message } or null
  mutate,      // Alias for refresh
  refresh,     // Manual refresh function
  isEmpty,     // !result
  isError      // !!error
}
```

### FetchBackendAPI Function
```javascript
// Success
{
  ok: true,
  data: {...},           // Response data
  status: 200
}

// Error
{
  ok: false,
  error: "Rate limit exceeded",
  status: 429           // HTTP status code
}
```

### Rate Limit Check
```javascript
{
  allowed: true/false,  // Is request allowed?
  remaining: number,    // Requests left
  resetTime: number,    // Milliseconds until reset
  retryAfter: 0         // Wait time if rate limited
}
```

---

## 🔄 Existing API Functions (Unchanged)

All these functions work exactly as before, but now with built-in caching and rate limiting:

```javascript
// User APIs
getAllUsers()
getUsersByIds(userIds)
resetPassword(payload)
confirmPasswordReset(payload)

// Tournament APIs
getAllTournaments()
getUpcomingTournament()
updateTournament(updateData)
deleteTournamentById(tournamentId)
getTournamentByIds(tournamentIds)

// Leaderboard APIs
joinTournament(form)
getUserTournamentDetails(userId)
getJoinersByTournamentId(tournamentId)
getJoinersByTournamentIdList(tournamentIds)
getTopNLeaderboard(tournamentId, n)
approveParticipantForTournament(participantId)
updateParticipantTournamentStatus(participantId, updateData)
getAllLeaderBoard()

// Review APIs
getAllReviews()
getReviewsByTournamentId(tournamentId)
getReviewsByUserId(userId)
addNewReview(review)
deleteReview(reviewId)
addAdminReply(row)
```

---

## 🚨 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| **200** | Success | ✅ Use the data |
| **401** | Unauthorized | 🔐 User needs to login |
| **403** | Forbidden | ❌ User lacks permission |
| **404** | Not Found | ❌ Resource doesn't exist |
| **429** | Rate Limited | ⏱️ Wait & retry later |
| **500** | Server Error | 🔴 Server issue, retry |

---

## 🎯 Common Patterns

### Pattern 1: Load with Fallback
```jsx
const { result, error } = useBackendAPI("users/all");
const users = result || [];

return (
  <ul>
    {users.length === 0 ? (
      <li>No users found</li>
    ) : (
      users.map(u => <li key={u.id}>{u.name}</li>)
    )}
  </ul>
);
```

### Pattern 2: Refresh on Action
```jsx
const { result, refresh } = useBackendAPI("users/all");

const handleAdd = async (user) => {
  await addNewUser(user);
  refresh();  // Update list after adding
};
```

### Pattern 3: Handle Rate Limiting
```jsx
const result = await FetchBackendAPI("users/all");

if (result.status === 429) {
  alert("Too many requests. Please wait a moment.");
  console.log("Retry after this much time:", result.error);
}
```

### Pattern 4: Skip Cache for Real-Time Data
```jsx
const { result } = useBackendAPI("leaderboard/all", "GET", null, {
  skipCache: true  // Always fresh
});
```

---

## 🧹 Cleanup

### On Component Unmount
Cache is automatically maintained. No manual cleanup needed.

### On User Logout
Automatically cleared:
```javascript
// In logout function (already implemented)
localStorage.removeItem("api_cache");
clearRateLimit();
```

### Manual Cleanup
```javascript
import { clearRateLimit } from "@/lib/utils/rate-limiter";

clearRateLimit();              // Clear all rate limits
clearRateLimit("users/all");   // Clear specific endpoint
```

---

## 📱 Browser DevTools

### Inspect Cache
```javascript
// In console:
JSON.parse(localStorage.getItem("api_cache"))
```

### Inspect Rate Limits
```javascript
// In console:
Object.entries(localStorage)
  .filter(([k]) => k.includes("api_rate_limits"))
  .map(([k, v]) => ({ [k]: JSON.parse(v) }))
```

### Clear Everything
```javascript
// In console:
localStorage.clear()
```

---

## 🔗 Links

- 📖 [Full Documentation](./API_CACHING_RATE_LIMITING.md)
- 📋 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- 📁 Cache Context: `src/lib/contexts/api-cache-context.jsx`
- 📁 Rate Limiter: `src/lib/utils/rate-limiter.js`
- 📁 Backend API: `src/lib/api/backend-api.jsx`

---

**Last Updated:** March 5, 2026
**Version:** 1.0.0
