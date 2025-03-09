import React, { useContext } from "react";
import { QuestionContext } from "./QuestionProvider";

function Question({ questionData }) {
  const { question } = useContext(QuestionContext);
  
  // Use either the prop or context question data
  const displayQuestion = questionData || question;
  
  console.log("Question component rendering with data:", displayQuestion);
  
  if (!displayQuestion) {
    return (
      <div className="question-container">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Question not found</h2>
          <p>Sorry, the requested question could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="question-container">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{displayQuestion.fileName}</h2>
          <div className={`text-sm px-3 py-1 rounded-full ${
            displayQuestion.difficulty === "Easy" ? "bg-green-900/20 text-green-400" : 
            displayQuestion.difficulty === "Medium" ? "bg-yellow-900/20 text-yellow-400" : 
            "bg-red-900/20 text-red-400"
          } text-xl` }>
            {displayQuestion.difficulty}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description:</h3>
          <p className="whitespace-pre-line">{displayQuestion.descriptions}</p>
        </div>
        
        {displayQuestion?.examples && displayQuestion.examples.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Examples:</h3>
            {displayQuestion.examples.map((example, index) => (
              <div key={index} className="mb-4 bg-neutral-800 p-4 rounded-md">
                <div className="mb-2 text-xl">
                  <span className="font-semibold">Input:</span> {example.input}
                </div>
                <div className="mb-2 text-xl">
                  <span className="font-semibold">Output:</span> {example.output}
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-semibold text-xl">Explanation:</span> {example.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
          <p className="bg-neutral-800 p-4 rounded-md">{displayQuestion?.constraint || "Not specified"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Time Complexity:</h3>
            <p className="bg-neutral-800 p-4 rounded-md">{displayQuestion?.time || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Space Complexity:</h3>
            <p className="bg-neutral-800 p-4 rounded-md">{displayQuestion?.space || "Not specified"}</p>
          </div>
        </div>
        
        {displayQuestion?.company && displayQuestion.company.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Companies:</h3>
            <div className="flex flex-wrap gap-2">
              {displayQuestion.company.map((company, index) => (
                <span key={index} className="px-3 py-1 bg-neutral-700 text-neutral-200 rounded-full text-xl">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Question;
