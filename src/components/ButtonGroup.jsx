import React, { useEffect, useState } from "react";

const ButtonGroup = ({ setValue, analyzeImage, value }) => {
  const [varstore, setVarstore] = useState("");
  useEffect(() => {
    setValue(varstore);
  }, [varstore]);
  useEffect(() => {
    if (value) analyzeImage();
  }, [value, varstore]);

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
