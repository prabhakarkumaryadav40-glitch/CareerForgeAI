"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobMatcherHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "/api/job-matcher-history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      setHistory(data);
      setLoading(false);
    };

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
  <h1 className="text-4xl font-bold mb-8">
    Job Matcher History
  </h1>

  {loading ? (
    <p>Loading...</p>
  ) : history.length === 0 ? (
    <p>No previous job match reports found.</p>
  ) : (
    <div className="space-y-6">
      {history.map((item: any) => (
        <div
          key={item.id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-semibold">
      {item.job_title || "Job Match Report"}
    </h2>

    <p className="text-slate-400">
      {new Date(item.created_at).toLocaleString()}
    </p>
  </div>

  <div className="flex gap-3">
  <div className="bg-green-500/20 border border-green-500 rounded-lg px-4 py-2 text-center">
    <p className="text-xs text-slate-300">Match</p>
    <p className="text-2xl font-bold text-green-400">
      {item.match_score}%
    </p>
  </div>

  <div className="bg-blue-500/20 border border-blue-500 rounded-lg px-4 py-2 text-center">
    <p className="text-xs text-slate-300">ATS</p>
    <p className="text-2xl font-bold text-blue-400">
      {item.ats_score}%
    </p>
  </div>
</div>
</div>

<p className="mt-4 text-slate-300">
  {item.analysis?.summary}
</p>

<div className="grid md:grid-cols-2 gap-6 mt-6">
  <div>
    <h3 className="font-semibold text-green-400 mb-2">
      Strengths
    </h3>

    <ul className="list-disc list-inside text-slate-300 space-y-1">
      {item.strengths?.map((skill: string, index: number) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>

  <div>
    <h3 className="font-semibold text-red-400 mb-2">
      Skill Gaps
    </h3>

    <ul className="list-disc list-inside text-slate-300 space-y-1">
      {item.skill_gaps?.map((skill: string, index: number) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>
</div>

<div className="mt-6">
  <h3 className="font-semibold text-yellow-400 mb-2">
    Recommendations
  </h3>

  <div className="flex justify-end mt-6">
  <button
    onClick={async () => {
      if (!confirm("Delete this report?")) return;

      const response = await fetch(
        "/api/job-matcher-history",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
          }),
        }
      );

      if (response.ok) {
        setHistory((prev) =>
          prev.filter((report) => report.id !== item.id)
        );
      } else {
        alert("Failed to delete report.");
      }
    }}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
  >
    Delete Report
  </button>
</div>

  <ul className="list-disc list-inside text-slate-300 space-y-1">
    {item.recommendations?.map(
      (tip: string, index: number) => (
        <li key={index}>{tip}</li>
      )
    )}
  </ul>
</div>
        </div>
      ))}
    </div>
  )}
</div>
  );
}