"use client";

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { preserveTrackingParams, getTrackingParams, debugTrackingParams } from '@/libs/analytics';

/**
 * A wrapper around Next.js Link component that preserves tracking parameters
 * This component automatically adds tracking parameters from the current URL to the destination URL
 */
const TrackingLink = ({ href, children, ...props }) => {
  const [trackingDebug, setTrackingDebug] = useState('');
  
  // Process the href to include tracking parameters
  const processedHref = useCallback(() => {
    // Skip processing for external links, mail links, or anchor links
    if (typeof href !== 'string' || 
        href.startsWith('http') || 
        href.startsWith('mailto:') || 
        href === '#') {
      return href;
    }
    
    // For Next.js Link components with hash fragments, we need special handling
    // This ensures tracking parameters are preserved with hash navigation
    let processedUrl = href;
    
    // Check if the URL has a hash fragment
    if (href.includes('#')) {
      processedUrl = preserveTrackingParams(href);
    } else {
      // For regular internal links
      processedUrl = preserveTrackingParams(href);
    }
    
    return processedUrl;
  }, [href]);
  
  // Debug tracking parameters in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTrackingDebug(debugTrackingParams());
    }
  }, []);

  // For hash links, we need to handle the click manually to preserve parameters
  const handleClick = (e) => {
    // Only for hash links and when we have tracking parameters
    if (href.startsWith('#') && Object.keys(getTrackingParams()).length > 0) {
      e.preventDefault();
      // Update the URL without a page reload
      const newUrl = window.location.pathname + 
                    window.location.search + 
                    href;
      window.history.pushState({}, '', newUrl);
      
      // Scroll to the element
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Link href={processedHref()} onClick={handleClick} {...props}>
        {children}
      </Link>
      {process.env.NODE_ENV === 'development' && trackingDebug && (
        <span style={{ display: 'none' }}>{trackingDebug}</span>
      )}
    </>
  );
};

export default TrackingLink;
