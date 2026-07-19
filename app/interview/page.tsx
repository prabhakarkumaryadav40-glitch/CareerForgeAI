"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InterviewPage() {
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("interview_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(10);

    if (!error && data) {
      setHistory(data);
    }
  };

  const generateQuestion = async () => {
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
          }),
        }
      );

      const data =
        await response.json();

      setQuestion(data.question);
      setFeedback("");
      setAnswer("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) return;

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
            question,
            answer,
            userId: user.id,
          }),
        }
      );

      const data =
        await response.json();

      setFeedback(data.feedback);

      await loadHistory();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-slate-900 p-6 rounded-xl">

          <h1 className="text-4xl font-bold text-center mb-8">
            AI Mock Interview
          </h1>

          <input
            type="text"
            placeholder="Target Role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 mb-4"
          />

          <button
            onClick={generateQuestion}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            {loading
              ? "Generating..."
              : "Generate Question"}
          </button>

          {question && (
            <div className="mt-6">

              <h2 className="font-bold text-xl mb-3">
                Interview Question
              </h2>

              <div className="bg-slate-800 p-4 rounded-lg">
                {question}
              </div>

              <textarea
                placeholder="Write your answer here..."
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                className="w-full min-h-[200px] mt-4 bg-slate-800 rounded-lg p-4"
              />

              <button
                onClick={evaluateAnswer}
                className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
              >
                {loading
                  ? "Evaluating..."
                  : "Get Feedback"}
              </button>

            </div>
          )}

          {feedback && (
            <div className="mt-6 bg-slate-800 p-6 rounded-lg whitespace-pre-wrap">
              {feedback}
            </div>
          )}

        </div>

        <div className="mt-8 bg-slate-900 p-6 rounded-xl">

          <h2 className="text-2xl font-bold mb-4">
            Interview History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-400">
              No interview history found.
            </p>
          ) : (
            <div className="space-y-4">

              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800 p-4 rounded-lg"
                >
                  <p>
                    <strong>Role:</strong>{" "}
                    {item.role}
                  </p>

                  <p className="mt-2">
                    <strong>Question:</strong>{" "}
                    {item.question}
                  </p>

                  <p className="mt-2">
                    <strong>Answer:</strong>{" "}
                    {item.answer?.slice(0, 150)}...
                  </p>

                  <p className="mt-2 text-green-400">
                    Feedback Saved
                  </p>

                  <p className="mt-2 text-gray-500 text-sm">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
