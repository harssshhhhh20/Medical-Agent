"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import DoctorCard, { doctorAgent } from "./DoctorCard";
function NewSession() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoc, setSuggestedDoc] = useState<doctorAgent[]>();
  const onClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctor", {
      notes: note,
    });
    console.log(result.data);
    setSuggestedDoc(result.data);

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Start chat with doctor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoc ? (
              <div>
                <h2>Add Symptoms you are having</h2>
                <Textarea
                  placeholder="type symptoms here..."
                  onChange={(e) => setNote(e.target.value)}
                  className="h-[200px] mt-3"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {suggestedDoc.map((doctor, index) => (
                  <DoctorCard doctorAgent={doctor} key={index} />
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          {!suggestedDoc ? (
            <Button disabled={!note || loading} onClick={() => onClickNext()}>
              Next
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button>Start Consultation</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewSession;
