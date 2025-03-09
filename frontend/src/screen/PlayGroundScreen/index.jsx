import { useParams, useLocation } from "react-router-dom";
import "./index.scss";
import EditorPage from "./EditorPage";
import { useCallback, useState, useEffect } from "react";
import { createSubmission } from "./judge";
import Import from "./Import";
import Ai from "./Ai";
import Question from "./Question";
import { QuestionProvider } from "./QuestionProvider";
import questionsData from "./data.json";

const Playground = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [editorCode, setEditorCode] = useState("");
  const [questionData, setQuestionData] = useState(null);
  const param = useParams();
  const { fileId, folderId, fileName } = param;
  const location = useLocation();

  const [loader, setLoader] = useState(false);
  const [magic, setMagic] = useState(false);
  
  // Determine if this is a practice question
  const isPracticeQuestion = folderId === "practice";
  
  useEffect(() => {
    // If this is a practice question, fetch the question data
    if (isPracticeQuestion) {
      console.log("Loading practice question with ID:", fileId);
      const question = questionsData.find(q => q.id === parseInt(fileId));
      console.log("Found question:", question);
      
      if (question) {
        setQuestionData(question);
        
        // Set default code template based on question
        const defaultTemplate = `// ${question.fileName}\n// ${question.difficulty} - ${question.topic}\n\n// ${question.descriptions}\n\n// Time Complexity: ${question.time || 'Unknown'}\n// Space Complexity: ${question.space || 'Unknown'}\n\n// Start your solution here\n`;
        setEditorCode(defaultTemplate);
      } else {
        console.error("Question not found for ID:", fileId);
      }
    }
  }, [fileId, folderId, fileName, isPracticeQuestion]);

  const callback = ({ apiStatus, data, message }) => {
    console.log(data);

    if (apiStatus === "loading") {
      setLoader(true);
    } else {
      setLoader(false);
      if (data.status.id === 3) {
        console.log(data.stderr);
        setOutput(atob(data.stdout));
      } else {
        setOutput(atob(data.stderr));
      }
    }
  };

  const submitCode = useCallback(
    ({ code, language }) => {
      createSubmission({ code, language, stdin: input, callback });
      console.log(code);
    },
    [input]
  );

  return (
    <QuestionProvider questionData={questionData}>
      <div className="outer-container">
        <div className="playground-container">
          <div className="container-header">
            <img src="/logo.png" alt="logo" />
            {isPracticeQuestion && questionData ? (
              <div className="flex items-center">
                <b className="mr-2">Problem: {questionData.fileName}</b>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  questionData.difficulty === "Easy" ? "bg-green-900/20 text-green-400" : 
                  questionData.difficulty === "Medium" ? "bg-yellow-900/20 text-yellow-400" : 
                  "bg-red-900/20 text-red-400"
                }`}>
                  {questionData.difficulty}
                </span>
              </div>
            ) : (
              <b>Code Online</b>
            )}
          </div>
          <div className="container-body">
            <div className="editor">
              <EditorPage
                fileId={fileId}
                folderId={folderId}
                submitCode={submitCode}
                setMagic={setMagic}
                magic={magic}
                input={input}
                setInput={setInput}
                output={output}
                setOutput={setOutput}
                editorCode={editorCode}
                setEditorCode={setEditorCode}
                isPracticeQuestion={isPracticeQuestion}
              />
            </div>
            {magic ? (
              <Ai editorCode={editorCode} />
            ) : isPracticeQuestion ? (
              <Question questionData={questionData} />
            ) : (
              <Import
                input={input}
                setInput={setInput}
                output={output}
                setOutput={setOutput}
              />
            )}
          </div>
          {loader && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
    </QuestionProvider>
  );
};

export default Playground;
