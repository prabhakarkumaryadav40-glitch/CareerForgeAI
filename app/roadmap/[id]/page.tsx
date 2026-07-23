"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RoadmapDetailsPage() {
  const { id } = useParams();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRoadmap();
    }
  }, [id]);

  async function loadRoadmap() {
    setLoading(true);

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setRoadmap(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading roadmap...
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Roadmap not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold">
          {roadmap.roadmap.title}
        </h1>

        <p className="text-gray-400 mt-4">
          {roadmap.roadmap.overview}
        </p>

        <div className="flex gap-4 mt-6">

  <span className="bg-blue-600 px-4 py-2 rounded-lg">
    {roadmap.roadmap.difficulty}
  </span>

  <span className="bg-green-600 px-4 py-2 rounded-lg">
    {roadmap.roadmap.estimatedDuration}
  </span>

</div>

<div className="mt-10 space-y-8">

  {roadmap.roadmap.phases.map((phase: any) => (

    <div
      key={phase.phase}
      className="bg-slate-900 rounded-xl p-6"
    >

      <h2 className="text-2xl font-bold text-blue-400">
        Phase {phase.phase}
      </h2>

      <h3 className="text-xl font-semibold mt-2">
        {phase.title}
      </h3>

      <p className="text-gray-400 mt-3">
        {phase.description}
      </p>

      <div className="mt-4">

        <span className="font-semibold">
          Duration:
        </span>

        <span className="ml-2">
          {phase.duration}
        </span>

      </div>

      <div className="mt-6">

  <h4 className="font-bold text-lg mb-3">
    Skills You'll Learn
  </h4>

  <div className="flex flex-wrap gap-2">

    {phase.skills.map((skill: string) => (

      <span
        key={skill}
        className="bg-blue-600 px-3 py-1 rounded-full text-sm"
      >
        {skill}
      </span>

    ))}

  </div>

  <div className="mt-8">

  <h4 className="font-bold text-lg mb-3">
    Learning Resources
  </h4>

  <div className="space-y-3">

    {phase.resources.map((resource: any, index: number) => (

      <a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition"
      >

        <div className="font-semibold">
          {resource.title}
        </div>

        <div className="text-gray-400 text-sm">
          {resource.type}
        </div>

      </a>

    ))}

  </div>
  <div className="mt-8">

  <h4 className="font-bold text-lg mb-3">
    Projects
  </h4>

  <div className="space-y-4">

    {phase.projects.map((project: any, index: number) => (

      <div
        key={index}
        className="bg-slate-800 rounded-lg p-4"
      >

        <h5 className="font-semibold">
          {project.title}
        </h5>

        <p className="text-gray-400 mt-2">
          {project.description}
        </p>

      </div>

    ))}

  </div>

</div>

</div>

</div>

    </div>

  ))}

</div>

      </div>
    </main>
  );
}