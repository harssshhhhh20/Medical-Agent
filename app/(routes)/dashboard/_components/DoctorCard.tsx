"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArrowRight, Loader, Loader2Icon, PaintBucket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
  subscriptionRequired: boolean;
};

type props = {
  doctorAgent: doctorAgent;
};

function DoctorCard({ doctorAgent }: props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onStartConsultation = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: "New Query",
      selectedDoctor: doctorAgent,
    });
   

    if (result.data?.sessionId) {
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  const { sessionClaims, isLoaded } = useAuth();
  //@ts-ignore
  const paidUser = isLoaded && sessionClaims?.pla === "u:pro_access";
  

  return (
    <div className="group relative overflow-hidden">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute p-1 right-2 mt-2">Premium</Badge>
      )}
      <Image
        className="w-full h-[350px] object-cover rounded-xl shadow-xl group-hover:opacity-40"
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
      />
      <h2 className="font-bold mt-2">{doctorAgent.specialist}</h2>
      <p className=" line-clamp-2 text-sm text-gray-500">
        {doctorAgent.description}
      </p>
      {(!doctorAgent.subscriptionRequired || paidUser) && (
        <Button
          onClick={onStartConsultation}
          className="w-[60%] font-bold left-1/2 -translate-x-1/2 -translate-y-1/2 top-[45%] absolute opacity-0 group-hover:opacity-100 transition"
        >
          Consult
          {loading ? (
            <Loader2Icon className="animate-spin ml-2" />
          ) : (
            <ArrowRight className="ml-2" />
          )}
        </Button>
      )}
    </div>
  );
}

export default DoctorCard;
