import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase-server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      targetRole,
      skills,
      userId,
    } = await req.json();

    console.log("========== ROADMAP REQUEST ==========");
    console.log("TARGET ROLE:", targetRole);
    console.log("SKILLS:", skills);
    console.log("USER ID RECEIVED:", userId);

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
You are an expert career coach.

Generate ONLY a concise 3-month learning roadmap.

Rules:
- Use plain text only
- No markdown tables
- No HTML tags

Format:

Month 1
• Skill 1
• Skill 2
• Skill 3
• Skill 4

Month 2
• Skill 1
• Skill 2
• Skill 3
• Skill 4

Month 3
• Skill 1
• Skill 2
• Skill 3
• Skill 4
`,
          },
          {
            role: "user",
            content: `
Target Role: ${targetRole}
Current Skills: ${skills}
`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

    const roadmap =
      completion.choices[0].message.content || "";

    console.log("ROADMAP GENERATED");

    const skillList = skills
      .toLowerCase()
      .split(",")
      .map((skill: string) => skill.trim());

    let score = 20;

    const importantSkills = [
      "python",
      "sql",
      "git",
      "react",
      "javascript",
      "machine learning",
      "dsa",
    ];

    importantSkills.forEach((skill) => {
      if (skillList.includes(skill)) {
        score += 10;
      }
    });

    score = Math.min(score, 100);

    console.log("CALCULATED SCORE:", score);
    console.log("INSERTING USER ID:", userId);

    const {
  data: roadmapData,
  error,
} = await supabaseServer
      .from("roadmaps")
      .insert([
        {
          role: targetRole,
          skills,
          roadmap,
          score,
          user_id: userId,
        },
      ])
      .select()
      .single();

    console.log("ROADMAP INSERT RESULT:", roadmapData);
    console.log("ROADMAP INSERT ERROR:", error);

    if (error) {
      console.error(
        "Roadmap Save Error:",
        error
      );

      return Response.json(
        {
          error,
        },
        {
          status: 500,
        }
      );
    }

    if (roadmapData) {
      const tasks = roadmap
        .split("\n")
        .filter((line) =>
          line.trim().startsWith("•")
        )
        .map((line) => ({
          task: line
            .replace("•", "")
            .trim(),
          completed: false,
          roadmap_id: roadmapData.id,
          user_id: userId,
        }));

      console.log(
        "GENERATED TASKS:",
        tasks
      );

      if (tasks.length > 0) {
        const {
          error: taskError,
        } = await supabaseServer
          .from("roadmap_tasks")
          .insert(tasks);

        console.log(
          "TASK INSERT ERROR:",
          taskError
        );

        if (taskError) {
          return Response.json(
            {
              error: taskError,
            },
            {
              status: 500,
            }
          );
        }
      }
    }

    return Response.json({
      roadmap,
      score,
    });
  } catch (error) {
    console.error(
      "GENERATE ROADMAP ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to generate roadmap",
      },
      {
        status: 500,
      }
    );
  }
}


