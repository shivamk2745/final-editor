import "./Ai.scss";
import React, { useState } from "react";
import AiChat from "./AiChat";

const Ai = ({ editorCode }) => {
  const [aiMode, setAiMode] = useState(false);
  const [mode, setMode] = useState("");
  
  const handleMistake = () => {
    setMode("mistake");
    setAiMode(true);
  };
  
  const handleHint = () => {
    setMode("hint");
    setAiMode(true);
  };
  
  const handleExplain = () => {
    setMode("explanation");
    setAiMode(true);
  };

  return (
    <div className="ai-container-container">
      {aiMode ? (
        <AiChat 
          editorCode={editorCode} 
          mode={mode} 
          onClose={() => setAiMode(false)} 
        />
      ) : (
        <div className="ai-container">
          <h2 className="ai-header">Chat with AI</h2>
          <p className="subtitle">Select a chat mode to get help with your code</p>
          
          <div className="chat-modes">
            <div className="mode-card" onClick={handleMistake}>
              <div className="icon">🔍</div>
              <p>Find Mistake</p>
            </div>
            
            <div className="mode-card" onClick={handleHint}>
              <div className="icon">💡</div>
              <p>Get Hints</p>
            </div>
            
            <div className="mode-card" onClick={handleExplain}>
              <div className="icon">💬</div>
              <p>Explain Solution</p>
            </div>
          </div>
          
          <div className="examples">
            <p className="description">
              The AI has knowledge about the problem and your solution. You can ask questions like:
            </p>
            
            <p>What are the key concepts needed to solve this problem?</p>
            <p>Give me a hint without revealing the full solution</p>
            <p>Where is the bug in my code?</p>
            <p>Explain the time complexity of my solution</p>
            <p>How can I optimize my current approach?</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ai;
