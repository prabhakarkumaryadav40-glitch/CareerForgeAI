"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!targetRole || !skills) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      console.log("STARTING getUser()");

      const result = await supabase.auth.getUser();

      console.log("GET USER RESULT:", result);

      const user = result.data.user;

      if (!user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      console.log("USER ID:", user.id);

      const response = await fetch(
        "/api/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetRole,
            skills,
            userId: user.id,
          }),
        }
      );

      console.log("API RESPONSE:", response);

      const data = await response.json();

      console.log("API DATA:", data);

      setRoadmap(data.roadmap);
      setScore(data.score);
    } catch (error) {
      console.error(
        "ROADMAP ERROR:",
        error
      );

      alert("Roadmap generation failed");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto bg-slate-900 p-6 rounded-xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Career Roadmap
        </h1>

        <input
          type="text"
          placeholder="Target Role"
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-slate-800 mb-4"
        />

        <textarea
          placeholder="Skills (Python, SQL, Git...)"
          value={skills}
          onChange={(e) =>
            setSkills(e.target.value)
          }
          className="w-full h-32 p-3 rounded-lg bg-slate-800 mb-4"
        />

        <button
          onClick={generateRoadmap}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg disabled:bg-gray-600"
        >
          {loading
            ? "Generating..."
            : "Generate Roadmap"}
        </button>

        {score !== null && (
          <div className="mt-6 bg-slate-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold">
              Career Score: {score}/100
            </h2>
          </div>
        )}

        {roadmap && (
          <div className="mt-6 bg-slate-800 p-6 rounded-lg whitespace-pre-wrap">
            {roadmap}
          </div>
        )}
      </div>
    </main>
  );
}