"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Resource = {
  title: string;
  type: string;
  url: string;
};

type Project = {
  title: string;
  description: string;
};

type Phase = {
  phase: number;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  resources: Resource[];
  projects: Project[];
};

type Roadmap = {
  title: string;
  overview: string;
  estimatedDuration: string;
  difficulty: string;
  phases: Phase[];
};

export default function RoadmapPage() {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [timeframe, setTimeframe] = useState("6 Months");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [preferredLanguage, setPreferredLanguage] =
    useState("English");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roadmap, setRoadmap] =
    useState<Roadmap | null>(null);

  async function generateRoadmap() {
    setError("");

    if (!careerGoal.trim()) {
      setError("Please enter your career goal.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        "/api/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            careerGoal,
            currentLevel,
            timeframe,
            hoursPerWeek,
            preferredLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate roadmap."
        );
      }

      setRoadmap(data.roadmap);
    } catch (err: any) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-2">
          AI Career Roadmap Generator
        </h1>

        <p className="text-center text-slate-400 mb-10">
          Generate a personalized AI-powered learning roadmap.
        </p>

        <div className="bg-slate-900 rounded-xl p-8 shadow-xl">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Career Goal
              </label>

              <input
                type="text"
                value={careerGoal}
                onChange={(e) =>
                  setCareerGoal(e.target.value)
                }
                placeholder="Full Stack Developer"
                className="w-full rounded-lg bg-slate-800 p-3 outline-none border border-slate-700"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Current Level
              </label>

              <select
                value={currentLevel}
                onChange={(e) =>
                  setCurrentLevel(e.target.value)
                }
                className="w-full rounded-lg bg-slate-800 p-3 border border-slate-700"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

                        <div>
              <label className="block mb-2 font-medium">
                Timeframe
              </label>

              <select
                value={timeframe}
                onChange={(e) =>
                  setTimeframe(e.target.value)
                }
                className="w-full rounded-lg bg-slate-800 p-3 border border-slate-700"
              >
                <option>3 Months</option>
                <option>6 Months</option>
                <option>9 Months</option>
                <option>12 Months</option>
                <option>18 Months</option>
                <option>24 Months</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Hours Per Week
              </label>

              <input
                type="number"
                min={1}
                max={80}
                value={hoursPerWeek}
                onChange={(e) =>
                  setHoursPerWeek(Number(e.target.value))
                }
                className="w-full rounded-lg bg-slate-800 p-3 border border-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Preferred Language
              </label>

              <select
                value={preferredLanguage}
                onChange={(e) =>
                  setPreferredLanguage(e.target.value)
                }
                className="w-full rounded-lg bg-slate-800 p-3 border border-slate-700"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Nepali</option>
              </select>
            </div>

          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-600 bg-red-900/20 p-4 text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating Roadmap..."
              : "Generate Roadmap"}
          </button>

        </div>

                {roadmap && (
          <div className="mt-10 space-y-8">

            <div className="rounded-xl bg-slate-900 p-8 shadow-xl">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-3xl font-bold">
                    {roadmap.title}
                  </h2>

                  <p className="mt-3 text-slate-300">
                    {roadmap.overview}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">

                  <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
                    {roadmap.difficulty}
                  </span>

                  <span className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold">
                    {roadmap.estimatedDuration}
                  </span>

                </div>

              </div>

            </div>

            <div className="space-y-6">

              {roadmap.phases.map((phase) => (

                <div
                  key={phase.phase}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-lg"
                >

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h3 className="text-2xl font-bold">

                        Phase {phase.phase}: {phase.title}

                      </h3>

                      <p className="mt-2 text-slate-300">
                        {phase.description}
                      </p>

                    </div>

                    <span className="rounded-full bg-indigo-600 px-4 py-2 font-medium">
                      {phase.duration}
                    </span>

                  </div>

                  <div className="mt-8">

                    <h4 className="mb-3 text-xl font-semibold">
                      Skills You'll Learn
                    </h4>

                    <div className="flex flex-wrap gap-3">

                      {phase.skills.map((skill) => (

                        <span
                          key={skill}
                          className="rounded-full bg-slate-800 px-4 py-2 text-sm"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                  <div className="mt-8">

                    <h4 className="mb-4 text-xl font-semibold">
                      Learning Resources
                    </h4>

                    <div className="space-y-4">

                      {phase.resources.map((resource, index) => (

                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg border border-slate-700 bg-slate-800 p-4 transition hover:border-blue-500"
                        >

                          <div className="font-semibold">
                            {resource.title}
                          </div>

                          <div className="mt-1 text-sm text-slate-400">
                            {resource.type}
                          </div>

                        </a>

                      ))}

                    </div>

                  </div>

                  <div className="mt-8">

                    <h4 className="mb-4 text-xl font-semibold">
                      Projects
                    </h4>

                    <div className="space-y-4">

                      {phase.projects.map((project, index) => (

                        <div
                          key={index}
                          className="rounded-lg border border-slate-700 bg-slate-800 p-5"
                        >

                          <h5 className="text-lg font-semibold">
                            {project.title}
                          </h5>

                          <p className="mt-2 text-slate-300">
                            {project.description}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}