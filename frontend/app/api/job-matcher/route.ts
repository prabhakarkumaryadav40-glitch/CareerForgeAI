import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

type JobMatchResult = {
  matchScore: number;
  atsScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
};

export async function POST(req: Request) {

  try {
    const { resume, jobDescription, userId } = await req.json();

    if (!resume?.trim() || !jobDescription?.trim()) {
      return Response.json(
        {
          error: "Resume and Job Description are required.",
        },
        {
          status: 400,
        }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",

      temperature: 0,

      max_tokens: 1200,

      messages: [
        {
          role: "system",
          content: `
You are CareerForge AI.

You compare resumes with job descriptions.

VERY IMPORTANT:

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap JSON inside \`\`\`.

Do NOT explain anything.

Do NOT truncate the response.

Do NOT include any extra text.

Return exactly this structure:

{
  "matchScore": 90,
  "atsScore": 88,
  "summary": "One short summary",

  "matchingSkills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
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
  ]
}

Rules:

- matchScore: integer between 0-100
- atsScore: integer between 0-100
- summary: maximum 2 sentences
- matchingSkills: 3-10 items
- missingSkills: 3-10 items
- suggestions: exactly 5 items

Return ONLY JSON.
`,
        },
        {
          role: "user",
          content: `
Resume

${resume}

-----------------------

Job Description

${jobDescription}
`,
        },
      ],
    });

    let raw = completion.choices[0].message.content ?? "{}";

    // Remove markdown if present
    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }

    let analysis: JobMatchResult;

    try {
      analysis = JSON.parse(raw);
    } catch (err) {
      console.error("JSON Parse Error");
      console.error(raw);

      return Response.json(
        {
          error: "AI returned invalid JSON.",
          raw,
        },
        {
          status: 500,
        }
      );
    }
    if (
      typeof analysis.matchScore !== "number" ||
      typeof analysis.atsScore !== "number"
    ) {
      return Response.json(
        {
          error: "AI returned an incomplete response.",
        },
        {
          status: 500,
        }
      );
    }
const result = await supabaseAdmin
  .from("job_matcher_results")
  .insert({
    user_id: userId,
    match_score: analysis.matchScore,
    ats_score: analysis.atsScore,

    analysis: analysis,
    strengths: analysis.matchingSkills,
    skill_gaps: analysis.missingSkills,
    recommendations: analysis.suggestions,
  });

    return Response.json(analysis);
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: error.message || "Failed to analyze job match.",
      },
      {
        status: 500,
      }
    );
  }
}