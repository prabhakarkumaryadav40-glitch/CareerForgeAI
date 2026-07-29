"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface InterviewQuestion {
  question: string;
  answer: string;
}

interface InterviewHistory {
  id: number;
  role: string;
  question: string;
  answer: string;
  feedback: string;
  created_at: string;
}

export default function InterviewPage() {
  const [role, setRole] = useState("");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [interviewType, setInterviewType] =
    useState("Mixed");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [questions, setQuestions] =
    useState<InterviewQuestion[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [feedback, setFeedback] = useState<any>(null);
  const [history, setHistory] =
    useState<InterviewHistory[]>([]);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [interviewCompleted, setInterviewCompleted] =
    useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("interview_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(10);

    if (data) {
      setHistory(data as InterviewHistory[]);
    }
  }

  async function startInterview() {
    if (!role.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/interview",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "question",
            role,
            difficulty,
            interviewType,
            previousQuestions: [],
          }),
        }
      );

      const data = await response.json();
      console.log("Evaluation Response:", data);
      console.log("Question received:", data.question);


console.log("API Response:", data);


setQuestions([
  {
    question: data.question,
    answer: "",
  },
]);

      setCurrentQuestion(0);

      setInterviewStarted(true);

      setInterviewCompleted(false);

      setFeedback(null);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function updateAnswer(
    value: string
  ) {
    setQuestions((prev) => {
      const updated = [...prev];

      updated[currentQuestion] = {
        ...updated[currentQuestion],
        answer: value,
      };

      return updated;
    });
  }

  async function nextQuestion() {
    if (questions.length === questionCount) {
  return;
}

    if (
      questions.length >=
      questionCount
    ) {
      setInterviewCompleted(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/interview",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "question",
            role,
            difficulty,
            interviewType,
            previousQuestions:
              questions.map(
                (q) => q.question
              ),
          }),
        }
      );

      const data =
        await response.json();

      setQuestions((prev) => [
        ...prev,
        {
          question: data.question,
          answer: "",
        },
      ]);

      setCurrentQuestion(
        questions.length
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  }

  async function finishInterview() {
    setLoading(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const response = await fetch(
      "/api/interview",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          action: "evaluate",
          role,
          userId: user.id,
          questions,
        }),
      }
    );

    const data =
      await response.json();

    setFeedback(data.feedback);

setInterviewCompleted(true);

// Keep the interview page open so the report is shown
loadHistory();
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
}

const progress =
  questionCount === 0
    ? 0
    : Math.round(
        (questions.length /
          questionCount) *
          100
      );

