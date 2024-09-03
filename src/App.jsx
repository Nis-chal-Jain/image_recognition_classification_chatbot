import React, { useState, useEffect } from "react";
import sampleImage from "./image.png";
import { RxCrossCircled } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import { BounceLoader } from "react-spinners";

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const connecting = async () => {
    try {
      const res = await fetch("https://gemini-model-server.onrender.com/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const response = await res.json();
      if (response.message === "connected") {
        console.log("Connected to the Server");
      }
    } catch (e) {
      console.log("Server Connection Failed");
      console.log(e);
    }
  };

  useEffect(() => {
    if (image && image.size > 5 * 1024 * 1024) {
      alert(`Image size too large. Maximum allowed size is ${5}MB.`);
      return;
    }
    connecting();
  }, [image]);

  const analyzeImage = async () => {
    if (!image) {
      setError("Image must be Selected First");
      return;
    }

    try {
      setLoading(true);
      setResponse((prev) => [...prev, `Qes: ${value}`]);
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          image: imageData,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await fetch(
        "https://gemini-model-server.onrender.com/gemini",
        options
      );
      const data = await response.text();
      setResponse((prev) => [...prev, `Ans: ${data}`]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went Wrong!!!");
    }
    setLoading(false);
  };

  const clear = () => {
    setImage(null);
    setImageData(null);
    setValue("");
    setResponse("");
    setError("");
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      analyzeImage();
    }
  };

  return (
    <>
      <div className="app ">
        <div className="text-center  top-0 bg-white rounded-b-md">
          <h1 className="p-1 text-3xl font-bold font-sans-serif">
            Conversational and Image Recognization ChatBot
          </h1>
        </div>
        <section className="flex flex-col mt-1 gap-1 md:flex-row md:flex-nowrap sm:flex-row sm:flex-wrap  lg:flex-row lg:flex-nowrap">
          <div
            className=" shadow-lg h-[80vh] lg:w-[42vw] lg:h-[92vh]  border-2  bg-white border-gray-600 flex flex-col 
                gap-4 p-4 rounded-xl
                border-[#00095]  hover:shadow-xl hover:border-gray-900 hover:border-3
                transition ease-out sm:w-[90vw] sm:h-[92vh] md:w-[45vw] md:h-[92vh]"
          >
            <div className="max-h-[88%] min-h-[88%] flex self-center  min-w-full bg-white rounded-md">
              <img
                className="w-fit max-h-[78vh] m-auto rounded-md "
                src={image ? URL.createObjectURL(image) : sampleImage}
                alt="Image uploaded by the user"
              />
            </div>
            <div className="border-black border-2">
              <div className="rounded-md  imageInput text-center bg-white  ">
                <label htmlFor="files" className="text-[#342f2f]">
                  <span className="font-semibold">Upload an Image :</span>
                  <span className="p-1 pl-6 pr-6 h-full  border-2 rounded-md text-white cursor-pointer bg-[#121212]">
                    Upload Here
                  </span>
                </label>
                <input
                  onChange={uploadImage}
                  id="files"
                  accept="image/*"
                  type="file"
                  className="w-[40%]"
                  hidden
                ></input>
              </div>
            </div>
          </div>

          <div
            className=" shadow-lg lg:w-[58vw] h-[92vh] border-2  bg-white border-black flex flex-col 
            gap-4 p-4 rounded-xl   ease-out sm:w-[90vw] sm:h-[92vh] md:w-[45vw]"
          >
            <div className="max-h-[88%] min-h-[88%] w-full overflow-auto rounded-md relative">
              {loading ? (
                <BounceLoader
                  color="#121212"
                  speedMultiplier={1}
                  size={70}
                  className="absolute top-[46%] left-[46%]"
                />
              ) : (
                response.map(function (data) {
                  return (
                    <div
                      className={
                        data ? "answer overflow-y-auto text-black" : ""
                      }
                      key={data.id}
                    >
                      <ReactMarkdown children={`${data ? data : ""}`} />
                    </div>
                  );
                })
              )}
              {error && <p className="answer">{error}</p>}
            </div>

            <div className="text-[#121212] ">
              <div className="relative ">
                What do you want to know about the image?
              </div>
              {/* <div> */}
              {/* <div className=" "> */}
              <div className="input-container border-2 border-black">
                <input
                  value={value}
                  placeholder="What is in the image..."
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  onKeyDown={handleKeyDown} // Add onKeyDown event listener
                  className="max-w-[87.5%]"
                />
                <div className="relative w-[2.5%] cross bg-[#FFFF]">
                  <span
                    className="absolute top-[28%] right-[15%]"
                    onClick={() => {
                      setValue("");
                    }}
                  >
                    <RxCrossCircled
                      size={18}
                      className="text-slate-400 hover:text-[#484747]"
                    />
                  </span>
                </div>
                {!error && (
                  <button
                    onClick={analyzeImage}
                    class="bg-black hover:bg-gray-100 text-white font-semibold hover:text-black py-2 px-4 border-2 border-blue-500 hover:border-transparent rounded"
                  >
                    Send
                  </button>
                )}
                {error && (
                  <button onClick={window.location.reload}>Reset</button>
                )}
              </div>
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
