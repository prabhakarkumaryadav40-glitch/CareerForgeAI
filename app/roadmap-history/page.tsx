"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function RoadmapHistoryPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    const {
  data: { user },
} = await supabase.auth.getUser();

console.log("CURRENT USER:", user);
console.log("CURRENT USER ID:", user?.id);

if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
  .from("roadmaps")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", {
    ascending: false,
  });

console.log("QUERY ERROR:", error);
console.log("ROADMAP COUNT:", data?.length);
console.log("ROADMAP DATA:", data);

    if (!error && data) {
      setRoadmaps(data);
    }

    setLoading(false);
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Roadmaps...
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Roadmap History
        </h1>


        {roadmaps.length === 0 ? (

          <div className="bg-slate-900 p-6 rounded-xl">
            No roadmaps found.
          </div>

        ) : (

          <div className="space-y-6">

            {roadmaps.map((item) => {

  const roadmap = item.roadmap;

  return (

    <Link
      key={item.id}
      href={`/roadmap/${item.id}`}
      className="block"
    >
      <div className="bg-slate-900 p-6 rounded-xl hover:bg-slate-800 transition duration-200 cursor-pointer">

                  <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">
                      {roadmap?.title || item.career_goal}
                    </h2>


                    <span className="bg-blue-600 px-3 py-1 rounded">
                      {item.current_level}
                    </span>

                  </div>


                  <div className="mt-3 text-gray-300 space-y-1">

                    <p>
                      Career Goal:
                      <span className="ml-2 text-white">
                        {item.career_goal}
                      </span>
                    </p>


                    <p>
                      Duration:
                      <span className="ml-2 text-white">
                        {item.timeframe}
                      </span>
                    </p>


                    <p>
                      Hours/Week:
                      <span className="ml-2 text-white">
                        {item.hours_per_week}
                      </span>
                    </p>


                    <p>
                      Language:
                      <span className="ml-2 text-white">
                        {item.preferred_language}
                      </span>
                    </p>

                  </div>



                  <div className="mt-5 bg-slate-800 p-4 rounded-lg">

                    <h3 className="text-xl font-bold mb-3">
                      Roadmap Overview
                    </h3>


                    <p className="text-gray-300">
                      {roadmap?.overview}
                    </p>


                    <div className="mt-4 flex gap-3">

                      <span className="bg-green-600 px-3 py-1 rounded">
                        {roadmap?.difficulty}
                      </span>


                      <span className="bg-purple-600 px-3 py-1 rounded">
                        {roadmap?.estimatedDuration}
                      </span>

                    </div>

                  </div>



                  <div className="mt-5">

                    <h3 className="text-xl font-bold mb-3">
                      Phases: {roadmap?.phases?.length || 0}
                    </h3>


                    <div className="space-y-3">

                      {roadmap?.phases?.map((phase:any)=>(

                        <div
                          key={phase.phase}
                          className="bg-slate-800 p-4 rounded-lg"
                        >

                          <h4 className="font-bold">
                            Phase {phase.phase}: {phase.title}
                          </h4>


                          <p className="text-gray-300">
                            {phase.duration}
                          </p>


                        </div>

                      ))}

                    </div>

                  </div>



                  <p className="text-sm text-gray-500 mt-5">

                    Created:
                    {" "}
                    {new Date(
                      item.created_at
                    ).toLocaleString()}

                  </p>


                      </div>
    </Link>

);

            })}

          </div>

        )}

      </div>

    </main>
  );
}