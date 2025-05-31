/**
 * Utility functions for analytics tracking with DataFast
 */

/**
 * Adds tracking parameters to a URL
 * @param {string} url - The original URL
 * @param {Object} params - The tracking parameters to add
 * @returns {string} - The URL with tracking parameters
 */
export const addTrackingParams = (url, params = {}) => {
  try {
    // Handle URLs with hash fragments
    let baseUrl = url;
    let hash = '';
    
    // Extract hash fragment if present
    if (url.includes('#')) {
      const parts = url.split('#');
      baseUrl = parts[0];
      hash = '#' + parts[1];
    }
    
    // Handle both absolute and relative URLs
    const isAbsolute = baseUrl.startsWith('http') || baseUrl.startsWith('https');
    const urlObj = isAbsolute ? new URL(baseUrl) : new URL(baseUrl, 'http://example.com');
    
    // Add each parameter to the URL
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });
    
    // Return the URL with the added parameters and hash fragment
    const result = (isAbsolute ? urlObj.toString() : `${urlObj.pathname}${urlObj.search}`) + hash;
    return result;
  } catch (error) {
    console.error('Error adding tracking params:', error);
    return url;
  }
};

/**
 * Gets tracking parameters from the current URL
 * @returns {Object} - The tracking parameters
 */
export const getTrackingParams = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const trackingParams = {};
  
  // Extract ref parameter
  const ref = urlParams.get('ref');
  if (ref) trackingParams.ref = ref;
  
  // Extract source parameter
  const source = urlParams.get('source');
  if (source) trackingParams.source = source;
  
  // Extract via parameter
  const via = urlParams.get('via');
  if (via) trackingParams.via = via;
  
  // Extract UTM parameters
  const utmSource = urlParams.get('utm_source');
  if (utmSource) trackingParams.utm_source = utmSource;
  
  const utmMedium = urlParams.get('utm_medium');
  if (utmMedium) trackingParams.utm_medium = utmMedium;
  
  const utmCampaign = urlParams.get('utm_campaign');
  if (utmCampaign) trackingParams.utm_campaign = utmCampaign;
  
  const utmTerm = urlParams.get('utm_term');
  if (utmTerm) trackingParams.utm_term = utmTerm;
  
  const utmContent = urlParams.get('utm_content');
  if (utmContent) trackingParams.utm_content = utmContent;
  
  return trackingParams;
};

/**
 * Preserves tracking parameters across page navigations
 * @param {string} url - The target URL
 * @returns {string} - The URL with preserved tracking parameters
 */
export const preserveTrackingParams = (url) => {
  const currentParams = getTrackingParams();
  return addTrackingParams(url, currentParams);
};

/**
 * Debug function to log tracking parameters
 * @returns {string} - A string representation of the current tracking parameters
 */
export const debugTrackingParams = () => {
  const params = getTrackingParams();
  return Object.keys(params).length > 0 
    ? 'Tracking: ' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join(', ')
    : 'No tracking parameters';
};
