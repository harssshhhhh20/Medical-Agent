"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import NewSession from "./NewSession";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getHistory();
  },[])
  
  const getHistory=async()=>{
    const result = await axios.get('/api/session-chat?sessionId=all')
    setHistoryList(result.data);
    setLoading(false);
  }
  if (loading) {
    return <p className="mt-10 text-gray-500">Loading history...</p>;
  }

  return (
    <div className="mt-10">
      {historyList.length == 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 border p-7 border-dashed rounded-2xl border-2">
          <Image
            src={"/medical-assistance.png"}
            alt=""
            height={200}
            width={200}
          />
          <h2 className="font-bold text-xl">No recent check-up</h2>
          <p>You haven't consuled any doctor recently</p>
          <NewSession />
        </div>
      ) : (
        <div>
            <HistoryTable historyList={historyList}/>
        </div>
      )}
    </div>
  );
}

export default HistoryList;
