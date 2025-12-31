import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../sections/styles/Interviewquiz.scss";
import { getInterviewByJobId } from "../../../api/interAPI";

const InterviewQuiz = () => {
  const { jobId } = useParams();

  const [interviewRounds, setInterviewRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [interviewId, setInterviewId] = useState(null);

  // 🔹 Fetch interview
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await getInterviewByJobId(jobId);
        console.log("Interview API response:", data);
  
        if (data?.rounds?.length) {
          setInterviewRounds(data.rounds);
          setInterviewId(data.interviewId);
          setTimer(data.rounds[0].time);
        }        
        
      } catch (err) {
        console.error("Failed to load interview", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterview();
  }, [jobId]);  

  // ⏱ Reset timer on round change
  useEffect(() => {
    if (interviewRounds.length) {
      setTimer(interviewRounds[roundIndex]?.time || 0);
      setQuestionIndex(0);
    }
  }, [roundIndex, interviewRounds]);

  // ⏲ Countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (loading) return <p>Loading interview...</p>;
  if (!interviewRounds.length)
    return <p>No interview available</p>;

  const currentRound = interviewRounds[roundIndex];
  const currentQuestion =
    currentRound.questions[questionIndex];

  const nextQuestion = () => {
    if (questionIndex < currentRound.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else if (roundIndex < interviewRounds.length - 1) {
      setRoundIndex((prev) => prev + 1);
    } else {
      alert("🎉 Interview Completed!");
    }
  };

  return (
    <div className="quiz-container">
      <h2>{currentRound.title}</h2>
      <h4>⏱ Time Left: {timer}s</h4>

      <p>{currentQuestion.q}</p>

      <div className="options">
        {(currentQuestion.options || []).length ? (
          currentQuestion.options.map((opt, i) => (
            <button key={i} onClick={nextQuestion}>
              {opt}
            </button>
          ))
        ) : (
          <button onClick={nextQuestion}>Next</button>
        )}
      </div>
    </div>
  );
};

export default InterviewQuiz;
