"use client";
import MarkingForm from "@/components/forms/markingFrom";
import PaperViewer from "@/components/paper/PaperViewer";
import { MarkingProcess } from "@/types/MarkingProcess";
import { useState } from "react";
import { usePaperData } from "@/hooks/usePaper";

export default function Home() {
  const [markingProcess, setMarkingProcess] = useState<MarkingProcess | null>(
    null
  );
  const [paperId, setPaperId] = useState<string>("");

  // Get paper from marking process
  const markingPaper =
    markingProcess?.status === "extracted" ? markingProcess.paper : null;

  // Get paper from React Query hook
  const {
    paper: fetchedPaper,
    isLoading,
    error,
    isEmpty,
  } = usePaperData("3159706e-ec50-4a85-926b-736792a949ba");

  return (
    <center className=" min-h-screen  w-full p-4 ">
      <div className="container">
        <h1>Automated Grading System for Essay Type of Questions</h1>

      

        {/* paper and marking input form */}
        <MarkingForm setMarkingProcess={setMarkingProcess} />

        {/* Display fetched paper first, then marking paper */}
        {fetchedPaper && <PaperViewer paper={fetchedPaper} />}
        {!fetchedPaper && markingPaper && <PaperViewer paper={markingPaper} />}
      </div>
    </center>
  );
}
