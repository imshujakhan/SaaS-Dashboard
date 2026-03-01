// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Simple cache storage
const cacheStorage = new Map();

// Save data to cache
export function saveToCache(key, data) {
  cacheStorage.set(key, {
    data: data,
    savedAt: Date.now()
  });
}

// Get data from cache
export function getFromCache(key) {
  const cached = cacheStorage.get(key);
  
  // No data found
  if (!cached) {
    return null;
  }
  
  // Check if cache expired
  const now = Date.now();
  const cacheAge = now - cached.savedAt;
  
  if (cacheAge > CACHE_DURATION) {
    cacheStorage.delete(key);
    return null;
  }
  
  return cached.data;
}

// Clear all cache
export function clearCache() {
  cacheStorage.clear();
}

// Delete specific cache
export function deleteCache(key) {
  cacheStorage.delete(key);
}
