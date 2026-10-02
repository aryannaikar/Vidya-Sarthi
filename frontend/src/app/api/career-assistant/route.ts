import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, studentContext, topMatches } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      "";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY is not configured",
      });
    }

    // Grounding system prompt for Vidya Sarthi Career Assistant
    const systemPrompt = `You are Vidya Sarthi's AI Career Assistant, a supportive, highly knowledgeable technical mentor for Indian engineering students.
Ground all advice strictly in the student's academic background, verified technical competencies, and real matched opportunities.

Student Context:
- Name: ${studentContext?.fullName || "Student"}
- Degree: ${studentContext?.degree || "B.Tech Computer Science"}
- Graduating Year: ${studentContext?.graduatingYear || 2027}
- Verified Skills: ${(studentContext?.skills || ["TypeScript", "Python"]).join(", ")}
- Target Career Roles: ${(studentContext?.targetRoles || ["Software Engineering"]).join(", ")}
- Top Matched Opportunities: ${JSON.stringify(topMatches?.slice(0, 3) || [])}

Rules:
1. Provide actionable, concise, and technically rigorous career advice.
2. Highlight skill gaps without discouraging the student.
3. Suggest concrete engineering projects or open-source contribution patterns.
4. Keep the tone professional, encouraging, and focused.`;

    const userMessage = `Student Question: ${prompt}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (geminiResponse.ok) {
      const data = await geminiResponse.json();
      const candidateText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidateText) {
        return NextResponse.json({
          success: true,
          answer: candidateText,
          modelUsed: model,
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: `Gemini API returned status ${geminiResponse.status}`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to query Gemini",
    });
  }
}
