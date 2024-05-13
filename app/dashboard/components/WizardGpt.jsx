import React, { useState } from "react";
import { sendOpenAi } from "@/libs/gpt";

const WizardGpt = () => {
  const [command, setCommand] = useState("");
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setCommand(e.target.value);
  };

  const handleExecuteCommand = async () => {
    try {
      const messages = [{ role: "user", content: command }];
      const response = await sendOpenAi(messages, 50); // Adjust parameters as needed
      if (response) {
        setOutputs([response, ...outputs]);
        setCommand("");
        setError(null);
      } else {
        setError("Error fetching response from OpenAI API. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching response from OpenAI API:", error);
      setError("Error fetching response from OpenAI API. Please try again.");
    }
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
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}
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
