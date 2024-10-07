import React from "react";

const ButtonGroup = ({ setValue, analyzeImage }) => {
  return (
    <div className="relative">
      <div className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide w-full p-2">
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setValue("What is in the image?");
            analyzeImage();
          }}
        >
          What is in the image?
        </button>
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setValue("Generate Instagram caption for this image short");
            analyzeImage();
          }}
        >
          Generate Instagram caption for this image short
        </button>
        <button
          className="bg-gray-200 text-gray-700 p-2 rounded-md whitespace-nowrap"
          onClick={() => {
            setValue("Solve this question in the image");
            analyzeImage();
          }}
        >
          Solve this question in the image
        </button>
      </div>
    </div>
  );
};

export default ButtonGroup;
