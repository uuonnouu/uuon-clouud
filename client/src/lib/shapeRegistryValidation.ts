export function clearRegistrationCache(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('shapes_registered');
    localStorage.removeItem('registration_timestamp');
    console.log('🧹 Registration cache cleared');
  } else {
    console.log('🧹 Registration cache clear skipped - no localStorage available');
  }
}

export function isRegistrationCached(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  const registered = localStorage.getItem('shapes_registered');
  const timestamp = localStorage.getItem('registration_timestamp');

  if (!registered || !timestamp) return false;

  const age = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  return age < maxAge;
}

export function cacheRegistration(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('shapes_registered', 'true');
    localStorage.setItem('registration_timestamp', Date.now().toString());
    console.log('✅ Registration cached');
  } else {
    console.log('✅ Registration completed - caching skipped (no localStorage)');
  }
}