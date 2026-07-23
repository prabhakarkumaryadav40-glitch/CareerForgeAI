export const buildRoadmapPrompt = ({
  careerGoal,
  currentLevel,
  timeframe,
  hoursPerWeek,
  preferredLanguage,
}: {
  careerGoal: string;
  currentLevel: string;
  timeframe: string;
  hoursPerWeek: number;
  preferredLanguage: string;
}) => `
You are an expert AI Career Mentor and Senior Software Engineer.

Create a personalized career roadmap.

User Information:

Career Goal:
${careerGoal}

Current Level:
${currentLevel}

Available Time:
${hoursPerWeek} hours per week

Target Duration:
${timeframe}

Preferred Language:
${preferredLanguage}


Create a practical roadmap including:

- Required skills
- Learning order
- Industry relevant technologies
- Hands-on projects
- Learning resources
- Career preparation


IMPORTANT RULES:

Return ONLY valid JSON.

Do not use Markdown.
Do not use explanations.
Do not use code blocks.
Do not add text before or after JSON.


Return JSON exactly in this structure:

{
  "title": "Career roadmap title",
  "overview": "Short roadmap overview",
  "estimatedDuration": "Duration",
  "difficulty": "Beginner or Intermediate or Advanced",

  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "Phase duration",
      "description": "What will be learned",

      "skills": [
        "Skill 1",
        "Skill 2"
      ],

      "resources": [
        {
          "title": "Resource name",
          "type": "Course or Documentation or Video",
          "url": "https://example.com"
        }
      ],

      "projects": [
        {
          "title": "Project name",
          "description": "Project explanation"
        }
      ]
    }
  ]
}
`;