"use client";

import { useState } from "react";

export default function ProfileSetupPage() {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");

  const calculateScore = () => {
    const skillList = skills
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim());

    let score = 20;

    const importantSkills = [
      "python",
      "sql",
      "git",
      "react",
      "javascript",
      "machine learning",
      "dsa",
    ];

    importantSkills.forEach((skill) => {
      if (skillList.includes(skill)) {
        score += 10;
      }
    });

    return Math.min(score, 100);
  };

  const getRoadmap = () => {
    const role = targetRole.toLowerCase();

    if (role.includes("software")) {
      return [
        "Python",
        "Git & GitHub",
        "Data Structures",
        "SQL",
        "React",
        "Portfolio Project",
      ];
    }

    if (role.includes("ai")) {
      return [
        "Python",
        "NumPy",
        "Pandas",
        "Machine Learning",
        "Deep Learning",
        "LLMs",
      ];
    }

    if (role.includes("data")) {
      return [
        "Python",
        "Pandas",
        "Statistics",
        "Data Visualization",
        "Machine Learning",
        "Projects",
      ];
    }

    return [
      "Programming Fundamentals",
      "Git & GitHub",
      "Projects",
    ];
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Profile Setup
        </h1>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Degree"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="University"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="number"
            placeholder="Graduation Year"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Current Skills (e.g. Python, SQL)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Target Role (e.g. Software Engineer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="p-3 rounded-lg bg-slate-800"
          />

          <button
  onClick={() => {
    localStorage.setItem("targetRole", targetRole);
    localStorage.setItem("skills", skills);
    localStorage.setItem(
      "score",
      calculateScore().toString()
    );

    setShowRoadmap(true);
  }}
  className="bg-blue-600 p-3 rounded-lg font-semibold"
>
  Generate My Career Roadmap
</button>

          {showRoadmap && (
            <div className="mt-6 bg-green-900 p-4 rounded-xl text-center">
              <h2 className="text-2xl font-bold">
                Career Readiness Score
              </h2>

              <p className="text-4xl font-bold mt-2">
                {calculateScore()}/100
              </p>
            </div>
          )}

          {showRoadmap && (
            <div className="mt-8 bg-slate-800 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                Your Career Roadmap
              </h2>

              <ul className="list-disc ml-6 space-y-2">
                {getRoadmap().map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
