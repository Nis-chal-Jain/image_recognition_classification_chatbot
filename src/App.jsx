import { useEffect, useState } from "react";
import "./App.css";
import fs from "fs";

function App() {
  const [img, setimg] = useState("");
  const [ans1, setans1] = useState("");
  const [ans2, setans2] = useState("");
  const [ans3, setans3] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleFileRead = (event) => {
    const file = event.target.files[0];
    setimg(file);
    const reader = new FileReader();

    reader.onload = function (e) {
      setFileContent(e.target.result);
    };

    reader.readAsText(file);
  };
  useEffect(() => {
    if (img) {
      setans1("loading...");
      setans2("");
      setans3("");
      query(img).then((res) => {
        console.log(res);
        setans1(res[0]["label"]);
        setans2(res[1]["label"]);
        setans3(res[2]["label"]);
        // return str;
      });
    }
  }, [img]);

  async function query(fileContent) {
    const data = fileContent;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        headers: {
          Authorization: `Bearer hf_${import.meta.env.VITE_HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    return result;
  }

  return (
    <>
      <input type="file" onChange={handleFileRead} />
      {img ? (
        <>
          <h6>{ans1}</h6>
          <h6>{ans2}</h6>
          <h6>{ans3}</h6>
          <img
            src={URL.createObjectURL(img)}
            alt="Uploaded image"
            style={{
              width: "300px",
              borderRadius: "10px",
              border: "2px solid #000",
            }}
          />
        </>
      ) : (
        <p>No image uploaded</p>
      )}
    </>
  );
}

export default App;
