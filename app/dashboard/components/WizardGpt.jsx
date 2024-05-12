import React, { useState } from "react";

const WizardGpt = () => {
  const [command, setCommand] = useState("");
  const [outputs, setOutputs] = useState([]);

  const handleInputChange = (e) => {
    setCommand(e.target.value);
  };

  const handleExecuteCommand = () => {
    // You can implement the logic to execute the command here
    // For demonstration purposes, let's just add the command to the outputs array
    setOutputs([command, ...outputs]);

    // Reset command input after executing
    setCommand("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold text-blue-gray-900 mb-4">
        WizardGPT
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-md w-[90%] mb-4">
        <input
          type="text"
          value={command}
          onChange={handleInputChange}
          placeholder="Message WizardGPT"
          className="w-full border border-blue-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black"
        />
        <button
          onClick={handleExecuteCommand}
          className="mt-2 bg-black hover:bg-slate-600 text-white px-4 py-2 rounded-md focus:outline-none"
        >
          Send
        </button>
      </div>
      {outputs.length > 0 && (
        <>
          {outputs.map((output, index) => (
            <div
              className="bg-white p-4 rounded-lg shadow-md w-[90%] mt-3"
              key={index}
            >
              <p className="text-blue-gray-700 font-semibold">WizardGPT</p>
              <div className=" rounded-md px-3 py-2 mt-2">{output}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default WizardGpt;
