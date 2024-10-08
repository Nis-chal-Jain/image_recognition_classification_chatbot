import React, { useEffect, useState } from "react";

const ButtonGroup = ({ setValue, analyzeImage, value }) => {
  const [varstore, setVarstore] = useState(null);
  const [changevar, setchangevar] = useState(false);
  const [changeval, setchangeval] = useState(false);
  useEffect(() => {
    if (varstore == null) return;
    setchangevar(true);
    setValue(varstore);
    setchangeval(true);
  }, [varstore]);
  useEffect(() => {
    if (changeval && changevar) {
      analyzeImage(); // Ensure analyzeImage is defined
    }
  }, [changeval, changevar]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide w-full p-2">
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setVarstore("What is in the image?");
          }}
        >
          What is in the image?
        </button>
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setVarstore("Generate Instagram caption for this image short");
          }}
        >
          Generate Instagram caption for this image short
        </button>
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setVarstore("Solve this question in the image");
          }}
        >
          Solve this question in the image
        </button>
      </div>
    </div>
  );
};

export default ButtonGroup;
