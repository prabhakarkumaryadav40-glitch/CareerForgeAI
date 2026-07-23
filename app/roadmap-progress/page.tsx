"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoadmapProgressPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  async function loadRoadmaps() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (data) {
    setRoadmaps(data);

    if (data.length > 0) {
      setSelectedRoadmap(data[0]);
      loadCompletedTasks(data[0].id, user.id);
    }
  }

  setLoading(false);
}

async function loadCompletedTasks(
  roadmapId: number,
  userId: string
) {
  const { data } = await supabase
    .from("roadmap_tasks")
    .select("task")
    .eq("roadmap_id", roadmapId)
    .eq("user_id", userId)
    .eq("completed", true);

  if (data) {
    setCompletedTasks(
      data.map((item) => item.task)
    );
  }
}

async function toggleSkill(
  skill: string,
  completed: boolean
) {
  if (!selectedRoadmap) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (completed) {
    await supabase
      .from("roadmap_tasks")
      .delete()
      .eq("roadmap_id", selectedRoadmap.id)
      .eq("user_id", user.id)
      .eq("task", skill);

    setCompletedTasks((prev) =>
      prev.filter((t) => t !== skill)
    );

    return;
  }

  await supabase
    .from("roadmap_tasks")
    .insert({
      roadmap_id: selectedRoadmap.id,
      user_id: user.id,
      task: skill,
      completed: true,
    });

  setCompletedTasks((prev) => [...prev, skill]);
}

if (loading) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      Loading Progress...
    </main>
  );
}

if (roadmaps.length === 0) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      No roadmaps found.
    </main>
  );
}
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Roadmap Progress
        </h1>

        <div className="mb-8">

          <label className="block mb-2 font-semibold">
  Select Roadmap
</label>

<select
  className="w-full bg-slate-900 rounded-lg p-3"
  value={selectedRoadmap?.id ?? ""}
  onChange={async (e) => {
    const roadmap = roadmaps.find(
      (r) => r.id === Number(e.target.value)
    );

    setSelectedRoadmap(roadmap);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && roadmap) {
      loadCompletedTasks(
        roadmap.id,
        user.id
      );
    }
  }}
>
  {roadmaps.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.roadmap.title}
    </option>
  ))}
</select>

        </div>
        <div className="bg-slate-900 rounded-xl p-6 mb-8">

  <h2 className="text-2xl font-bold">
    Overall Progress
  </h2>

  <div className="w-full bg-slate-800 rounded-full h-4 mt-4">

    <div
      className="bg-green-500 h-4 rounded-full transition-all"
      style={{
        width: `${
          selectedRoadmap
            ? Math.round(
                (completedTasks.length /
                  selectedRoadmap.roadmap.phases.flatMap(
                    (p: any) => p.skills
                  ).length) *
                  100
              )
            : 0
        }%`,
      }}
    />

  </div>

  <p className="mt-3 text-gray-300">

    {selectedRoadmap
      ? Math.round(
          (completedTasks.length /
            selectedRoadmap.roadmap.phases.flatMap(
              (p: any) => p.skills
            ).length) *
            100
        )
      : 0}
    %

  </p>

</div>

        <div className="space-y-8">

  <div className="bg-slate-900 rounded-xl p-6">

    <h2 className="text-3xl font-bold">
      {selectedRoadmap?.roadmap.title}
    </h2>

    <p className="text-gray-400 mt-3">
      {selectedRoadmap?.roadmap.overview}
    </p>

  </div>

  {selectedRoadmap?.roadmap.phases.map((phase: any) => (

    <div
      key={phase.phase}
      className="bg-slate-900 rounded-xl p-6"
    >

      <div className="flex justify-between items-center">

        <h3 className="text-2xl font-bold text-blue-400">
          Phase {phase.phase}
        </h3>

        <span className="bg-blue-600 px-3 py-1 rounded">
          {phase.duration}
        </span>

      </div>

      <h4 className="text-xl font-semibold mt-4">
        {phase.title}
      </h4>

      <p className="text-gray-400 mt-2">
        {phase.description}
      </p>

      <div className="mt-6">

        <h5 className="font-bold mb-3">
          Skills
        </h5>

        <div className="space-y-3">

          {phase.skills.map((skill: string) => (

            <div
              key={skill}
              className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg"
            >

              <input
  type="checkbox"
  checked={completedTasks.includes(skill)}
  onChange={() =>
    toggleSkill(
      skill,
      completedTasks.includes(skill)
    )
  }
/>

              <span>{skill}</span>

            </div>

          ))}

        </div>

      </div>

    </div>

  ))}

</div>

      </div>
    </main>
  );
}