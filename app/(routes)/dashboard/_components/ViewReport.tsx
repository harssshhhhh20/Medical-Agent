import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from 'moment'
type Props={
    record:SessionDetail
}

function ViewReport({record}:Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild><Button variant={'ghost'} size={'sm'}>View Report</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle asChild>
                <h2 className="text-center text-4xl">Your medical Report</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-10">
                <h2 className="font-bold text-blue-500 text-lg">Video Info</h2>
                <div className="grid grid-cols-2">
                    <div>
                        <h2><span className="font-bold">Doctor Specialisation:</span>{record.selectedDoctor?.specialist}</h2>
                        <h2>Visit Date:{moment(new Date(record.createdOn)).format("Do/MMMM/YYYY")}</h2>
                    </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReport;
