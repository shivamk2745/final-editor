import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import problemsData from "../PlayGroundScreen/data.json";
import VideoCall from "../Video/VideoCall";
import "./interviewPage.scss";

const InterviewPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from route state or provide defaults
  useEffect(() => {
    if (!location.state?.name || location.state.name === "Anonymous") {
      navigate('/signup', { 
        replace: true,
        state: { 
          from: location.pathname,
          message: "Please log in to join the interview session" 
        } 
      });
      return;
    }
  }, [location.state, navigate, location.pathname]);

  // Return null while checking authentication
  if (!location.state?.name || location.state.name === "Anonymous") {
    return null;
  }

  const userName = location.state?.name || "Anonymous";
  const isHost = location.state?.isHost || false;
  
  const socketRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentProblem, setCurrentProblem] = useState(null);
  
  // Use problems from data.json instead of hardcoded array
  const [problemsList, setProblemsList] = useState(
    problemsData.map(problem => ({
      id: problem.id,
      title: problem.fileName,
      difficulty: problem.difficulty,
      description: problem.descriptions,
      examples: problem.examples,
      constraints: problem.constraint
    }))
  );
  
  const codeRef = useRef(code);
  const chatEndRef = useRef(null);

  // New state for video call
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Socket connection setup remains the same
  useEffect(() => {
    // Connect to Socket.io server without query params in the connection
    socketRef.current = io("http://localhost:5000");

    // Set up event listeners
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
      
      // Only emit join-room after successful connection
      socketRef.current.emit("join-room", { roomId, userName, isHost });
    });

    // Add a connection error handler
    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socketRef.current.on("room-users", (users) => {
      setParticipants(users);
    });

    socketRef.current.on("code-change", (newCode) => {
      codeRef.current = newCode;
      setCode(newCode);
    });

    socketRef.current.on("language-change", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socketRef.current.on("input-change", (newInput) => {
      setInput(newInput);
    });

    socketRef.current.on("output-result", (result) => {
      setOutput(result);
      setIsRunning(false);
    });

    socketRef.current.on("chat-message", (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    socketRef.current.on("problem-selected", (problem) => {
      setCurrentProblem(problem);
      // Set default starter code based on the problem
      const starterCode = getStarterCodeForProblem(problem.id, language);
      codeRef.current = starterCode;
      setCode(starterCode);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, userName, isHost]);

  // Rest of the component remains largely the same
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCodeChange = (newCode) => {
    codeRef.current = newCode;
    setCode(newCode);
    
    // Broadcast code changes to other participants
    socketRef.current.emit("code-change", { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Broadcast language change
    socketRef.current.emit("language-change", { roomId, language: newLanguage });
    
    // If there's a current problem, update the starter code for the new language
    if (currentProblem) {
      const starterCode = getStarterCodeForProblem(currentProblem.id, newLanguage);
      codeRef.current = starterCode;
      setCode(starterCode);
      socketRef.current.emit("code-change", { roomId, code: starterCode });
    }
  };

  // Other event handlers remain the same
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    
    // Broadcast input change
    socketRef.current.emit("input-change", { roomId, input: newInput });
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Send code to server for execution
    socketRef.current.emit("run-code", {
      roomId,
      code: codeRef.current,
      language,
      input
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      sender: userName,
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Add message to local state and broadcast to others
    setChatMessages(prev => [...prev, message]);
    socketRef.current.emit("chat-message", { roomId, message });
    
    // Clear input field
    setNewMessage("");
  };

  // Modified to work with our updated problem structure
  const handleSelectProblem = (problem) => {
    // Find full problem details from the problemsList
    const selectedProblem = problemsList.find(p => p.id === problem.id);
    setCurrentProblem(selectedProblem);
    
    // Get starter code for the selected problem
    const starterCode = getStarterCodeForProblem(selectedProblem.id, language);
    codeRef.current = starterCode;
    setCode(starterCode);
    
    // Broadcast problem selection to other participants
    socketRef.current.emit("problem-selected", { roomId, problem: selectedProblem });
    socketRef.current.emit("code-change", { roomId, code: starterCode });
  };

  // Modified to include problem examples from data.json
  const getStarterCodeForProblem = (problemId, lang) => {
    const problem = problemsList.find(p => p.id === problemId);
    
    if (!problem) return "// Problem not found";
    
    // Generate examples string from the problem examples
    let examplesStr = "";
    if (problem.examples && problem.examples.length > 0) {
      problem.examples.forEach((ex, idx) => {
        examplesStr += `\n * Example ${idx + 1}:\n * Input: ${ex.input}\n * Output: ${ex.output}\n * ${ex.explanation}`;
      });
    }
    
    // Create language-specific templates that incorporate the problem details
    const templates = {
      javascript: `// Problem: ${problem.title}\n// Difficulty: ${problem.difficulty}\n\n/**\n * ${problem.description}\n *${examplesStr}\n * Constraints:\n * ${problem.constraints || "None specified"}\n */\n\nfunction solution(input) {\n  // Your code here\n  \n  return result;\n}\n\n// Test your solution\nconsole.log(solution(input));`,
      
      python: `# Problem: ${problem.title}\n# Difficulty: ${problem.difficulty}\n\n'''\n${problem.description}\n\n${problem.examples ? problem.examples.map((ex, idx) => `Example ${idx + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}\n${ex.explanation}`).join('\n\n') : ''}\n\nConstraints:\n${problem.constraints || "None specified"}\n'''\n\ndef solution(input):\n    # Your code here\n    \n    return result\n\n# Test your solution\nprint(solution(input))`,
      
      cpp: `// Problem: ${problem.title}\n// Difficulty: ${problem.difficulty}\n\n/*\n * ${problem.description}\n *${examplesStr}\n * Constraints:\n * ${problem.constraints || "None specified"}\n */\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n    // Your code here\n    \n    return 0;\n}`,
      
      java: `// Problem: ${problem.title}\n// Difficulty: ${problem.difficulty}\n\n/*\n * ${problem.description}\n *${examplesStr}\n * Constraints:\n * ${problem.constraints || "None specified"}\n */\n\nimport java.util.*;\n\npublic class Solution {\n    // Write your solution here\n    \n    public static void main(String[] args) {\n        // Test your solution\n    }\n}`
    };
    
    return templates[lang] || templates.javascript;
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  // Add a button to toggle video call visibility
  const toggleVideoCall = () => {
    setShowVideoCall(!showVideoCall);
  };

  // Editor options
  const editorOptions = {
    fontSize: "16px",
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on"
  };

  // The UI rendering remains mostly the same, with some updates to display problem details
  return (
    <div className="interview-container bg-gradient-to-br from-cyan-300 to-violet-500 min-h-screen">
      {/* Header remains the same */}
      <div className="interview-header bg-white shadow-md p-4 rounded-t-lg flex justify-between items-center">
        <div className="left-section flex items-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600 mr-4">
            Code Interview
          </h1>
          <div className="room-info flex items-center">
            <span className="bg-gray-100 px-3 py-1 rounded-md text-xl text-gray-700 mr-2">
              Room: {roomId}
            </span>
            <button 
              onClick={handleCopyRoomId} 
              className="text-cyan-600 hover:text-cyan-800"
              title="Copy Room ID"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>
        
        <div className="center-section flex-1 flex justify-center items-center">
          {currentProblem && (
            <div className="current-problem text-center mr-4">
              <span className="font-semibold text-2xl text-black">Current Problem:</span> <span className="px-2 text-2xl text-gray-500">{currentProblem.title}</span>
              <span className={`ml-2 px-2 py-0.5 text-lg rounded-full ${
                currentProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800 text-xl'
              }`}>
                {currentProblem.difficulty}
              </span>
            </div>
          )}
          
          <button 
            onClick={toggleVideoCall}
            className={`video-call-btn px-4 py-2 rounded-md text-white font-medium flex items-center ${
              showVideoCall ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90'
            }`}
          >
            <span className="mr-2">{showVideoCall ? 'End Call' : 'Start Video Call'}</span>
            <span className="text-xl">{showVideoCall ? '📵' : '📹'}</span>
          </button>
        </div>
        
        <div className="right-section flex items-center space-x-4">
          <div className="participants flex items-center">
            <span className="text-2xl text-gray-600 mr-2">Participants ({participants.length}):</span>
            <div className="avatar-group flex -space-x-2">
              {participants.map((user, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleLeaveRoom} 
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xl"
          >
            Leave Room
          </button>
        </div>
      </div>
      
      <div className="interview-content flex h-[calc(100vh-8rem)]">
        <div className="left-panel w-1/4 bg-white rounded-bl-lg p-4 flex flex-col overflow-hidden">
          {isHost ? (
            <div className="problems-list flex-1 overflow-y-auto">
              <h2 className="text-3xl font-semibold mb-4 text-black">Select a Problem</h2>
              {problemsList.map(problem => (
                <div 
                  key={problem.id} 
                  className={`problem-item p-3 mb-2 rounded-lg cursor-pointer ${
                    currentProblem?.id === problem.id 
                      ? 'bg-gradient-to-r from-cyan-100 to-violet-100 border-l-4 border-violet-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectProblem(problem)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-xl text-black">{problem.title}</h3>
                    <span className={`px-2 py-0.5 text-xl rounded-full ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-xl text-gray-600 mt-1 line-clamp-2">{problem.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="problem-details flex-1 overflow-y-auto">
              {currentProblem ? (
                <>
                  <h2 className="text-3xl font-bold mb-2">{currentProblem.title}</h2>
                  <span className={`inline-block mb-4 px-2 py-0.5 text-lg rounded-full ${
                    currentProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    currentProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentProblem.difficulty}
                  </span>
                  <div className="description text-gray-500 p-4 rounded-lg mb-4 text-2xl font-semibold">
                    <p>{currentProblem.description}</p>
                  </div>
                  
                  {/* Display examples from the problem data */}
                  {currentProblem.examples && currentProblem.examples.length > 0 && (
                    <div className="examples text-gray-500">
                      <h3 className="font-medium mb-2 text-2xl">Examples:</h3>
                      {currentProblem.examples.map((example, index) => (
                        <div key={index} className="example bg-gray-50 p-3 rounded-lg mb-2 text-lg">
                          <div><strong>Example {index + 1}:</strong></div>
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                          <div><strong>Explanation:</strong> {example.explanation}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Display constraints if available */}
                  {currentProblem.constraints && (
                    <div className="constraints mt-4 text-lg text-gray-500">
                      <h3 className="font-medium mb-2">Constraints:</h3>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {currentProblem.constraints}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Waiting for interviewer to select a problem...</p>
                </div>
              )}
            </div>
          )}

          {/* Chat container remains the same */}
          <div className="chat-container mt-4 h-1/2 flex flex-col border rounded-lg">
            <div className="chat-header bg-gray-200 p-2 border-b rounded-t-lg">
              <h3 className="font-medium text-xl text-black">Interview Chat</h3>
            </div>
            <div className="chat-messages flex-1 p-2 overflow-y-auto">
              {chatMessages.length > 0 ? (
                chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message mb-2 ${msg.sender === userName ? 'text-right' : ''}`}>
                    <span className="font-semibold text-xl text-gray-600">{msg.sender}:</span>
                    <div className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender === userName 
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 my-4 ">
                  <p className="text-xl">No messages yet</p>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>
            <form className="chat-input flex p-2 border-t" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xl"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-3 py-1 rounded-r-md text-xl"
              >
                Send
              </button>
            </form>
          </div>
        </div>
        
        {/* Right panel with editor remains the same */}
        <div className="right-panel w-3/4 bg-white rounded-br-lg flex flex-col">
          <div className="editor-controls p-4 bg-gray-50 border-b flex justify-between items-center">
            <div className="left-controls flex items-center space-x-4">
              <div className="dropdown-container">
                <select
                  className="border rounded px-2 py-1"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
              </div>

              <div className="dropdown-container">
                <select 
                  className="border rounded px-2 py-1"
                  value={theme} 
                  onChange={handleThemeChange}
                >
                  <option value="vs-light">Light</option>
                  <option value="vs-dark">Dark</option>
                </select>
              </div>
            </div>
            
            <div className="connection-status">
              {isConnected ? (
                <span className="text-green-500 flex items-center  text-2xl">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 "></span>
                  Connected
                </span>
              ) : (
                <span className="text-red-500 flex items-center text-2xl">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Disconnected
                </span>
              )}
            </div>
          </div>
          
          <div className="editor-body flex-1">
            <Editor
              height="100%"
              theme={theme}
              language={language}
              options={editorOptions}
              value={code}
              onChange={handleCodeChange}
            />
          </div>
          
          <div className="io-container flex">
            <div className="input-container w-1/2 p-4 border-t border-r">
              <div className="input-header mb-2 flex justify-between items-center">
                <h3 className="font-medium text-2xl">Input</h3>
              </div>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Enter your test input here..."
                className="w-full h-40 border rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
              ></textarea>
            </div>
            
            <div className="output-container w-1/2 p-4 border-t">
              <div className="output-header mb-2 flex justify-between items-center">
                <h3 className="font-medium text-2xl">Output</h3>
              </div>
              <div 
                className="w-full h-40 border rounded p-2 bg-black overflow-auto"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-white">Running code...</div>
                  </div>
                ) : (
                  <pre className=" whitespace-pre-wrap text-xl text-white">{output}</pre>
                )}
              </div>
            </div>
          </div>
          
          <div className="editor-footer p-4 border-t flex justify-between items-center">
            <div className="left-buttons flex space-x-4">
              {/* Add buttons for additional features if needed */}
            </div>
            
            <button 
              onClick={handleRunCode}
              disabled={isRunning}
              className={`bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-2 rounded-md flex items-center ${
                isRunning ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {isRunning ? (
                <>
                  <span className="mr-2 text-2xl">Running</span>
                  <span className="animate-spin text-2xl">⟳</span>
                </>
              ) : (
                <>
                  <span className="mr-2 text-2xl">Run Code</span>
                  <span className="text-2xl">▶</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Video call component */}
      {showVideoCall && (
        <VideoCall 
          socket={socketRef.current} 
          roomId={roomId} 
          userName={userName}
          participants={participants}
        />
        
      )}
    </div>
  );
};

export default InterviewPage;