"use client";
import PaperViewer from "@/components/paper/PaperViewer";
import MarkingPogress from "@/components/pogress-marking";
import Loading from "@/components/ui/loading";
import MutationButton from "@/components/ui/mutationButton";
import { useProjectContext } from "@/contexts/projectContext";
import { useGetPaperById } from "@/hooks/usePaper";
import { useGrade } from "@/hooks/userGrade";
import { MarkingProcess } from "@/types/MarkingProcess";
import React, { use, useState } from "react";
import { toast } from "react-toastify";

const PaperView = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { projectData, isLodingProject } = useProjectContext();
  const [markingProcess, setMarkingProcess] = useState<MarkingProcess>({
    status: "extracted",
    paperId: id,
    markingId: projectData?.markingId || "",
    paper: null,
  });
  const gradePaper = useGrade();
  const getPaper = useGetPaperById(markingProcess.paperId || "");

  // Get paper from React Query hook
  const grade = () => {
    if (!projectData?.markingId || !markingProcess.paperId) {
      toast.error("Marking ID or Paper ID is missing");
      return;
    }

    gradePaper.mutate(
      {
        markingId: projectData?.markingId || "",
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

  if (isLodingProject || getPaper.isLoading) {
    return <Loading />;
  }

  return (
    <center className=" min-h-screen  w-full p-4 ">
      <div className="container">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Automated Essay Marking
        </h2>
        {markingProcess && <MarkingPogress markingProcess={markingProcess} />}
        <MutationButton onClick={grade} loading={gradePaper.isPending}>
          Grade
        </MutationButton>

        {/* Display fetched paper first, then marking paper */}
        {getPaper.data && <PaperViewer paper={getPaper.data} />}
      </div>
    </center>
  );
};

export default PaperView;
