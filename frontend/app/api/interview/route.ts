import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      action,
      role,
      question,
      answer,
      userId,
    } = await req.json();

    if (action === "question") {
      const completion =
        await openai.chat.completions.create({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `
You are an expert technical interviewer.

Rules:
- Generate ONE interview question only.
- Tailor it to the target role.
- Do not provide answers.
- Keep under 50 words.
`,
            },
            {
              role: "user",
              content: `Target Role: ${role}`,
            },
          ],
        });

      return Response.json({
        question:
          completion.choices[0].message.content,
      });
    }

    if (action === "evaluate") {
      const completion =
        await openai.chat.completions.create({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `
You are an expert interviewer.

Evaluate the candidate's answer.

Format:

Score: X/10

Strengths:
- Point 1
- Point 2

Weaknesses:
- Point 1
- Point 2

Better Answer:
- Improved answer

Keep feedback concise.
Do not use markdown tables.
`,
            },
            {
              role: "user",
              content: `
Role: ${role}

Question:
${question}

Candidate Answer:
${answer}
`,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        });

      const feedback =
        completion.choices[0].message.content || "";

      const { error } = await supabase
        .from("interview_results")
        .insert([
          {
            role,
            question,
            answer,
            feedback,
            user_id: userId,
          },
        ]);

      if (error) {
        console.error(
          "Supabase Interview Save Error:",
          error
        );
      }

      return Response.json({
        feedback,
      });
    }

    return Response.json(
      {
        error: "Invalid action",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Interview API failed",
      },
      {
        status: 500,
      }
    );
  }
}
