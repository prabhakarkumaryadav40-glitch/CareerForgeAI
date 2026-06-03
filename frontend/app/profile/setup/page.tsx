"use client";

import { useState } from "react";

export default function ProfileSetupPage() {
  const [showRoadmap, setShowRoadmap] = useState(false);
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
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Target Role (e.g. Software Engineer)"
            className="p-3 rounded-lg bg-slate-800"
          />

          <button
  onClick={() => setShowRoadmap(true)}
  className="bg-blue-600 p-3 rounded-lg font-semibold"
>
  Generate My Career Roadmap
</button>
{showRoadmap && (
  <div className="mt-8 bg-slate-800 p-6 rounded-xl">
    <h2 className="text-2xl font-bold mb-4">
      Your Career Roadmap
    </h2>

    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-blue-400">
          Month 1
        </h3>
        <ul className="list-disc ml-6">
          <li>Python OOP</li>
          <li>Git & GitHub</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-green-400">
          Month 2
        </h3>
        <ul className="list-disc ml-6">
          <li>SQL Basics</li>
          <li>Data Structures</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-purple-400">
          Month 3
        </h3>
        <ul className="list-disc ml-6">
          <li>React</li>
          <li>Portfolio Project</li>
        </ul>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </main>
  );
}