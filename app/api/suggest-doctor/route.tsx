import { openai } from "@/config/OpenAI";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-405b-instruct:free",
      messages: [
        {
          role: "system",
          content: `
You are a medical routing engine.

You are given a fixed list of doctor agents.
Each agent already contains these fields:
- id
- specialist
- description
- image

TASK:
- You MUST evaluate EVERY doctor agent in the provided list.
- For each doctor agent, decide whether the user's symptoms COULD reasonably match their specialty.
- If YES, include the ENTIRE doctor object EXACTLY as provided.
- If NO, exclude it.

IMPORTANT RULES:
- You MUST check ALL doctor agents one by one.
- You MUST NOT invent new doctors.
- You MUST NOT invent new specialties.
- You MUST NOT modify, rename, or remove any fields.
- You MUST NOT add new fields.
- You MUST NOT change values of id, specialist, description, or image.
- You MUST return ALL POSSIBLE matching doctors, not just the best one.
- Returning multiple doctors is REQUIRED when applicable.

OUTPUT FORMAT RULES:
- Return ONLY valid JSON.
- Return an ARRAY.
- Each array item MUST be one of the provided doctor agents.
- NO markdown.
- NO explanations.
- NO extra text.

Doctor agents list (USE ONLY THESE OBJECTS):
${JSON.stringify(AIDoctorAgents)}
          `,
        },
        {
          role: "user",
          content: `User symptoms: ${notes}`,
        },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    // Remove accidental markdown if present
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Invalid JSON from AI");
    }

    const doctorsArray = Array.isArray(parsed) ? parsed : [parsed];

    const normalizedDoctors = doctorsArray.map((doc) => ({
      id:doc.id ?? '',
      specialist: doc.specialist ?? "General Physician",
      image:
        typeof doc.image === "string" && doc.image.trim() !== ""
          ? doc.image
          : null,
      voiceId:doc.voiceId ?? '',
      agentPrompt:doc.agentPrompt ?? '',
      description:doc.description ?? '',
      subscriptionRequired:doc.subscriptionRequired ?? true
    }));

    return NextResponse.json(normalizedDoctors);
  } catch (error) {
    console.error("Suggest doctor error:", error);

    return NextResponse.json(
      { error: "Failed to suggest doctors" },
      { status: 500 }
    );
  }
}
