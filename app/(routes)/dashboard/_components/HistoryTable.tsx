import React from "react";
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
import { Button } from "@/components/ui/button";
import moment from 'moment'
import ViewReport from "./ViewReport";

type Props = {
  historyList: SessionDetail[];
};

function HistoryTable({ historyList }: Props) {
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

export default HistoryTable;
