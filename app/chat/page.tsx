"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          history: updatedMessages.slice(-10),
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer || "No response received.",
      };

      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          AI Career Mentor
        </h1>

        <div className="bg-slate-900 rounded-xl p-6">

          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-blue-600 ml-20"
                    : "bg-slate-800 mr-20"
                }`}
              >
                <div className="font-semibold mb-2">
                  {message.role === "user"
                    ? "You"
                    : "CareerForge AI"}
                </div>

                {message.content}
              </div>
            ))}

          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about careers, interviews, projects, resume..."
            className="w-full min-h-[120px] rounded-lg bg-slate-800 p-4"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>
      </div>
    </main>
  );
}