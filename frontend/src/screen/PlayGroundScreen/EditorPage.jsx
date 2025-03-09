import { useContext, useRef, useState, useEffect } from "react";
import "./editorPage.scss";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../Provider/PlaygroundProvider";

const EditorPage = ({
  fileId,
  folderId,
  submitCode,
  setMagic,
  magic,
  input,
  setInput,
  output,
  setOutput,
  editorCode,
  setEditorCode,
  isPracticeQuestion
}) => {
  const { getDefaultCode, getLanguage, updateLanguage, saveNewCode } =
    useContext(PlaygroundContext);
    
  const [code, setCode] = useState(() => {
    // For practice questions, use the editorCode passed from the parent
    if (isPracticeQuestion && editorCode) {
      return editorCode;
    }
    return getDefaultCode(fileId, folderId);
  });
  
  const [language, setLanguage] = useState(() => {
    return getLanguage(fileId, folderId) || "javascript";
  });
  
  const [theme, setTheme] = useState("vs-dark");
  const codeRef = useRef(code);

  useEffect(() => {
    // When editorCode changes from parent and this is a practice question
    if (isPracticeQuestion && editorCode && editorCode !== codeRef.current) {
      setCode(editorCode);
      codeRef.current = editorCode;
    }
  }, [editorCode, isPracticeQuestion]);
  
  // Set editorCode for parent component
  useEffect(() => {
    setEditorCode(codeRef.current);
  }, [codeRef.current, setEditorCode]);

  const handleOption = {
    fontSize: "20px",
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on"
  };

  const handleChangeInput = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes("text");
    const validExtensions = ["cpp", "c", "java", "py", "js"]; // Add other extensions as needed
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileType || validExtensions.includes(fileExtension)) {
      const readFile = new FileReader();
      readFile.readAsText(file);
      readFile.onload = function (value) {
        codeRef.current = value.target.result;
        setCode(value.target.result);
      };
    } else {
      alert("Incorrect file type. Please upload valid code files.");
    }
  };

  const handleEditorChange = (e) => {
    codeRef.current = e;
    setEditorCode(e);
  };

  const saveCode = () => {
    if (isPracticeQuestion) {
      // For practice questions, just update the editorCode state
      setEditorCode(codeRef.current);
      alert("Code saved in memory");
    } else {
      // For regular playground, save to persistence
      saveNewCode(fileId, folderId, codeRef.current);
      alert("Code saved successfully");
    }
  };

  const extensionMapping = {
    cpp: "cpp",
    javascript: "js",
    python: "py",
    java: "java",
  };
  
  const handleExport = () => {
    const codeVal = codeRef.current?.trim();
    if (!codeVal) {
      alert("Nothing to export");
      return;
    }
    const codeBlob = new Blob([codeVal], { type: "text/plain" });
    const download = URL.createObjectURL(codeBlob);
    const link = document.createElement("a");
    link.href = download;
    link.download = `code.${extensionMapping[language]}`;
    link.click();
  };

  const handleLanguage = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    if (!isPracticeQuestion) {
      updateLanguage(fileId, folderId, newLanguage);
      setCode(getDefaultCode(fileId, folderId));
    }
  };

  const handleTheme = (e) => {
    setTheme(e.target.value);
  };

  const runCode = () => {
    submitCode({ code: codeRef.current, language });
  };

  const handleMagic = () => {
    setMagic(!magic);
  };
  
  const handleInput = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes("text");
    const emptyType = file.type.includes("");
    if (fileType || emptyType) {
      const readFile = new FileReader();
      readFile.readAsText(file);
      readFile.onload = function (value) {
        setInput(value.target.result);
      };
    } else {
      alert("Incorrect file type. Please upload a valid text file.");
    }
  };
  
  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-left">
          <div className="title">
            <span className="title-name">{isPracticeQuestion ? "Practice Problem" : "Playground"}</span>
          </div>
          <button onClick={saveCode} className="text-xl">Save Code</button>
        </div>
        <div className="header-right">
          <div className="magic-icon" title="AI Help" onClick={handleMagic}>
            <i className="fa fa-magic magic" aria-hidden="true"></i>
          </div>
          <div className="dropdown-container">
            <select
              className="dropdown"
              value={language}
              onChange={handleLanguage}
            >
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="dropdown-container">
            <select className="dropdown" value={theme} onChange={handleTheme}>
              <option value="vs-light">Light</option>
              <option value="vs-dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div className="editor-body">
        <Editor
          height="100%"
          theme={theme}
          language={language}
          options={handleOption}
          value={code}
          onChange={handleEditorChange}
        />
      </div>
      <div className="entire-footer">
        <div className="container-input">
          <div className="input-container">
            <div className="new-input">
              <b>Input:</b>
              <label htmlFor="uploadTestcase" className="label">
                <span className="material-icons icons">upload</span>
                <span className="title">Import Input</span>
              </label>
              <input
                type="file"
                id="uploadTestcase"
                onChange={handleInput}
                style={{ display: "none" }}
              />
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                placeholder="Enter your test input here..."
              ></textarea>
            </div>
          </div>

          <div className="output-container">
            <div className="new-input">
              <b>Output:</b>
              <button className="label" onClick={() => {
                const outputBlob = new Blob([output], { type: "text/plain" });
                const url = URL.createObjectURL(outputBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "output.txt";
                link.click();
              }}>
                <span className="material-icons icons">download</span>
                <span className="title">Export Output</span>
              </button>
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={output}
                onChange={(e) => {
                  setOutput(e.target.value);
                }}
                readOnly
                placeholder="Output will appear here after running your code..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <label htmlFor="upload" className="title">
            <span className="material-icons icons">upload</span>
            <span>Import Code</span>
          </label>
          <input
            type="file"
            id="upload"
            onChange={handleChangeInput}
            style={{ display: "none" }}
          />
          <div className="title" onClick={handleExport}>
            <span className="material-icons icons">download</span>
            <span>Export Code</span>
          </div>
          <button onClick={runCode} className="run-button">
            <span className="material-icons">play_arrow</span> 
            Run Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
