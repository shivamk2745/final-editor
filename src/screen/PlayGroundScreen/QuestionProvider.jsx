import { createContext, useState, useEffect } from "react";
import questionsData from "./data.json";
import { useParams } from "react-router-dom";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children, questionData: propQuestionData }) => {
  const [question, setQuestion] = useState(null);
  const params = useParams();
  const { fileId, folderId } = params;
  
  useEffect(() => {
    // If question data was passed as a prop, use it
    if (propQuestionData) {
      console.log("Setting question from props:", propQuestionData);
      setQuestion(propQuestionData);
      return;
    }
    
    // Otherwise, if it's a practice question, fetch from data.json
    if (folderId === "practice" && fileId) {
      console.log("Looking for question in data.json with ID:", fileId);
      const foundQuestion = questionsData.find(q => q.id === parseInt(fileId));
      console.log("Found question in data.json:", foundQuestion);
      if (foundQuestion) {
        setQuestion(foundQuestion);
      }
    }
  }, [fileId, folderId, propQuestionData]);

  return (
    <QuestionContext.Provider value={{ question, setQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};