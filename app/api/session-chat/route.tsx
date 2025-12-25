import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();
  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      }) //@ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0]?.SessionChatTable);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId missing" },
        { status: 400 }
      );
    }


    const normalizedSessionId = sessionId.trim().toLowerCase();


    if (normalizedSessionId === "all") {
      const result = await db
        .select()
        .from(SessionChatTable)
        //@ts-ignore
        .where(eq(SessionChatTable.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(SessionChatTable.id));

      return NextResponse.json(result);
    }
    const result = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.sessionId, sessionId))
      .limit(1);

    return NextResponse.json(result[0] ?? null);
  } catch (error) {
    console.error("GET session-chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
