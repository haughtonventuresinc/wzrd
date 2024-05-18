// app/dashboard/components/RiskReward.jsx
"use client"; // This directive marks the component as a Client Component

import { useState } from 'react';

const RiskReward = () => {
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [riskRewardRatio, setRiskRewardRatio] = useState(null);
  const [breakevenWinRate, setBreakevenWinRate] = useState(null);

  const calculate = () => {
    const stopLoss = parseFloat(stopLossPrice);
    const entry = parseFloat(entryPrice);
    const takeProfit = parseFloat(takeProfitPrice);

    if (!stopLoss || !entry || !takeProfit) {
      alert('Please enter valid prices');
      return;
    }

    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(takeProfit - entry);
    const ratio = reward / risk;
    const breakeven = (1 / (1 + ratio)) * 100;

    setRiskRewardRatio(ratio.toFixed(2));
    setBreakevenWinRate(breakeven.toFixed(2));
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Risk/Reward Calculator</h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Stop Loss Price:</label>
        <input 
          type="number" 
          value={stopLossPrice} 
          onChange={(e) => setStopLossPrice(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Entry Price:</label>
        <input 
          type="number" 
          value={entryPrice} 
          onChange={(e) => setEntryPrice(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Take Profit Price:</label>
        <input 
          type="number" 
          value={takeProfitPrice} 
          onChange={(e) => setTakeProfitPrice(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button 
        onClick={calculate} 
        className="w-full bg-black text-white py-2 rounded-md hover:bg-black transition"
      >
        Calculate
      </button>
      {/* {riskRewardRatio !== null && ( */}
        <div className="mt-6">
          <p className="text-lg">Risk/Reward Ratio: <span className="font-bold">{riskRewardRatio ? riskRewardRatio : "Nan"}</span></p>
          <p className="text-lg">Breakeven Win Rate: <span className="font-bold">{breakevenWinRate ? breakevenWinRate :"0"}%</span></p>
        </div>
      {/* )} */}
    </div>
  );
};

export default RiskReward;
