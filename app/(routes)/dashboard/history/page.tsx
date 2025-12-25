"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from 'moment'
import ViewReport from "../_components/ViewReport";
import axios from "axios";



function History() {

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
    return <p className=" flex flex-col items-center text-gray-500 text-2xl">Loading history...</p>;
  }
  return (
    <div>
      <Table>
        <TableCaption>Previous Visit Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >AI Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.selectedDoctor?.specialist}</TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell> {moment(new Date(record.createdOn)).format("Do/MMMM/YYYY")}</TableCell>
              <TableCell className="text-right"><ViewReport record={record}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default History;
