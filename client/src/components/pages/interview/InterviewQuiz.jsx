import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FaRobot,
  FaClock,
  FaBrain,
  FaPaperPlane,
  FaCheckCircle,
  FaMicrochip,
  FaCode,
} from "react-icons/fa";

import "../../sections/styles/Interviewquiz.scss";

import {
  getInterviewByJobId,
  getAIQuestions,
} from "../../../api/interAPI";

const InterviewQuiz = () => {

  const { jobId } = useParams();

  const [interviewRounds, setInterviewRounds] =
    useState([]);

  const [roundIndex, setRoundIndex] =
    useState(0);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(true);

  const [interviewId, setInterviewId] =
    useState(null);

  const [userAnswer, setUserAnswer] =
    useState("");

  /* =========================================
     FETCH INTERVIEW + AI QUESTIONS
  ========================================= */

  useEffect(() => {

    const fetchInterview = async () => {

      try {

        const data =
          await getInterviewByJobId(jobId);

        let rounds = data?.rounds || [];

        /* ================= AI QUESTIONS ================= */

        const aiData =
          await getAIQuestions("job interview");

        if (aiData?.questions) {

          const aiQuestions = Array.isArray(
            aiData.questions
          )
            ? aiData.questions
            : aiData.questions
                .split("\n")
                .filter(
                  (q) => q.trim() !== ""
                );

          rounds = [
            ...rounds,
            {
              title: "AI Technical Round",

              time: 60,

              questions: aiQuestions.map(
                (q) => ({
                  q,
                  options: [],
                })
              ),
            },
          ];
        }

        if (rounds.length) {

          setInterviewRounds(rounds);

          setInterviewId(data?.interviewId);

          setTimer(rounds[0].time);
        }

      } catch (err) {

        console.error(
          "Failed to load interview",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchInterview();

  }, [jobId]);

  /* =========================================
     RESET TIMER ON ROUND CHANGE
  ========================================= */

  useEffect(() => {

    if (interviewRounds.length) {

      setTimer(
        interviewRounds[roundIndex]?.time || 0
      );

      setQuestionIndex(0);
    }

  }, [roundIndex, interviewRounds]);

  /* =========================================
     TIMER COUNTDOWN
  ========================================= */

  useEffect(() => {

    if (timer <= 0) return;

    const interval = setInterval(() => {

      setTimer((t) => t - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="loading-screen">

        <div className="loader-circle"></div>

        <h2>AI Interview Loading...</h2>

        <p>
          Preparing intelligent interview questions
        </p>

      </div>
    );
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!interviewRounds.length) {
    return (
      <div className="empty-screen">

        <FaRobot />

        <h2>No Interview Available</h2>

      </div>
    );
  }

  const currentRound =
    interviewRounds[roundIndex];

  const currentQuestion =
    currentRound.questions[questionIndex];

  /* =========================================
     NEXT QUESTION
  ========================================= */

  const nextQuestion = () => {

    if (
      questionIndex <
      currentRound.questions.length - 1
    ) {

      setQuestionIndex((prev) => prev + 1);

    } else if (
      roundIndex <
      interviewRounds.length - 1
    ) {

      setRoundIndex((prev) => prev + 1);

    } else {

      alert("🎉 AI Interview Completed!");
    }
  };

  /* =========================================
     PROGRESS
  ========================================= */

  const progress =
    ((questionIndex + 1) /
      currentRound.questions.length) *
    100;

  return (
    <div className="quiz-container">

      {/* =====================================
         AI HEADER
      ===================================== */}

      <div className="quiz-header">

        <div className="ai-badge">

          <FaRobot />

          AI Interview Mode Active

        </div>

        <div className="timer-box">

          <FaClock />

          {timer}s Left

        </div>
      </div>

      {/* =====================================
         ROUND TITLE
      ===================================== */}

      <div className="round-title">

        <div className="round-icon">
          <FaBrain />
        </div>

        <div>

          <h2>{currentRound.title}</h2>

          <p>
            AI Powered Smart Interview Assessment
          </p>

        </div>
      </div>

      {/* =====================================
         QUESTION CARD
      ===================================== */}

      <div className="question-card">

        {/* QUESTION TOP */}

        <div className="question-top">

          <div className="question-count">

            <FaMicrochip />

            Question {questionIndex + 1} /{" "}
            {currentRound.questions.length}

          </div>

          <div className="question-skill">

            <FaCode />

            Technical Assessment

          </div>
        </div>

        {/* QUESTION */}

        <div className="question-text">

          <p>{currentQuestion.q}</p>

        </div>

        {/* =====================================
           ANSWERS
        ===================================== */}

        <div className="answer-box">

          {(currentQuestion.options || [])
            .length ? (

            <div className="options">

              {currentQuestion.options.map(
                (opt, i) => (

                  <button
                    key={i}
                    onClick={nextQuestion}
                  >
                    <FaCheckCircle />

                    {opt}
                  </button>
                )
              )}
            </div>

          ) : (

            <>
              {/* TEXT AREA */}

              <textarea
                placeholder="Write your answer in detail..."
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(
                    e.target.value
                  )
                }
              />

              {/* SUBMIT */}

              <button
                className="submit-btn"
                onClick={() => {

                  console.log(
                    "User Answer:",
                    userAnswer
                  );

                  setUserAnswer("");

                  nextQuestion();
                }}
              >
                <FaPaperPlane />

                Submit Answer
              </button>
            </>
          )}
        </div>

        {/* =====================================
           PROGRESS BAR
        ===================================== */}

        <div className="progress-section">

          <div className="progress-info">

            <span>Interview Progress</span>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

          <div className="progress-wrapper">

            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewQuiz;