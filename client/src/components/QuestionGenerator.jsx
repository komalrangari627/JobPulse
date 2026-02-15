import React, { useState } from "react";

export default function QuestionGenerator() {

  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState("");

  const generate = () => {
    fetch(`/questions?topic=${topic}`)
      .then(r => r.json())
      .then(data => setQuestions(data.questions))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>AI Question Generator</h2>

      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e)=>setTopic(e.target.value)}
      />

      <button onClick={generate}>
        Generate
      </button>

      <pre>{questions}</pre>
    </div>
  );
}
