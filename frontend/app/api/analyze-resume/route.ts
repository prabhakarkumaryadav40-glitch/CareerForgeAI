import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase-server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      resumeText,
      userId,
    } = await req.json();

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
You are CareerForge Resume AI.

Analyze the resume carefully.

Return ONLY valid JSON.

Do not use markdown.
Do not use code blocks.
Do not add explanations before or after the JSON.

Return exactly this structure:

{
  "score": 85,
  "summary": "One short summary",

  "strengths": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],

  "weaknesses": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],

  "missingSkills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ],

  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ],

  "interviewReadiness": "One sentence"
}

The score must be between 0 and 100.

Respond ONLY with valid JSON.
`,
          },
          {
            role: "user",
            content: resumeText,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      });

    const rawResponse =
  completion.choices[0].message.content || "{}";

let parsedAnalysis;

try {
  parsedAnalysis = JSON.parse(rawResponse);
} catch (error) {
  console.error("Failed to parse AI JSON:", error);

  return Response.json(
    {
      error: "Invalid AI response format",
    },
    {
      status: 500,
    }
  );
}

const analysis = parsedAnalysis;
const score = parsedAnalysis.score || 0;

    const { error } = await supabaseServer
      .from("resume_analyses")
      .insert([
        {
          resume_text: resumeText,
          analysis: JSON.stringify(parsedAnalysis, null, 2),
          score,
          user_id: userId,
        },
      ]);

    if (error) {
      console.error(
        "Supabase Error:",
        error
      );
    }

    return Response.json({
  analysis: parsedAnalysis,
  score,
});
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to analyze resume",
      },
      {
        status: 500,
      }
    );
  }
}
