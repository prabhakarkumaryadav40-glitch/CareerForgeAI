import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildRoadmapPrompt } from "@/lib/roadmapPrompt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type GenerateRoadmapBody = {
  userId: string;
  careerGoal: string;
  currentLevel: string;
  timeframe: string;
  hoursPerWeek: number;
  preferredLanguage: string;
};

type RoadmapResponse = {
  title: string;
  overview: string;
  estimatedDuration: string;
  difficulty: string;
  phases: {
    phase: number;
    title: string;
    duration: string;
    description: string;
    skills: string[];
    resources: {
      title: string;
      type: string;
      url: string;
    }[];
    projects: {
      title: string;
      description: string;
    }[];
  }[];
};

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {}

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found.");
  }

  return JSON.parse(text.slice(start, end + 1));
}

function validateRoadmap(data: any): RoadmapResponse {
  if (!data.title) {
    throw new Error("Missing roadmap title.");
  }

  if (!Array.isArray(data.phases)) {
    throw new Error("Roadmap phases missing.");
  }

  return data as RoadmapResponse;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRoadmapBody = await req.json();

    const {
      userId,
      careerGoal,
      currentLevel,
      timeframe,
      hoursPerWeek,
      preferredLanguage,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!careerGoal) {
      return NextResponse.json(
        { error: "Career goal is required." },
        { status: 400 }
      );
    }

    const prompt = buildRoadmapPrompt({
      careerGoal,
      currentLevel,
      timeframe,
      hoursPerWeek,
      preferredLanguage,
    });
    
        const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "AI Career Roadmap Generator",
      },
      body: JSON.stringify({
        model:
  process.env.OPENROUTER_MODEL ||
  "deepseek/deepseek-chat-v3-0324",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI career mentor. Always return ONLY valid JSON with no markdown, no explanations, and no code fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter Error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to generate roadmap.",
        },
        {
          status: 500,
        }
      );
    }

    const completion = await response.json();

    const aiContent =
      completion?.choices?.[0]?.message?.content ?? "";

    if (!aiContent) {
      return NextResponse.json(
        {
          error: "AI returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    const parsedRoadmap = extractJSON(aiContent);

const roadmap = validateRoadmap(parsedRoadmap);

console.log("Roadmap created successfully");

    // Save roadmap

const { data: savedRoadmap, error: roadmapError } =
  await supabase
    .from("roadmaps")
    .insert({
      user_id: userId,
      career_goal: careerGoal,
      current_level: currentLevel,
      timeframe,
      hours_per_week: hoursPerWeek,
      preferred_language: preferredLanguage,
      roadmap,
    })
    .select()
    .single();

if (roadmapError) {
  console.error("Supabase Error:", roadmapError);

  return NextResponse.json(
    {
      error: "Failed to save roadmap.",
    },
    {
      status: 500,
    }
  );
}

return NextResponse.json(
  {
    success: true,
    roadmap,
    id: savedRoadmap.id,
  },
  {
    status: 200,
  }
);

  } catch (error) {
    console.error("Generate Roadmap Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}