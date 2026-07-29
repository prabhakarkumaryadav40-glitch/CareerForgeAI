import { supabaseServer } from "@/lib/supabase-server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      action,
      role,
      difficulty = "Medium",
      interviewType = "Mixed",
      previousQuestions = [],
      questions = [],
      userId,
    } = body;

    // -----------------------------
    // Generate Interview Question
    // -----------------------------
    if (action === "question") {
      const completion =
        await openai.chat.completions.create({
         model: "deepseek/deepseek-chat-v3-0324",
          temperature: 0.8,

          max_tokens: 250,

          messages: [
            {
              role: "system",

              content: `
You are a Senior Software Engineer interviewing candidates for Google, Microsoft, Amazon, Meta and Netflix.

Generate ONLY ONE interview question.

Target Role:
${role}

Interview Difficulty:
${difficulty}

Interview Type:
${interviewType}

Rules:

• Never repeat a previous question.

• If interview type is Mixed, randomly choose from:
- Technical
- Coding
- HR
- Behavioural
- Problem Solving
- Scenario Based

Difficulty:

Easy
- Fresher
- Basic concepts

Medium
- Intermediate
- Real world

Hard
- Senior
- Architecture
- Scalability
- Performance

Return ONLY ONE interview question.

Rules:
- Return only the interview question.
- Do NOT write "Question:"
- Do NOT write "Type:"
- Do NOT write "Focus:"
- Do NOT use markdown.
- Do NOT add explanations.
- Do NOT add bullet points.
- Do NOT include category names.
- Output only the interview question text.
`,
            },

            {
              role: "user",

              content: `
Previously Asked Questions

${previousQuestions.join("\n")}
`,
            },
          ],
        });


const rawQuestion =
  completion.choices[0].message.content || "";

const cleanQuestion = rawQuestion
  .replace(/\*\*/g, "")
  .replace(/^Question:\s*/i, "")
  .replace(/^Type:.*$/gim, "")
  .replace(/^Focus:.*$/gim, "")
  .trim();

return Response.json({
  question: cleanQuestion,
});
    }
        // -----------------------------
    // Evaluate Complete Interview
    // -----------------------------
    if (action === "evaluate") {
      const formattedInterview =
        questions
          .map(
            (
              item: {
                question: string;
                answer: string;
              },
              index: number
            ) => `
Question ${index + 1}
${item.question}

Candidate Answer
${item.answer}
`
          )
          .join("\n\n");

      const completion =
        await openai.chat.completions.create({
          model: "deepseek/deepseek-chat-v3-0324",

          temperature: 0.4,

          max_tokens: 1200,

          messages: [
            {
              role: "system",

              content: `
You are a Senior Engineering Manager evaluating software engineering interviews.

Evaluate the interview objectively.

IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT use code blocks.

Do NOT explain anything outside the JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "technicalSkills": 0,
  "communication": 0,
  "problemSolving": 0,
  "confidence": 0,
  "recommendation": "",
  "strengths": [],
  "weaknesses": [],
  "learningResources": [],
  "overallFeedback": ""
}

Rules:

- All scores must be integers from 0 to 100.
- If an answer is empty, give zero credit for that question.
- If all answers are empty, overallScore must be 0 and recommendation must be "No Hire".
- strengths must contain exactly 3 items.
- weaknesses must contain exactly 3 items.
- learningResources must contain exactly 3 items.
- overallFeedback should be a concise paragraph of about 100 words.

Do not use markdown tables.
`,
            },

            {
              role: "user",

              content: `
Target Role

${role}

Interview Transcript

${formattedInterview}
`,
            },
          ],
        });

      const rawResponse =
  completion.choices[0].message.content || "";

// Remove markdown code fences if AI returns them
const cleanedResponse = rawResponse
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let feedback;

try {
  feedback = JSON.parse(cleanedResponse);
} catch (error) {
  console.error("Failed to parse AI JSON:", cleanedResponse);

  return Response.json(
    {
      success: false,
      error: "AI returned an invalid report format.",
    },
    {
      status: 500,
    }
  );
}
    // -----------------------------
// Save Complete Interview
// -----------------------------

const interviewTranscript = questions.map(
  (q: {
    question: string;
    answer: string;
  }) => ({
    question: q.question,
    answer: q.answer,
  })
);
console.log("Saving interview for user:", userId);
const { error } = await supabaseServer
  .from("interview_results")
  .insert([
    {
      user_id: userId,

      role,

      interview: interviewTranscript,

      feedback,

      overall_score: feedback.overallScore,

      technical_skills:
        feedback.technicalSkills,

      communication:
        feedback.communication,

      problem_solving:
        feedback.problemSolving,

      confidence:
        feedback.confidence,

      recommendation:
        feedback.recommendation,

      strengths:
        feedback.strengths,

      weaknesses:
        feedback.weaknesses,

      learning_resources:
        feedback.learningResources,

      overall_feedback:
        feedback.overallFeedback,
    },
  ]);

if (error) {
  console.error(
    "Supabase Save Error:",
    error
  );
}

return Response.json({
  success: true,
  feedback,
});

} // <-- closes if (action === "evaluate")

// -----------------------------
// Invalid Action
// -----------------------------

return Response.json(
  {
    error: "Invalid action",
  },
  {
    status: 400,
  }
);

} catch (error) {
  console.error(
    "Interview API Error:",
    error
  );

  return Response.json(
    {
      success: false,
      error: "Interview API failed.",
    },
    {
      status: 500,
    }
  );
}
}