/**
 * User-scoped store utilities.
 * Ensures each user's data (API key, progress, chat) is isolated in localStorage.
 */

// Keys that contain user-specific data and must be cleared on logout / switch
const USER_STORE_KEYS = [
  'drum-tutor-user',    // progress, exercise results, skill profile
  'drum-tutor-ai',      // Anthropic API key, chat messages
]

// The current user ID for namespacing
let _currentUserId: string | null = null

export function getCurrentUserId(): string | null {
  return _currentUserId
}

/**
 * Called on login/register — loads user-namespaced stores.
 * Copies data from `drum-tutor-user:{userId}` → `drum-tutor-user` (the active key).
 */
export function initUserStores(userId: string): void {
  _currentUserId = userId
  localStorage.setItem('drum-tutor-current-user', userId)

  for (const baseKey of USER_STORE_KEYS) {
    const userKey = `${baseKey}:${userId}`
    const saved = localStorage.getItem(userKey)
    if (saved) {
      // Load this user's data into the active store key
      localStorage.setItem(baseKey, saved)
    } else {
      // No data for this user yet — clear the active key so they start fresh
      localStorage.removeItem(baseKey)
    }
  }
}

/**
 * Called on logout — saves current stores to user-namespaced keys, then clears active keys.
 */
export function clearUserStores(): void {
  const userId = _currentUserId || localStorage.getItem('drum-tutor-current-user')

  // Save current data to user-namespaced keys before clearing
  if (userId) {
    for (const baseKey of USER_STORE_KEYS) {
      const current = localStorage.getItem(baseKey)
      if (current) {
        localStorage.setItem(`${baseKey}:${userId}`, current)
      }
    }
  }

  // Clear active (non-namespaced) keys
  for (const baseKey of USER_STORE_KEYS) {
    localStorage.removeItem(baseKey)
  }

  localStorage.removeItem('drum-tutor-current-user')
  _currentUserId = null
}

/**
 * Persist current stores to user namespace.
 * Called on beforeunload and periodically.
 */
export function saveUserStores(): void {
  const userId = _currentUserId
  if (!userId) return

  for (const baseKey of USER_STORE_KEYS) {
    const current = localStorage.getItem(baseKey)
    if (current) {
      localStorage.setItem(`${baseKey}:${userId}`, current)
    }
  }
}

// Auto-save on page close
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', saveUserStores)
  // Also save periodically (every 30s)
  setInterval(saveUserStores, 30000)
}
