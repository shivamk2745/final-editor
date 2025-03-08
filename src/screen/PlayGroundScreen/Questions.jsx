import React from "react";
import { QuestionProvider } from "./QuestionProvider";
import AiChat from "./AiChat";
import Ai from "./Ai";
import Question from "./Question";
const Questions = ({ magic }) => {
  return (
    <QuestionProvider>
      <Question />
      {/* <AiChat /> */}
      {magic && <Ai />}
    </QuestionProvider>
  );
};

export default Questions;
