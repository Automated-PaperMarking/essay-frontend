"use client";
import MarkingForm from "@/components/forms/markingFrom";
import PaperViewer from "@/components/paper/PaperViewer";
import { MarkingProcess } from "@/types/MarkingProcess";
import { useState } from "react";
import { useGetPaperById, usePaperData } from "@/hooks/usePaper";
import MarkingPogress from "@/components/pogress-marking";
import MutationButton from "@/components/ui/mutationButton";
import { useGrade } from "@/hooks/userGrade";
import { toast } from "react-toastify";


export default function Home() {
  const [markingProcess, setMarkingProcess] = useState<MarkingProcess>({
    status: "idle",
    paperId: "",
    markingId: "",
    paper: null,
  });
  const gradePaper = useGrade();
  const getPaper = useGetPaperById(markingProcess.paperId || "");


  // Get paper from React Query hook
  const grade = () => {
    if (!markingProcess.markingId || !markingProcess.paperId) {
      toast.error("Marking ID or Paper ID is missing");
      return;
    }

    gradePaper.mutate(
      {
        markingId: markingProcess.markingId,
        paperId: markingProcess.paperId,
      },
      {
        onSuccess: () => {
          toast.success("Paper graded successfully!");
          // After grading, fetch the latest paper
          getPaper.refetch();
          setMarkingProcess((prev) => ({
            ...prev,
            status: "graded",
          }));
        },
        onError: () => {
          toast.error("Grading failed, please try again");
        },
      }
    );
  };

  return (
    <center className=" min-h-screen  w-full p-4 ">
      <div className="container">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Automated Essay Marking
          {markingProcess.paperId
            ? ` - Paper ID: ${markingProcess.paperId}`
            : ""}
        </h2>
        {markingProcess && <MarkingPogress markingProcess={markingProcess} />}
        {/* paper and marking input form */}
        <MutationButton onClick={grade} loading={gradePaper.isPending}>
          Grade
        </MutationButton>

        {/* Display fetched paper first, then marking paper */}
        {getPaper.data && <PaperViewer paper={getPaper.data} />}
      </div>
    </center>
  );
}
