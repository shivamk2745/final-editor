import React, { useState } from "react";

const Import = ({ input, setInput, output, setOutput }) => {
  const handleInput = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes("text");
    const emptyType = file.type.includes("");
    if (fileType || emptyType) {
      const readFile = new FileReader();
      readFile.readAsText(file);
      readFile.onload = function (value) {
        console.log(value.target.result);
        setInput(value.target.result);
      };
    } else {
      console.log("Incorrect file type");
    }
  };
  return (
    <>
      <div className="input">
        <div className="input-header">
          <b>Input:</b>
          <label htmlFor="uploadTestcase" className="label">
            <span className="material-icons icons">upload</span>
            <span className="title">Import Code</span>
          </label>
          <input
            type="file"
            id="uploadTestcase"
            onChange={handleInput}
            style={{ display: "none" }}
          />
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></textarea>
      </div>

      <div className="output">
        <div className="input-header">
          <b>Output:</b>
          <button className="label">
            <span className="material-icons icons">download</span>
            <span className="title">Export Code</span>
          </button>
        </div>
        <textarea
          value={output}
          onChange={(e) => {
            setOutput(e.target.value);
          }}
        ></textarea>
      </div>
    </>
  );
};
export default Import;
