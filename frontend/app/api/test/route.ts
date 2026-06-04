export async function GET() {
  return Response.json({
    apiKeyExists: !!process.env.OPENROUTER_API_KEY,
  });
}