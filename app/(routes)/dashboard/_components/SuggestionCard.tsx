import React from "react";
import { doctorAgent } from "./DoctorCard";
import Image from "next/image";

type props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: any;
  selectedDoctor: doctorAgent;
};

function SuggestionCard({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: props) {
  return (
    <div
      className={`flex flex-col items-center border rounded-xl shadow p-2 hover:border-blue-500 cursor-pointer ${selectedDoctor?.specialist == doctorAgent?.specialist && 'border-blue-700 bg-blue-50 border-b-2'}`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        height={70}
        width={70}
        className="w-[100px] h-[100px] rounded-4xl object-cover"
      />
      <h2 className="font-bold mt-2 text-center">{doctorAgent.specialist}</h2>
    </div>
  );
}

export default SuggestionCard;
