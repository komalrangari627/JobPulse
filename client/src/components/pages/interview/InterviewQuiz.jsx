import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaRobot,
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

  const navigate = useNavigate();

  const [interviewRounds, setInterviewRounds] =
    useState([]);

  const [roundIndex, setRoundIndex] =
    useState(0);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [userAnswer, setUserAnswer] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  /* =====================================
     FETCH INTERVIEW
  ===================================== */

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

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-circle"></div>

        <h2>AI Interview Loading...</h2>

        <p>
          Preparing intelligent interview
          questions...
        </p>
      </div>
    );
  }

  /* =====================================
     NO INTERVIEW
  ===================================== */

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

  /* =====================================
     NEXT QUESTION
  ===================================== */

  const nextQuestion = () => {

  const totalQuestions =
    currentRound.questions.length;

  const completedQuestions =
    questionIndex + 1;

  const progressValue =
    Math.round(
      (completedQuestions /
        totalQuestions) *
        100
    );

  setProgress(progressValue);

  if (
    questionIndex <
    totalQuestions - 1
  ) {

    setQuestionIndex(
      (prev) => prev + 1
    );

  } else if (
    roundIndex <
    interviewRounds.length - 1
  ) {

    setRoundIndex(
      (prev) => prev + 1
    );

    setQuestionIndex(0);

  } else {

    localStorage.setItem(
      "jobpulse_interview_result",
      JSON.stringify({
        completed: true,
        progress: 100,
        totalRounds:
          interviewRounds.length,
        completedAt:
          new Date().toLocaleString(),
      })
    );

    setProgress(100);

    setCompleted(true);
  }
}

  /* =====================================
     COMPLETED SCREEN
  ===================================== */

  if (completed) {
    return (
      <div className="completion-screen">
        <div className="complete-card">

          <FaCheckCircle />

          <h2>
            Interview Completed Successfully
          </h2>

          <p>
            Your AI Interview has been
            submitted successfully.
          </p>

          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
          >
            Go To Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">

      {/* ================= HEADER ================= */}

      <div className="quiz-header">

        <div className="ai-badge">
          <FaRobot />
          AI Interview Mode Active
        </div>

      </div>

      {/* ================= ROUND ================= */}

      <div className="round-title">

        <div className="round-icon">
          <FaBrain />
        </div>

        <div>
          <h2>{currentRound.title}</h2>

          <p>
            AI Powered Smart Assessment
          </p>
        </div>

      </div>

      {/* ================= QUESTION CARD ================= */}

      <div className="question-card">

        <div className="question-top">

          <div className="question-count">
            <FaMicrochip />

            Question {questionIndex + 1}
            {" / "}
            {
              currentRound.questions
                .length
            }
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

        {/* ANSWER */}

        <div className="answer-box">

          {(currentQuestion.options || [])
            .length ? (

            <div className="options">

              {currentQuestion.options.map(
                (opt, i) => (

                  <button
                    key={i}
                    onClick={() => {
                      nextQuestion();
                    }}
                  >
                    <FaCheckCircle />

                    {opt}
                  </button>
                )
              )}

            </div>

          ) : (

            <>
              <textarea
                placeholder="Write your answer here..."
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(
                    e.target.value
                  )
                }
              />

              <button
                className="submit-btn"
                onClick={() => {

                  if (
                    !userAnswer.trim()
                  ) {
                    alert(
                      "Please enter your answer."
                    );
                    return;
                  }

                  console.log(
                    "Answer:",
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

        {/* ================= PROGRESS ================= */}

        <div className="progress-section">

          <div className="progress-info">

            <span>
              Interview Progress
            </span>

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