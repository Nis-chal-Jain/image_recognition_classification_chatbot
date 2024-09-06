import React from "react";
import { SparklesCore } from "../components/ui/sparkles";
import { Link } from "react-router-dom";
function App() {
  return (
    <div>
      <div className="h-[100vh] relative w-[100vw] bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
          DeepVisionaries
        </h1>
        <div className="flex z-40 flex-col sm:flex-row items-center gap-4 cursor-pointer mt-8">
          <button className="px-4 py-2 cursor-pointer  bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
          <Link to="/image">Image Recognition Chatbot</Link> 
          </button>
          <button className="px-4 py-2  cursor-pointer text-white ">
            AI Assistant Chatbot
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
