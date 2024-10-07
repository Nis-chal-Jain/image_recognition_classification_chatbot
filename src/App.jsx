import "regenerator-runtime";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect, useRef } from "react";
import sampleImage from "./image.png";
import { RxCrossCircled } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import { BounceLoader } from "react-spinners";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ButtonGroup from "./components/ButtonGroup";

function App() {
  const [image, setImage] = useState(null);
  const [imagetype, setImagetype] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usingvoice, setUsingvoice] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);
  const handleSubmit = async () => {
    const webAppUrl = import.meta.env.VITE_API_SHEET_ID;

    try {
      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
        mode: "no-cors",
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Data sent successfully!");
      } else {
        alert("Failed to send data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    const imageType = file.type;
    setImagetype(imageType);
    const imagebase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64string = reader.result.split(",")[1];
        resolve(base64string);
      };
      reader.onerror = reject;
    });
    setImageData(imagebase64);
  };
  useEffect(() => {
    if (image && image.size > 5 * 1024 * 1024) {
      alert(`Image size too large. Maximum allowed size is ${5}MB.`);
      return;
    }
  }, [image]);

  useEffect(() => {
    setValue(transcript);
  }, [transcript]);
  useEffect(() => {
    if (!listening && transcript) {
      setValue(transcript);
      analyzeImage();
    }
  }, [transcript, listening]);

  const analyzeImage = async () => {
    if (!image) {
      setError("Image must be Selected First");
      return;
    }

    try {
      setLoading(true);
      setResponse((prev) => [...prev, `Qes: ${value}`]);
      handleSubmit();
      const image = {
        inlineData: {
          data: imageData,
          mimeType: imagetype,
        },
      };
      const response = await model.generateContent([value, image]);
      const data = await response.response.text();
      if (usingvoice) {
        const speechsyn = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(data);
        speechsyn.speak(utter);
        setUsingvoice(false);
      }
      setResponse((prev) => [...prev, `Ans: ${data}`]);
      setValue("");
      resetTranscript();
    } catch (error) {
      console.error(error);
      setError("Something went Wrong!!!");
    }
    setLoading(false);
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
            <div className="border-black border-2 ">
              <div className="rounded-md  imageInput text-center bg-white  ">
                <label htmlFor="files" className="text-[#342f2f]">
                  <span className="p-1 pl-5 pr-6 h-full  border-2 rounded-md text-white cursor-pointer bg-[#121212]">
                    Upload Image
                  </span>
                </label>
                <input
                  onChange={uploadImage}
                  id="files"
                  accept="image/*"
                  type="file"
                  className="w-[90%]"
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
              <div ref={messagesEndRef} />
              {error && <p className="answer">{error}</p>}
            </div>
            <div className="mt-[-60px] mb-[-20px]">
              <ButtonGroup analyzeImage={analyzeImage} setValue={setValue}/>
            </div>
            <div className="text-[#121212] ">
              <div className="relative ">
                What do you want to know about the image?
              </div>
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
                  <>
                    <button
                      onClick={analyzeImage}
                      className="bg-black hover:bg-gray-100 text-white font-semibold hover:text-black py-2 px-4 border-2 border-blue-500 hover:border-transparent rounded"
                    >
                      Send
                    </button>
                    <div
                      onClick={() => {
                        if (listening) {
                          SpeechRecognition.stopListening();
                        } else {
                          setUsingvoice(true);
                          SpeechRecognition.startListening();
                        }
                      }}
                      className="my-auto cursor-pointer"
                    >
                      {listening ? <Start /> : <Mic />}
                    </div>
                  </>
                )}
                {error && (
                  <button onClick={window.location.reload}>Reset</button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
function Mic() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      fill="currentColor"
      class="bi bi-mic-fill"
      viewBox="0 0 16 16"
    >
      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
    </svg>
  );
}
function Start() {
  return (
    <svg
      width="33"
      height="33"
      viewBox="0 0 15 15"
      fill="red"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM12 3H3V12H12V3Z"
        fill="red"
      ></path>
    </svg>
  );
}

export default App;
