import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();



    const roadmaps = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

  

    const resumes = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    

    const interviews = await supabase
      .from("interview_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1);


      const jobMatcher = await supabase
  .from("job_matcher_results")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", {
    ascending: false,
  })
  .limit(1);




    const tasks = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("user_id", userId);


    const completedTasks =
      tasks.data?.filter(
        (task) => task.completed
      ).length || 0;

    const totalTasks =
      tasks.data?.length || 0;

    const progress =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0;

    return Response.json({
      roadmap: roadmaps.data?.[0] || null,
      resume: resumes.data?.[0] || null,
      interview: interviews.data?.[0] || null,
      jobMatcher: jobMatcher.data?.[0] || null,
      progress,
    });
  } catch (error) {
    console.error(
      "DASHBOARD ERROR:",
      error
    );

    return Response.json(
      {
        error: "Dashboard fetch failed",
      },
      {
        status: 500,
      }
    );
  }
}