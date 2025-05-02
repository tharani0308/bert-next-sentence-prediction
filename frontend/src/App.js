import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState("");
  const [prediction, setPrediction] = useState("");
  const [emotionSelected, setEmotionSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const emotions = [
    { type: "Happy", icon: "/happy.svg" },
    { type: "Sad", icon: "/sad.svg" },
    { type: "Angry", icon: "/angry.svg" },
  ];

  const handlePredict = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/predict", {
        input,
        sentiment: emotionSelected.toLowerCase(),
      });
      setPrediction(response.data.generated_sentence);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-4">
      <div className="flex w-full max-w-[800px] space-x-2 px-8">
        <input
          className="border-2 w-full px-3 rounded-2xl p-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a sentence"
        />
        <button onClick={handlePredict} className="flex items-center justify-center p-3 bg-black text-white rounded-xl">
          Generate
        </button>
      </div>
      <div className="flex space-x-2">
        {emotions.map((emotion) => (
          <button
            key={emotion.type}
            className={`flex space-x-2 p-2 rounded-full border ${emotionSelected === emotion.type && "bg-gray-200"}`}
            onClick={() => setEmotionSelected(emotion.type)}
          >
            <img width="20px" src={emotion.icon} alt={emotion.type} />
            <p className={`${emotionSelected === emotion.type ? "hidden" : ""}`}>{emotion.type}</p>
          </button>
        ))}
      </div>
      {loading ? (
        <p>Predicting...</p>
      ) : (
        prediction && (
          <>
            <p className="mx-96 sm:mx-20">Generated Sentence: {prediction}</p>
          </>
        )
      )}
    </div>
  );
};

export default App;
