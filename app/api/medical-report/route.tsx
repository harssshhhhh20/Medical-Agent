import { db } from "@/config/db";
import { openai } from "@/config/OpenAI";
import { SessionChatTable } from "@/config/schema";
import { AIDoctorAgents } from "@/shared/list";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and conversation between AI Medical Agent and user, generate a structured report with the following fields:

sessionId: a unique session identifier

agent: the medical specialist name (e.g., "General Physician AI")

user: name of the patient or "Anonymous" if not provided

timestamp: current date and time in ISO format

chiefComplaint: one-sentence summary of the main health concern

summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations

symptoms: list of symptoms mentioned by the user

duration: how long the user has experienced the symptoms

severity: mild, moderate, or severe

medicationsMentioned: list of any medicines mentioned

recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}


Only include valid fields. Respond with nothing else.`;

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  try {
    const userInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetail) +
      ", Conversation" +
      JSON.stringify(messages);
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-405b-instruct:free",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: userInput },
      ],
    });

    const rawResp = completion.choices[0].message;

    //@ts-ignore
    const content = rawResp.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON found in LLM response");
    }

    const JSONResp = JSON.parse(jsonMatch[0]);

    const result = await db
      .update(SessionChatTable)
      .set({
        report: JSONResp,
        conversation:messages
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
