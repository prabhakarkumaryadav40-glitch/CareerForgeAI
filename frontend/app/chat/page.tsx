"use client";

import { useState } from "react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AI Career Mentor
        </h1>

        <div className="bg-slate-900 p-6 rounded-xl">
          <textarea
            placeholder="Ask anything about careers, placements, internships, projects..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 rounded-lg bg-slate-800 min-h-[120px]"
          />

          <button
            onClick={askAI}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

          {answer && (
            <div className="mt-6 bg-slate-800 p-6 rounded-lg whitespace-pre-wrap">
              {answer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}