"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoadmapProgressPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setTasks(data);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    await supabase
      .from("roadmap_tasks")
      .insert([
        {
          task: newTask,
          completed: false,
        },
      ]);

    setNewTask("");

    loadTasks();
  };

  const toggleTask = async (
    id: number,
    completed: boolean
  ) => {
    await supabase
      .from("roadmap_tasks")
      .update({
        completed: !completed,
      })
      .eq("id", id);

    loadTasks();
  };

  const completedTasks =
    tasks.filter((t) => t.completed).length;

  const progress =
    tasks.length > 0
      ? Math.round(
          (completedTasks / tasks.length) * 100
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Roadmap Progress Tracker
        </h1>

        <div className="bg-slate-900 p-6 rounded-xl">

          <h2 className="text-2xl font-bold">
            Progress: {progress}%
          </h2>

          <div className="w-full bg-slate-800 rounded-full h-4 mt-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="flex gap-3 mt-6">

            <input
              type="text"
              placeholder="Add task..."
              value={newTask}
              onChange={(e) =>
                setNewTask(e.target.value)
              }
              className="flex-1 p-3 rounded-lg bg-slate-800"
            />

            <button
              onClick={addTask}
              className="bg-blue-600 px-4 py-3 rounded-lg"
            >
              Add
            </button>

          </div>

          <div className="mt-6 space-y-3">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 p-4 rounded-lg flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTask(
                      task.id,
                      task.completed
                    )
                  }
                />

                <span
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : ""
                  }
                >
                  {task.task}
                </span>
              </div>
            ))}

          </div>

        </div>
      </div>
    </main>
  );
}