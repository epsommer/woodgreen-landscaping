/**
 * Preload troika-three-text to initialize workers before rendering
 * This prevents "Worker module function was called but init did not return a callable function" errors
 */

let preloaded = false;

export async function preloadTroika() {
  if (preloaded || typeof window === 'undefined') {
    return;
  }

  try {
    // Dynamically import troika to trigger worker initialization
    await import('troika-three-text');
    preloaded = true;
    console.log('[Troika] Worker modules preloaded successfully');
  } catch (error) {
    console.error('[Troika] Failed to preload worker modules:', error);
  }
}
