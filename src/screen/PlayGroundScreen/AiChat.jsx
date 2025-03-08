import React, { useState, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuestionContext } from "./QuestionProvider";
import "./AiChat.scss";
import Ai from "../assets/Ai.jpg"
const AiChat = ({ editorCode, mode, onClose }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState(true);
  const { question } = useContext(QuestionContext);
  
  // Extract question data
  const questionDesc = question?.descriptions || "No description available";
  const examples = question?.examples || [];
  
  // Set a title based on the mode
  const getModeTitle = () => {
    switch (mode) {
      case "mistake": return "Code Analysis";
      case "hint": return "Problem Hints";
      case "explanation": return "Solution Explanation";
      default: return "AI Assistant";
    }
  };

  const generatePrompt = () => {
    let prompt = "";
    
    // Handle possibly missing examples
    const exampleInput = examples.length > 0 ? examples[0].input || String(examples[0]) : "No examples available";
    const exampleOutput = examples.length > 0 ? examples[0].output || "" : "";
    
    switch (mode) {
      case "mistake":
        prompt = `Analyze the following code and find mistakes: 
        
Code: 
${editorCode}

Problem Description: 
${questionDesc}

Example Input: ${exampleInput}
Example Output: ${exampleOutput}

Please identify any logical errors, edge cases, or inefficiencies in the code. Format your response with clear sections and code examples if needed.`;
        break;
        
      case "hint":
        prompt = `Provide hints for solving the following problem: 

Problem Description: 
${questionDesc}

Current Code: 
${editorCode}

NOTE: Please provide progressive hints that guide the user to think through the problem without directly revealing the full solution. Start with conceptual hints, then algorithm hints, finally implementation details if needed. Analyze the user's current approach and suggest improvements.`;
        break;
        
      case "explanation":
        prompt = `Act as a coding instructor and explain the following problem and optimal solution approaches:

Problem Description: 
${questionDesc}

Example Input: ${exampleInput}
Example Output: ${exampleOutput}

Current Code: 
${editorCode}

Please provide a clear explanation of:
1. The key concepts needed to understand this problem
2. Multiple possible approaches with their time and space complexity
3. The optimal solution strategy and why it works
4. Common pitfalls and edge cases to consider`;
        break;
        
      default:
        prompt = "Please select a valid mode.";
    }
    return prompt;
  };

  async function aiRun() {
    try {
      setLoading(true);
      setResponse("");
      
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = generatePrompt();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Format the response for better readability
      const formattedText = formatResponse(text);

      setResponse(formattedText);
      setCenter(false);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setResponse(`<p class="error">Sorry, there was an error generating a response. Please try again later.</p><p>${error.message}</p>`);
      setCenter(false);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to format the AI response
  const formatResponse = (text) => {
    // Replace newlines with <br/> for line breaks
    let formatted = text.replace(/\n\n/g, "</p><p>");
    formatted = formatted.replace(/\n/g, "<br />");

    // Format code blocks
    formatted = formatted.replace(
      /```([^`]+)```/g,
      "<pre><code>$1</code></pre>"
    );

    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Format headings and important text
    formatted = formatted.replace(/^#\s+(.+)$/gm, "<h2>$1</h2>");
    formatted = formatted.replace(/^##\s+(.+)$/gm, "<h3>$1</h3>");
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Wrap the entire response in a paragraph tag
    formatted = `<p>${formatted}</p>`;
    
    return formatted;
  };

  return (
    <div className="input">
      <div className="aicontainer">
        <div className="response">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="response-ai">
              {center ? (
                <div className="centeral-text">
                  <div className="image-container">
                    <img
                        src={ Ai}
                      alt="AI Assistant"
                    />
                    <h2>{getModeTitle()}</h2>
                  </div>
                  <p>
                    Our AI has analyzed your code and the problem. Click the button below to get personalized assistance.
                  </p>
                  <ul className="rule">
                    <li>
                      Analyze your code for logic errors and edge cases
                    </li>
                    <li>
                      Provide hints that guide you without revealing the entire solution
                    </li>
                    <li>
                      Explain time and space complexity of different approaches
                    </li>
                    <li>
                      Suggest optimizations to make your code more efficient
                    </li>
                  </ul>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: aiResponse }} />
              )}
            </div>
          )}
        </div>
        <div className="button-div">
          <button onClick={aiRun} className="btn" disabled={loading}>
            {loading ? "Generating..." : center ? "Get AI Assistance" : "Regenerate Response"}
          </button>
          {!center && (
            <button onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChat;
