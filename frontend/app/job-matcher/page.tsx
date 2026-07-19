"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "react-circular-progressbar/dist/styles.css";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

type JobMatchResult = {
  matchScore: number;
  atsScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
};
export default function JobMatcherPage() {
    const [user, setUser] = useState<any>(null);

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });
}, []);


const getScoreColor = (score: number) => {
  if (score >= 80) return "#22C55E"; // Green
  if (score >= 60) return "#EAB308"; // Yellow
  return "#EF4444"; // Red
};

const getRecommendation = (score: number) => {
  if (score >= 85) {
    return {
      title: "Strong Match",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500",
    };
  }

  if (score >= 65) {
    return {
      title: "Good Match",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500",
    };
  }

  return {
    title: "Needs Improvement",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500",
  };
};
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingResume, setLoadingResume] = useState(false);

  const [fileName, setFileName] = useState("");

  const [result, setResult] =
    useState<JobMatchResult | null>(null);

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setLoadingResume(true);

    try {
      const pdfModule = await import("react-pdftotext");

      const text = await pdfModule.default(file);

      setResume(text);
    } catch (error) {
      console.error(error);
      alert("Failed to read PDF.");
    } finally {
      setLoadingResume(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      alert(
        "Please provide both Resume and Job Description."
      );
      return;
    }

    setLoading(true);

    try {
        console.log("JOB MATCH USER:", user);
      const response = await fetch(
        "/api/job-matcher",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resume,
            jobDescription,
            userId: user?.id,
          }),
          
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze job match.");
    } finally {
      setLoading(false);
    }
  };
const handleCopyAnalysis = async () => {
  if (!result) return;

  const text = `
CareerForge AI Report

Job Match Score: ${result.matchScore}%
ATS Score: ${result.atsScore}%

Summary:
${result.summary}

Matching Skills:
${result.matchingSkills.join(", ")}

Missing Skills:
${result.missingSkills.join(", ")}

Suggestions:
${result.suggestions.join("\n• ")}
`;

  await navigator.clipboard.writeText(text);

  alert("Analysis copied to clipboard!");
};

const handleDownloadPDF = () => {
  if (!result) return;

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("CareerForge AI Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Job Match Score: ${result.matchScore}%`, 14, 35);
  doc.text(`ATS Score: ${result.atsScore}%`, 14, 43);

  doc.setFontSize(16);
  doc.text("Summary", 14, 58);

  doc.setFontSize(11);
  doc.text(result.summary, 14, 66, {
    maxWidth: 180,
  });

  autoTable(doc, {
    startY: 82,
    head: [["Matching Skills"]],
    body: result.matchingSkills.map((skill) => [skill]),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Missing Skills"]],
    body: result.missingSkills.map((skill) => [skill]),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Suggestions"]],
    body: result.suggestions.map((item) => [item]),
  });

  doc.save("CareerForge_AI_Report.pdf");
};
    return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          🎯 AI Job Matcher
        </h1>

        <p className="text-gray-400 mb-8">
          Upload your resume or paste it manually, then compare it with a job description.
        </p>

        {/* Resume Upload */}

        <div className="mb-8">

          <label className="block text-lg font-semibold mb-3">
            Upload Resume (PDF)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="block w-full text-sm text-gray-300
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-lg
            file:border-0
            file:bg-blue-600
            file:text-white
            hover:file:bg-blue-700"
          />

          {fileName && (
            <p className="mt-3 text-green-400">
              Uploaded: {fileName}
            </p>
          )}

          {loadingResume && (
            <p className="mt-2 text-blue-400">
              Extracting resume...
            </p>
          )}

        </div>

        {/* Text Areas */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h2 className="text-xl font-semibold mb-3">
              Resume
            </h2>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste resume here..."
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <h2 className="text-xl font-semibold mb-3">
              Job Description
            </h2>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description..."
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-green-500"
            />

          </div>

        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        {result && (

          <div className="mt-10 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">

            <div className="bg-blue-600 px-6 py-4">

              <h2 className="text-2xl font-bold">
                🎯 Job Match Result
              </h2>

            </div>

            <div className="p-6 space-y-8">

              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">

  <div className="w-36 h-36">

    <CircularProgressbar
      value={result.matchScore}
      text={`${result.matchScore}%`}
      styles={buildStyles({
  pathColor: getScoreColor(result.matchScore),
  textColor: "#ffffff",
  trailColor: "#1E293B",
})}
    />

  </div>

  <div
  className={`rounded-xl border p-5 ${getRecommendation(result.matchScore).bg}`}
>
  <h3
    className={`text-2xl font-bold ${getRecommendation(result.matchScore).color}`}
  >
    {getRecommendation(result.matchScore).title}
  </h3>

  <p className="text-gray-300 mt-2">
    {result.matchScore >= 85 &&
      "Excellent alignment with this role. Your resume matches most of the required skills and should perform well in ATS screening."}

    {result.matchScore >= 65 &&
      result.matchScore < 85 &&
      "Your resume is a good match, but adding a few missing skills could significantly improve your chances."}

    {result.matchScore < 65 &&
      "Your resume needs improvement for this role. Focus on the missing skills and tailor your resume before applying."}
  </p>
</div>

  <p className="mt-5 text-lg font-semibold text-blue-400">
    Job Match Score
  </p>

</div>

               <div className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">

  <div className="w-36 h-36">

    <CircularProgressbar
      value={result.atsScore}
      text={`${result.atsScore}%`}
      styles={buildStyles({
  pathColor: getScoreColor(result.matchScore),
  textColor: "#ffffff",
  trailColor: "#1E293B",
})}
    />

  </div>

  <p className="mt-5 text-lg font-semibold text-green-400">
    ATS Score
  </p>

</div>

              </div>

              <div>

                <h3 className="text-xl font-bold text-blue-400 mb-3">
                  Summary
                </h3>

                <p className="text-gray-300 leading-7">
                  {result.summary}
                </p>

              </div>

              <div>

                <h3 className="text-xl font-bold text-green-400 mb-3">
                  ✅ Matching Skills
                </h3>

                <div className="flex flex-wrap gap-3">
  {result.matchingSkills.map((skill, index) => (
    <span
      key={index}
      className="px-4 py-2 rounded-full bg-green-600/20 border border-green-500 text-green-300 font-medium"
    >
      ✓ {skill}
    </span>
  ))}
</div>

              </div>

              <div>

                <h3 className="text-xl font-bold text-red-400 mb-3">
                  ❌ Missing Skills
                </h3>

                <div className="flex flex-wrap gap-3">
  {result.missingSkills.map((skill, index) => (
    <span
      key={index}
      className="px-4 py-2 rounded-full bg-red-600/20 border border-red-500 text-red-300 font-medium"
    >
      ✕ {skill}
    </span>
  ))}
</div>

              </div>

              <div>

                <h3 className="text-xl font-bold text-yellow-400 mb-3">
                  💡 Suggestions
                </h3>

                <ul className="space-y-2">
                  {result.suggestions.map((item, index) => (
                    <li key={index}>
                      • {item}
                    </li>
                  ))}
                </ul>

              </div>
              <div className="flex justify-end pt-2">

  <div className="flex justify-end gap-4 pt-4">

  <button
    onClick={handleCopyAnalysis}
    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
  >
    📋 Copy Analysis
  </button>

  <button
    onClick={handleDownloadPDF}
    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
  >
    📄 Download Report
  </button>

</div>

</div>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}