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
      .select("*", { count: "exact" })
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
      .select("*", { count: "exact" })
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




  const latestRoadmap = roadmaps.data?.[0];

const tasks = latestRoadmap
  ? await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("roadmap_id", latestRoadmap.id)
  : { data: [] };

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
    
    const resumeScore =
  resumes.data?.[0]?.score || 0;

const interviewScore =
  interviews.data?.[0]?.score || 0;

const careerScore = Math.round(
  (resumeScore + interviewScore + progress) / 3
);

    return Response.json({
      roadmap: roadmaps.data?.[0] || null,
      resume: resumes.data?.[0] || null,
      interview: interviews.data?.[0] || null,
      interviewCount: interviews.count || 0,
      roadmapCount: roadmaps.count || 0,
      jobMatcher: jobMatcher.data?.[0] || null,
      progress,
careerScore,
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