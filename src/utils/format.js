/**
 * Format utilities used across the app.
 */

/**
 * Shorten a Flow address for display.
 * @param {string} [addr='']
 * @returns {string}
 */
export function shortAddress(addr = '') {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';
}
