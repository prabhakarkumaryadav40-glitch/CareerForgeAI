"use client";

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

    if (!user) {
      console.log("NO USER FOUND");
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

    console.log("ROADMAPS:", data);
    console.log("ERROR:", error);

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
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-slate-900 p-6 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {roadmap.role}
                  </h2>

                  <span className="bg-blue-600 px-3 py-1 rounded">
                    Score: {roadmap.score}/100
                  </span>
                </div>

                <p className="text-gray-400 mt-2">
                  Skills: {roadmap.skills}
                </p>

                <div className="mt-4 whitespace-pre-wrap bg-slate-800 p-4 rounded-lg">
                  {roadmap.roadmap}
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Created:{" "}
                  {new Date(
                    roadmap.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}