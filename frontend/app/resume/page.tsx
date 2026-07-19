"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ResumeAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  interviewReadiness: string;
};

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
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
      .from("resume_analyses")
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    try {
      const pdfModule = await import(
        "react-pdftotext"
      );

      const text =
        await pdfModule.default(file);

      setResumeText(text);
    } catch (error) {
      console.error(error);
      alert("Failed to read PDF");
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;

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
        "/api/analyze-resume",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeText,
            userId: user.id,
          }),
        }
      );

      const data =
        await response.json();

      setAnalysis(data.analysis);

      await loadHistory();
    } catch (error) {
  console.error(error);

  setAnalysis(null);

  alert("Failed to analyze resume.");
}

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">

  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
    📄
  </div>

  <h1 className="text-5xl font-extrabold">
    AI Resume Analyzer
  </h1>

  <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
    Upload your resume and receive AI-powered ATS analysis, personalized feedback, skill recommendations, and actionable improvements.
  </p>

</div>

        <div className="bg-slate-900 p-6 rounded-xl">

          <div className="mb-8">

  <label className="block text-lg font-semibold mb-4">
    Upload Your Resume
  </label>

  <div className="border-2 border-dashed border-slate-700 hover:border-green-500 transition-all duration-300 rounded-2xl p-10 text-center bg-slate-800/40">

    <div className="text-6xl mb-4">
      📄
    </div>

    <h3 className="text-xl font-semibold">
      Drag & Drop your Resume
    </h3>

    <p className="text-gray-400 mt-2 mb-6">
      Upload your resume in PDF format (Max 5 MB)
    </p>

    <label className="inline-block cursor-pointer bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition">

      Choose PDF

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

    </label>

    {fileName && (
      <div className="mt-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">

        <span className="text-green-400">
          ✅
        </span>

        <span className="text-green-300">
          {fileName}
        </span>

      </div>
    )}

  </div>

</div>

          {resumeText && (
  <div className="mb-6">

    <label className="block text-lg font-semibold mb-3">
      Extracted Resume Content
    </label>

    <textarea
      placeholder="Resume text..."
      value={resumeText}
      onChange={(e) => setResumeText(e.target.value)}
      className="w-full min-h-[300px] bg-slate-800 border border-slate-700 focus:border-green-500 rounded-xl p-4 outline-none"
    />

  </div>
)}

          <button
  onClick={analyzeResume}
  disabled={loading}
  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20"
>
  {loading ? (
    <span className="flex items-center justify-center gap-3">
      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
      Analyzing Resume...
    </span>
  ) : (
    "🚀 Analyze Resume"
  )}
</button>

          {analysis && (
  <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
    <div className="grid md:grid-cols-3 gap-6 p-6 border-b border-slate-700">

  <div className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">

  <h3 className="text-gray-400 mb-5">
    ATS Score
  </h3>

  <div className="relative w-32 h-32">

    <svg
      className="w-32 h-32 -rotate-90"
      viewBox="0 0 120 120"
    >
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="#1e293b"
        strokeWidth="10"
        fill="none"
      />

      {/* Progress Circle */}
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="#22c55e"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={314}
        strokeDashoffset={
  314 - (314 * (analysis?.score ?? 0)) / 100
}
      />
    </svg>

    <div className="absolute inset-0 flex items-center justify-center">
  <span className="text-3xl font-bold text-white">
    {analysis?.score ?? "--"}
  </span>
</div>
  </div>

  <p className="text-gray-500 text-sm mt-4">
    Latest Resume Score
  </p>

</div>

</div>

    <div className="bg-green-600 px-6 py-4">
      <h2 className="text-2xl font-bold text-white">
        📊 AI Resume Analysis
      </h2>
    </div>

    <div className="p-6 space-y-8">

  <div>
    <h3 className="text-xl font-bold mb-2 text-green-400">
      Summary
    </h3>
    <p className="text-gray-300">
      {analysis.summary}
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-6">

  {/* Strengths */}

  <div className="bg-slate-800 rounded-xl p-6 border border-green-500/20">

    <h3 className="text-xl font-bold mb-4 text-green-400">
      ✅ Strengths
    </h3>

    <ul className="space-y-3">
      {analysis.strengths.map((item: string, index: number) => (
        <li
          key={index}
          className="flex gap-2 text-gray-300"
        >
          <span className="text-green-400">✔</span>
          {item}
        </li>
      ))}
    </ul>

  </div>

  {/* Weaknesses */}

  <div className="bg-slate-800 rounded-xl p-6 border border-red-500/20">

    <h3 className="text-xl font-bold mb-4 text-red-400">
      ⚠ Weaknesses
    </h3>

    <ul className="space-y-3">
      {analysis.weaknesses.map((item: string, index: number) => (
        <li
          key={index}
          className="flex gap-2 text-gray-300"
        >
          <span className="text-red-400">✖</span>
          {item}
        </li>
      ))}
    </ul>

  </div>

</div>

  <div className="bg-slate-800 rounded-xl p-6 border border-yellow-500/20">

  <h3 className="text-xl font-bold mb-5 text-yellow-400">
    🏷 Missing Skills
  </h3>

  <div className="flex flex-wrap gap-3">
    {analysis.missingSkills.map((skill: string, index: number) => (
      <span
        key={index}
        className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-medium hover:bg-yellow-500/20 transition"
      >
        {skill}
      </span>
    ))}
  </div>

</div>

  <div className="bg-slate-800 rounded-xl p-6 border border-cyan-500/20">

  <h3 className="text-xl font-bold mb-5 text-cyan-400">
    💡 AI Suggestions
  </h3>

  <div className="space-y-4">
    {analysis.suggestions.map((item: string, index: number) => (
      <div
        key={index}
        className="flex items-start gap-4 bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-cyan-500 transition"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
          {index + 1}
        </div>

        <p className="text-gray-300 leading-7">
          {item}
        </p>
      </div>
    ))}
  </div>

</div>
  <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-6">

  <div className="flex items-center gap-3 mb-4">

    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
      🎯
    </div>

    <div>
      <h3 className="text-xl font-bold text-purple-300">
        Interview Readiness
      </h3>

      <p className="text-sm text-gray-400">
        AI Assessment
      </p>
    </div>

  </div>

  <p className="text-gray-300 leading-8">
    {analysis.interviewReadiness}
  </p>

</div>

</div>

  </div>
)}

        </div>

        <div className="mt-8 bg-slate-900 p-6 rounded-xl">

          <h2 className="text-2xl font-bold mb-4">
            Resume Analysis History
          </h2>

          {history.length === 0 ? (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
    <p className="text-gray-400 text-lg">
      📄 No resume analyses yet.
    </p>
    <p className="text-gray-500 mt-2">
      Upload your first resume to start tracking your progress.
    </p>
  </div>
) : (
  <div className="space-y-5">
    {history.map((item) => (
      <div
        key={item.id}
        className="bg-slate-800 border border-slate-700 hover:border-green-500 transition-all duration-300 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full font-bold">
              ⭐ {item.score}/100
            </div>

            <span className="text-gray-400 text-sm">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>

        </div>

        <p className="text-gray-300 leading-7 line-clamp-4">
          {item.analysis}
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
