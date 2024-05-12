import React from "react";
import Algos from "./Algos";
import RiskReward from "./RiskReward";
import WizardGpt from "./WizardGpt";

const ActiveTab = ({ activeContent }) => {
  return (
    <div className="md:ml-[330px]">
      {" "}
      {/* Adjust the margin to accommodate the sidebar width */}
      {activeContent === "wizardGpt" && <WizardGpt />}
      {activeContent === "riskReward" && <RiskReward />}
      {activeContent === "algos" && <Algos />}
    </div>
  );
};

export default ActiveTab;
