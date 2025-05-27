import React, { useState, useEffect } from "react";

const Algos = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('spx'); // Default to SPX

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        // Use the correct backend URL
        const BACKEND_API = process.env.NODE_ENV === 'production' ? 'https://index-wzrdbackend-production.up.railway.app' : 'http://localhost:3001';
        const response = await fetch(`${BACKEND_API}/api/v1/algos/market-data`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setMarketData(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch market data');
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh data every 30 minutes
    const intervalId = setInterval(fetchMarketData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const renderPivotPoints = (data) => {
    if (!data || !data.pivotPoints || data.pivotPoints.length === 0) {
      return <p>No pivot points available</p>;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Pivot Points</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.pivotPoints.map((point, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">{point.label}</p>
              <p className="text-lg font-bold">{point.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHighsLows = (data) => {
    if (!data || !data.highsLows || Object.keys(data.highsLows).length === 0) {
      return <p>No highs/lows data available</p>;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Highs & Lows</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.highsLows).map(([label, value], index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-lg font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderStandardDeviations = (data) => {
    if (!data || !data.standardDeviations || data.standardDeviations.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Standard Deviations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.standardDeviations.map((sd, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">{sd.label}</p>
              <p className="text-lg font-bold">{sd.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderFibonacci = (data) => {
    if (!data || !data.fibonacci || data.fibonacci.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Fibonacci Retracements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.fibonacci.map((fib, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">{fib.label}</p>
              <p className="text-lg font-bold">{fib.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderKeyLevels = (data) => {
    if (!data || !data.keyLevels || data.keyLevels.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Key Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.keyLevels.map((level, index) => (
            <div key={index} className={`p-3 rounded-lg shadow-sm ${level.label === 'Current Price' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <p className="text-sm text-gray-600">{level.label}</p>
              <p className="text-lg font-bold">{level.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">Loading market data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-2">Please try again later or contact support if the issue persists.</p>
        </div>
      );
    }

    if (!marketData) {
      return <p>No market data available</p>;
    }

    const data = activeTab === 'spx' ? marketData.spx : marketData.spy;

    return (
      <div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{activeTab.toUpperCase()} Daily Cheat Sheet</h2>
            <p className="text-sm text-gray-600">Date: {data?.date || new Date().toLocaleDateString()}</p>
          </div>
          
          {/* Last Updated Indicator */}
          <div className="mb-4 p-2 rounded-md text-sm text-gray-600 bg-gray-100">
            <div className="text-right">
              {data?.lastUpdated && (
                <div className="text-xs">
                  Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          {/* Current Price Display */}
          {data?.currentPrice && (
            <div className="mb-6 text-center bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-3xl font-bold">{data.currentPrice}</p>
            </div>
          )}
          
          {/* Main Trading Levels - What the client specifically requested */}
          {renderPivotPoints(data)}
          {renderHighsLows(data)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Market Algorithms</h1>
      <p className="text-gray-600 mb-6">
        Daily market forecasts and price targets for SPX and SPY. Use these levels for your trading decisions.
      </p>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'spx' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('spx')}
        >
          SPX
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'spy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('spy')}
        >
          SPY
        </button>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Algos;
