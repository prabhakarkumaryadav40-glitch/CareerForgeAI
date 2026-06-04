"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [score, setScore] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedScore = localStorage.getItem("score");
    const savedRole = localStorage.getItem("targetRole");

    if (savedScore) setScore(savedScore);
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Welcome Back 👋
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-lg text-gray-400">
              Career Readiness Score
            </h2>

            <p className="text-5xl font-bold mt-3">
              {score}/100
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-lg text-gray-400">
              Target Role
            </h2>

            <p className="text-2xl font-bold mt-3">
              {role}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}