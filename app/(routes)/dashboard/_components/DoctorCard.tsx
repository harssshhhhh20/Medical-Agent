import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
};

type props = {
  doctorAgent: doctorAgent;
};

function DoctorCard({ doctorAgent }: props) {
  return (
    <div className="group relative overflow-hidden">
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
      <Button
        className="w-[60%] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 top-[45%] absolute opacity-0 group-hover:opacity-100 transition"
      >
        Consult
      </Button>
    </div>
  );
}

export default DoctorCard;
