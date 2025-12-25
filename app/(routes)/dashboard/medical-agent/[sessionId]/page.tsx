"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
  createdBy: string;
};

type messages = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [onCall, setOnCall] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currRole, setCurrRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const router = useRouter();

  useEffect(() => {
    sessionId && getSesssionInfo();
  }, [sessionId]);

  const getSesssionInfo = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    setSessionDetail(result.data);
  };

  const startCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);
    const VapiConfig = {
      name: "Medical AI Agent",
      firstMessage:
        "Hi there! Im your AI Medical Assistant. My job is to help you with any health questions or concerns you may have. How are you feeling?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail?.selectedDoctor?.voiceId ?? "",
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };
    //@ts-ignore
    vapi.start(VapiConfig);
    vapi.on("call-start", () => {
      console.log("Call started");
      setOnCall(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setOnCall(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType == "partial") {
          setLiveTranscript(transcript);
          setCurrRole(role);
        } else if (transcriptType == "final") {
          setMessages((prev: any) => [
            ...prev,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrRole(null);
        }
      }
    });
    vapi.on("speech-start", () => {
      if (!onCall) return;
      console.log("Assistant started speaking");
      setCurrRole("Assistant");
    });
    vapi.on("speech-end", () => {
      if (!onCall) return;
      console.log("Assistant stopped speaking");
      setCurrRole("User");
    });
  };
  const endCall = async () => {

    try {
      if (!vapiInstance) {
        console.log("NO VAPI INSTANCE");
        return;
      }

      vapiInstance.stop();
      

      setOnCall(false);
      setVapiInstance(null);

      
      const result = await generateReport();
      console.log("FINAL REPORT RESULT:", result);
    } catch (err) {
      console.error("END CALL ERROR:", err);
    }
    toast.success('Your report has been generated')
    router.replace('/dashboard');
  };

  const generateReport = async () => {
    try {
      const result = await axios.post("/api/medical-report", {
        messages,
        sessionDetail,
        sessionId,
      });
      return result.data;
    } catch (err: any) {
      console.error("API ERROR:", err.response?.data || err);
      throw err;
    }
  };

  return (
    <div className="p-10 border rounded-3xl shadow">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`w-4 h-4 rounded-full ${
              onCall ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {onCall ? "Connected" : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetail && (
        <div className="flex flex-col items-center mt-7">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist || ""}
            width={120}
            height={120}
            className="h-[125px] w-[125px] object-cover rounded-full"
          />
          <h2 className="font-bold text-gray-500 mt-3 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <div className="mt-30 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg: messages, index) => (
              <div key={index}>
                <h2 className="text-gray-400">
                  {msg.role}:{msg.text}
                </h2>
              </div>
            ))}

            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-xl">
                {currRole}:{liveTranscript}
              </h2>
            )}
          </div>
          {!onCall ? (
            <Button className="mt-22" onClick={startCall}>
              <PhoneCall />
              Start Conversation
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={endCall}>
              <PhoneOff />
              End Conversation
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
