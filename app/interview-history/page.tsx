"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface InterviewHistory {
  id: number;
  role: string;

  interview: {
    question: string;
    answer: string;
  }[];

  overall_score: number;
  technical_skills: number;
  communication: number;
  problem_solving: number;
  confidence: number;

  recommendation: string;

  strengths: string[];
  weaknesses: string[];
  learning_resources: string[];

  overall_feedback: string;

  created_at: string;
}

export default function InterviewHistoryPage() {
  const [history, setHistory] = useState<
    InterviewHistory[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Logged in user:", user);

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } =
      await supabase
        .from("interview_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });
        console.log("History Data:", data);
console.log("History Error:", error);

    if (error) {
      console.error(error);
    }

    if (data) {
      setHistory(data as InterviewHistory[]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

            Interview History

          </h1>

          <Link
            href="/interview"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
          >
            Back to Interview
          </Link>

        </div>

        {loading ? (

          <div className="text-center py-24 text-gray-400">

            Loading...

          </div>

        ) : history.length === 0 ? (

          <div className="bg-slate-900 rounded-xl p-10 text-center">

            <h2 className="text-2xl font-semibold">

              No Interview History Found

            </h2>

            <p className="text-gray-400 mt-4">

              Complete your first AI interview to
              see your reports here.

            </p>

          </div>

        ) : (

          <div className="space-y-10">

            {history.map((item) => (

              <div
                key={item.id}
                className="bg-slate-900 rounded-2xl p-8 shadow-lg"
              >
                                <div className="flex justify-between items-center mb-8">

                  <div>

                    <h2 className="text-3xl font-bold">

                      {item.role}

                    </h2>

                    <p className="text-gray-400 mt-2">

                      {new Date(
                        item.created_at
                      ).toLocaleString()}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-400">

                      Overall Score

                    </p>

                    <h1 className="text-5xl font-bold text-cyan-400">

                      {item.overall_score}/100

                    </h1>

                    <p className="mt-2 text-lg">

                      {item.recommendation}

                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                  <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-gray-400">

                      Technical Skills

                    </p>

                    <h3 className="text-3xl font-bold text-green-400 mt-2">

                      {item.technical_skills}/100

                    </h3>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-gray-400">

                      Communication

                    </p>

                    <h3 className="text-3xl font-bold text-blue-400 mt-2">

                      {item.communication}/100

                    </h3>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-gray-400">

                      Problem Solving

                    </p>

                    <h3 className="text-3xl font-bold text-purple-400 mt-2">

                      {item.problem_solving}/100

                    </h3>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-6">

                    <p className="text-gray-400">

                      Confidence

                    </p>

                    <h3 className="text-3xl font-bold text-yellow-400 mt-2">

                      {item.confidence}/100

                    </h3>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">

                  <div className="bg-slate-800 rounded-xl p-6">

                    <h3 className="text-2xl font-bold text-green-400 mb-4">

                      💪 Strengths

                    </h3>

                    <ul className="space-y-3">

                      {item.strengths?.map((strength, index) => (

                        <li key={index}>

                          ✅ {strength}

                        </li>

                      ))}

                    </ul>

                  </div>

                  <div className="bg-slate-800 rounded-xl p-6">

                    <h3 className="text-2xl font-bold text-red-400 mb-4">

                      ⚠ Weaknesses

                    </h3>

                    <ul className="space-y-3">

                      {item.weaknesses?.map((weakness, index) => (

                        <li key={index}>

                          ❌ {weakness}

                        </li>

                      ))}

                    </ul>

                  </div>

                </div>

                                <div className="bg-slate-800 rounded-xl p-6 mb-8">

                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">

                    📚 Learning Resources

                  </h3>

                  <ul className="space-y-3">

                    {item.learning_resources?.map(
                      (resource, index) => (

                        <li key={index}>

                          📘 {resource}

                        </li>

                      )
                    )}

                  </ul>

                </div>

                <div className="bg-slate-800 rounded-xl p-6 mb-8">

                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">

                    📝 Overall Feedback

                  </h3>

                  <p className="leading-8 text-gray-300 whitespace-pre-wrap">

                    {item.overall_feedback}

                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-6">

                  <h3 className="text-2xl font-bold mb-6">

                    🎯 Interview Questions & Answers

                  </h3>

                  <div className="space-y-6">

                    {item.interview?.map(
                      (qa, index) => (

                        <div
                          key={index}
                          className="bg-slate-900 rounded-xl p-6 border border-slate-700"
                        >

                          <h4 className="text-lg font-bold text-blue-400">

                            Question {index + 1}

                          </h4>

                          <p className="mt-3 text-gray-200">

                            {qa.question}

                          </p>

                          <h4 className="text-lg font-bold text-green-400 mt-6">

                            Your Answer

                          </h4>

                          <p className="mt-3 whitespace-pre-wrap text-gray-300">

                            {qa.answer || "No answer provided"}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}