import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return Response.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: `
You are CareerForge AI.

Rules:
- Give concise answers
- Use simple bullet points
- Do NOT use markdown
- Do NOT use tables
- Do NOT use ### headings
- Do NOT use **bold**
- Do NOT use HTML tags
- Keep answers under 300 words
- Format using simple numbered lists and bullet points

You are a career mentor helping students.
`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    return Response.json(
      {
        error: "Failed to get AI response",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}