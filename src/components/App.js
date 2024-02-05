import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import questions from "./questions.json";
const SECS_PER_QUESTION = 30;
const init = {
  questions: questions,

  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRem: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        // questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRem: state.questions.length * SECS_PER_QUESTION,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...init,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRem: state.secondsRem - 1,
        status: state.secondsRem === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action Unknown");
  }
}
function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRem },
    dispatch,
  ] = useReducer(reducer, init);
  const numQsns = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "dataRecieved", payload: data }))
  //     .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);
  useEffect(function () {
    dispatch({ type: "dataRecieved" });
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>{status === "loading" && <Loader />}</Main>
      <Main>{status === "error" && <Error />}</Main>
      <Main>
        {status === "ready" && (
          <StartScreen numQsns={numQsns} dispatch={dispatch} />
        )}
      </Main>
      <Main>
        {status === "active" && (
          <>
            <Progress
              numQsns={numQsns}
              index={index}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRem={secondsRem} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQsns={numQsns}
              />
            </Footer>
          </>
        )}
      </Main>
      <Main>
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
