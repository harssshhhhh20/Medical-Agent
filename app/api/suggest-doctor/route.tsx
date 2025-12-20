import { openai } from "@/config/OpenAI";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    

  try {
    const {notes}=await req.json()
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
            role:"system",
            content:JSON.stringify(AIDoctorAgents)
        },
        {
          role: "user",
          content: "User Notes/Symptoms:"+notes+", depends on user notes and symptoms, Please suggest list of doctors, return object in JSON only"
        }
      ],
    });
    const rawResp=completion.choices[0].message||'';
    //@ts-ignore
    const Resp=rawResp.content.trim().replace('```json','').replace('```','')
    const JSONResp=JSON.parse(Resp);

    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
