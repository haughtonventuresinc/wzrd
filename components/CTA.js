import React from "react";
import Image from "next/image";
import config from "@/config";

const FeatureCard = ({ title, description, image }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-black mt-2 mb-2">
      <div className="p-6">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <p className="text-white">{description}</p>
      </div>
    </div>
  );
};

const CTA = () => {
  return (
    <section className="relative hero overflow-hidden min-h-screen">
      <Image
        src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
        alt="Background"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="max-w-5xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
            Product Features
          </h2>
          <p className="text-xl opacity-80 mb-12 md:mb-16">Included Features</p>

          <div className="flex flex-col md:flex-row flex-wrap justify-around mt-12">
            <FeatureCard
              title="SPX Daily Outlook"
              description="Daily posts minutes after the market opens with our market forecast and trading strategies for SPX and SPY. Detailed trading strategies including specific options to trade, entry limits, profit targets, and stop limits. Historical performance averaging over 480% ROI per month since 2016."
            />
            <FeatureCard
              title="SPX Aggressive Trader"
              description="Higher risk strategy with larger stop levels, allowing trades more room to move throughout the day.
Continuous updates on stop levels and trade management for those who can monitor the market all day. Averaged over 31% monthly return on margin (ROM)."
            />
            <FeatureCard
              title="SPX Spread Trader"
              description="Ideal for traders who can’t monitor the market constantly, providing precise entry and stop prices.
Strategy involves opening vertical credit spreads on expiration day, aiming for options to expire worthless for a credit gain."
            />
            <FeatureCard
              title="Daily Market Forecast"
              description="Daily predictions on closing price levels for SPX and SPY, plus three target levels for the day’s highs or lows based on our proprietary algorithms.
Insight into expected support and resistance levels throughout the trading day."
            />
            <FeatureCard
              title="Performance Transparency"
              description="Detailed posting of all trade activities—successes and failures.
Weekly recaps in the SPX Trader’s Blog, explaining daily trading decisions and strategies"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
