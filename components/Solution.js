import alarm from "@/app/alarm.png";
import analytics from "@/app/analytics.png";
import gpt from "@/app/gpt.png";

const Solution = ({ title, description, svgPath }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center gap-4 md:w-80">
      <img src={svgPath} alt="SVG" className="w-12 h-12 mb-4" />
      <h3 className="font-bold text-lg md:text-lg text-black">{title}</h3>
      <p className="text-sm text-black">{description}</p>
    </div>
  );
};

const Solutions = () => {
  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
          All you need to turn market insights into profitable trades quickly
          and efficiently with WZRD.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Solution
            title="Real-Time Alerts"
            description="Receive daily market directions and price targets, and adjust your strategy with our real-time alerts system to stay ahead of rapid market movements."
            svgPath="https://img.icons8.com/ios/50/alarm--v1.png"
          />
          <Solution
            title="Simplified Analysis"
            description="Our platform distills complex market data into clear, actionable insights, saving you hours of analysis and helping you focus on making profitable trades."
            svgPath="https://img.icons8.com/ios-glyphs/30/analytics.png"
          />
          <Solution
            title="WZRD GPT: Master the Market"
            description="Harness the power of the WZRD AI Bot, your ultimate tool for precise SPX and SPY trading forecasts. Built on advanced machine learning, it continuously adapts to market shifts, delivering actionable insights directly to you. Stay ahead with WZRD."
            svgPath="https://img.icons8.com/ios/50/chatgpt.png"
          />
        </div>
      </div>
    </section>
  );
};

export default Solutions;