return (
  <main className="min-h-screen bg-slate-950 text-white p-6">

    <div className="max-w-6xl mx-auto">

      <div className="bg-slate-900 rounded-xl p-8">

        <h1 className="text-4xl font-bold text-center mb-8">

          AI Mock Interview

        </h1>

        {!interviewStarted && (

          <>

            <input
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              placeholder="Target Role"
              className="w-full p-3 rounded-lg bg-slate-800 mb-4"
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-800 mb-4"
            >

              <option>
                Easy
              </option>

              <option>
                Medium
              </option>

              <option>
                Hard
              </option>

            </select>

            <select
              value={interviewType}
              onChange={(e) =>
                setInterviewType(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-800 mb-4"
            >

              <option>
                Mixed
              </option>

              <option>
                Technical
              </option>

              <option>
                Coding
              </option>

              <option>
                Behavioral
              </option>

              <option>
                HR
              </option>

            </select>

            <select
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full p-3 rounded-lg bg-slate-800 mb-6"
            >

              <option value={5}>
                5 Questions
              </option>

              <option value={10}>
                10 Questions
              </option>

              <option value={15}>
                15 Questions
              </option>

            </select>

            <button
              onClick={
                startInterview
              }
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-lg font-semibold"
            >

              {loading
                ? "Starting..."
                : "Start Interview"}

            </button>
            <Link
  href="/interview-history"
  className="block w-full mt-4"
>
  <div className="w-full bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-lg text-lg font-semibold text-center">
    Interview History
  </div>
</Link>

          </>

        )}

       {(interviewStarted || feedback) && questions.length > 0 && (

          <>
          <div className="mb-8">

  <div className="flex justify-between items-center mb-2">

    <p className="text-gray-400">
      Interview Progress
    </p>

    <p className="text-blue-400 font-semibold">
      Question {currentQuestion + 1} of {questionCount}
    </p>

  </div>

  <div className="w-full bg-slate-800 rounded-full h-3">

    <div
      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
      style={{
        width: `${progress}%`,
      }}
    />

  </div>

</div>

<div className="bg-slate-800 rounded-xl p-6">

  <div className="flex justify-between items-center mb-6">

    <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">

      {difficulty}

    </span>

    <span className="px-3 py-1 bg-green-600 rounded-full text-sm">

      {interviewType}

    </span>

  </div>

  <h2 className="text-2xl font-bold leading-relaxed">

    {questions[currentQuestion]?.question}

  </h2>

</div>

<textarea
  value={
    questions[currentQuestion]?.answer || ""
  }
  onChange={(e) =>
    updateAnswer(e.target.value)
  }
  placeholder="Write your answer here..."
  className="w-full mt-6 min-h-[220px] bg-slate-800 rounded-xl p-5 resize-none outline-none border border-slate-700 focus:border-blue-500"
/>

<div className="flex justify-between mt-8">

  <button
    onClick={previousQuestion}
    disabled={currentQuestion === 0}
    className="px-6 py-3 rounded-lg bg-slate-700 disabled:opacity-40"
  >

    Previous

  </button>

  {questions.length === questionCount ? (

    <button
      onClick={finishInterview}
      className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold"
    >

      {loading
        ? "Generating Report..."
        : "Finish Interview"}

    </button>

  ) : (

    <button
      onClick={nextQuestion}
      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold"
    >

      {loading
        ? "Generating..."
        : "Next Question"}

   </button>

  )}

</div>

{feedback && (
  <div className="mt-10 bg-slate-800 rounded-xl p-8 shadow-lg">

    <h2 className="text-3xl font-bold text-center mb-8">
      AI Interview Report
    </h2>

    <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center shadow-xl">
      <p className="text-lg text-blue-100">
        Overall Score
      </p>

      <h1 className="text-6xl font-bold mt-3">
        {feedback.overallScore}/100
      </h1>

      <p className="mt-4 text-2xl font-semibold">
        {feedback.recommendation}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

      <div className="bg-slate-700 rounded-xl p-5">
        <p className="text-gray-400">Technical Skills</p>
        <h3 className="text-3xl font-bold text-green-400 mt-2">
          {feedback.technicalSkills}/100
        </h3>
      </div>

      <div className="bg-slate-700 rounded-xl p-5">
        <p className="text-gray-400">Communication</p>
        <h3 className="text-3xl font-bold text-blue-400 mt-2">
          {feedback.communication}/100
        </h3>
      </div>

      <div className="bg-slate-700 rounded-xl p-5">
        <p className="text-gray-400">Problem Solving</p>
        <h3 className="text-3xl font-bold text-purple-400 mt-2">
          {feedback.problemSolving}/100
        </h3>
      </div>

      <div className="bg-slate-700 rounded-xl p-5">
        <p className="text-gray-400">Confidence</p>
        <h3 className="text-3xl font-bold text-yellow-400 mt-2">
          {feedback.confidence}/100
        </h3>
      </div>

    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-8">

      <div className="bg-slate-700 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-green-400 mb-4">
          💪 Strengths
        </h3>

        <ul className="space-y-2">
          {feedback.strengths?.map((item: string, index: number) => (
            <li key={index}>✅ {item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-700 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-red-400 mb-4">
          ⚠ Weaknesses
        </h3>

        <ul className="space-y-2">
          {feedback.weaknesses?.map((item: string, index: number) => (
            <li key={index}>❌ {item}</li>
          ))}
        </ul>
      </div>

    </div>

    <div className="bg-slate-700 rounded-xl p-6 mb-8">

      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        📚 Learning Resources
      </h3>

      <ul className="space-y-2">
        {feedback.learningResources?.map((item: string, index: number) => (
          <li key={index}>📘 {item}</li>
        ))}
      </ul>

    </div>

    <div className="bg-slate-700 rounded-xl p-6">

      <h3 className="text-2xl font-bold text-yellow-400 mb-4">
        📝 Overall Feedback
      </h3>

      <p className="leading-8 text-gray-300">
        {feedback.overallFeedback}
      </p>

    </div>

  </div>
)}
{feedback && (
  <div className="mt-8 text-center">
    <button
      onClick={() => {
        setInterviewStarted(false);
        setInterviewCompleted(false);
        setFeedback(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setRole("");
        setDifficulty("Medium");
        setInterviewType("Mixed");
        setQuestionCount(10);
      }}
      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold"
    >
      Start New Interview
    </button>
  </div>
)}
<Link
  href="/interview-history"
  className="block w-full mt-4"
>
  <div className="w-full bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-lg text-lg font-semibold text-center">
    Interview History
  </div>
</Link>

          </>

        )}

      </div>

    </div>

  </main>
);
}