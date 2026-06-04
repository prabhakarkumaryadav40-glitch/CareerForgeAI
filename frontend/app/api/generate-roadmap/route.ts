import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { targetRole, skills } = await req.json();

    const completion = await openai.chat.completions.create({
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
- No introductions
- No conclusions
- No extra explanations

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

Generate a practical roadmap for getting job-ready.
`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return Response.json({
      roadmap: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}