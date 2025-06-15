"use client";

import { useState, useEffect } from 'react';
import { getTrackingParams } from '@/libs/analytics';

/**
 * A component that displays the current tracking parameters
 * Only visible in development mode
 */
const TrackingDebug = () => {
  const [params, setParams] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      // Update params whenever URL changes
      const updateParams = () => {
        setParams(getTrackingParams());
      };
      
      // Initial update
      updateParams();
      
      // Listen for URL changes
      window.addEventListener('popstate', updateParams);
      
      return () => {
        window.removeEventListener('popstate', updateParams);
      };
    }
  }, []);

  // Toggle visibility
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const hasParams = Object.keys(params).length > 0;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        fontSize: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}
    >
      <button 
        onClick={toggleVisibility}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: hasParams ? '#007bff' : '#666',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <span>Tracking Parameters {hasParams ? `(${Object.keys(params).length})` : '(none)'}</span>
        <span>{visible ? '▲' : '▼'}</span>
      </button>
      
      {visible && hasParams && (
        <div style={{ marginTop: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '4px', borderBottom: '1px solid #ddd' }}>Parameter</th>
                <th style={{ textAlign: 'left', padding: '4px', borderBottom: '1px solid #ddd' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(params).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{key}</td>
                  <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
            <p>Add parameters to URL like: <code>?ref=twitter&utm_source=email</code></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingDebug;
